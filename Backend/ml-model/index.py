# Required Libraries
# pip install flask pdfplumber spacy sentence-transformers scikit-learn nltk requests

import pdfplumber
import re
import nltk
import requests
import tempfile
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

# NLTK setup
nltk.download('stopwords')
from nltk.corpus import stopwords
stop_words = set(stopwords.words('english'))

app = Flask(__name__)

# ------------------------------
# Step 1: Download PDF from URL
# ------------------------------
def get_pdf_from_url(url):
    response = requests.get(url)
    if response.status_code == 200:
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        temp_file.write(response.content)
        temp_file.close()
        return temp_file.name
    else:
        raise Exception("Failed to download PDF from URL")

# ------------------------------
# Step 2: Extract text from PDF
# ------------------------------
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "
    return text.lower()

# ------------------------------
# Step 3: Clean text
# ------------------------------
def clean_text(text):
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)  # remove special characters
    tokens = text.split()
    tokens = [word for word in tokens if word not in stop_words]
    return " ".join(tokens)

# ------------------------------
# Step 4: Extract sections
# ------------------------------
def extract_sections(text):
    skills, experience, education = [], [], []
    lines = text.split('\n')

    for line in lines:
        line_lower = line.lower()
        if any(word in line_lower for word in ["skill", "technologies", "tools"]):
            skills.append(line)
        elif any(word in line_lower for word in ["experience", "worked at", "projects"]):
            experience.append(line)
        elif any(word in line_lower for word in ["education", "degree", "university", "college"]):
            education.append(line)

    return {
        "skills": " ".join(skills),
        "experience": " ".join(experience),
        "education": " ".join(education)
    }

# ------------------------------
# Step 5: Keyword Matching
# ------------------------------
def keyword_match_score(resume_text, jd_text):
    jd_keywords = set(clean_text(jd_text).split())
    resume_words = set(resume_text.split())
    match_count = len(jd_keywords.intersection(resume_words))
    score = match_count / len(jd_keywords) if len(jd_keywords) > 0 else 0
    return score, jd_keywords - resume_words

# ------------------------------
# Step 6: Semantic Similarity
# ------------------------------
def semantic_similarity_score(resume_text, jd_text):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode([resume_text, jd_text])
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return similarity

# ------------------------------
# Step 7: Section-wise Resume Score
# ------------------------------
def calculate_resume_score(resume_pdf_path, jd_text):
    resume_text = extract_text_from_pdf(resume_pdf_path)
    resume_text = clean_text(resume_text)
    jd_text_clean = clean_text(jd_text)

    sections = extract_sections(resume_text)
    section_scores = {}
    missing_keywords_total = set()

    for section_name, section_text in sections.items():
        if section_text.strip() == "":
            section_scores[section_name] = {
                "keyword_score": 0,
                "semantic_score": 0,
                "missing_keywords": "All"
            }
            continue

        keyword_score, missing_keywords = keyword_match_score(section_text, jd_text_clean)
        semantic_score = semantic_similarity_score(section_text, jd_text_clean)

        section_scores[section_name] = {
            "keyword_score": round(keyword_score * 100, 2),
            "semantic_score": round(semantic_score * 100, 2),
            "missing_keywords": list(missing_keywords)
        }
        missing_keywords_total.update(missing_keywords)

    weights = {"skills": 0.4, "experience": 0.4, "education": 0.2}
    final_score = 0
    for sec, score in section_scores.items():
        sec_avg = 0.5 * score["keyword_score"] + 0.5 * score["semantic_score"]
        final_score += sec_avg * weights.get(sec, 0)

    return {
        "final_score": round(final_score, 2),
        "section_scores": section_scores,
        "missing_keywords_total": list(missing_keywords_total)
    }

# ------------------------------
# Step 8: API Route
# ------------------------------
@app.route("/calculate-score", methods=["POST"])
def calculate_score():
    try:
        data = request.json
        resume_link = data.get("resumeLink")
        job_description = data.get("jobDescription")

        if not resume_link or not job_description:
            return jsonify({"error": "Missing resume link or job description"}), 400

        resume_path = get_pdf_from_url(resume_link)
        result = calculate_resume_score(resume_path, job_description)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
