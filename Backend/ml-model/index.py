from flask import Flask, request, jsonify
import requests
import PyPDF2
import docx
from io import BytesIO
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

app = Flask(__name__)

# -----------------------
# Helper Functions
# -----------------------

def extract_text_from_pdf(file_bytes):
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        print("PDF extraction error:", e)
        return ""

def extract_text_from_docx(file_bytes):
    try:
        doc = docx.Document(BytesIO(file_bytes))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        print("DOCX extraction error:", e)
        return ""

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return text

def calculate_similarity(resume_text, job_description):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return round(similarity * 100, 2)  # return score out of 100

# -----------------------
# API Endpoint
# -----------------------

@app.route("/calculate-score", methods=["POST"])
def calculate_score():
    try:
        data = request.json
        resume_link = data.get("resumeLink")
        job_description = data.get("jobDescription")

        if not resume_link or not job_description:
            return jsonify({"error": "Missing resume link or job description"}), 400

        # 1. Download resume
        response = requests.get(resume_link)
        if response.status_code != 200:
            return jsonify({"error": "Could not fetch resume"}), 400

        file_bytes = response.content
        file_type = resume_link.split(".")[-1].lower()

        # 2. Extract resume text
        if file_type == "pdf":
            resume_text = extract_text_from_pdf(file_bytes)
        elif file_type in ["doc", "docx"]:
            resume_text = extract_text_from_docx(file_bytes)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        # 3. Clean both texts
        resume_text = clean_text(resume_text)
        job_description = clean_text(job_description)

        # 4. Calculate similarity score
        score = calculate_similarity(resume_text, job_description)

        return jsonify({"score": score})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------
# Run the Flask app
# -----------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)

