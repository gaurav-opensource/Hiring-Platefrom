from fastapi import FastAPI, UploadFile, File, Form
import pdfplumber
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn
import io  

app = FastAPI(title="Resume Scoring API")

# Load model once
model = SentenceTransformer('paraphrase-MiniLM-L3-v2')

def clean_text(text):
    return re.sub(r'[^a-zA-Z0-9\s\+\-\.]', ' ', text).lower()

def keyword_score(resume_text, jd_text):
    resume_text, jd_text = resume_text.lower(), jd_text.lower()
    jd_words = set([w for w in re.findall(r'\b\w+\b', jd_text) if len(w) > 2])
    match = [w for w in jd_words if w in resume_text]
    missing = [w for w in jd_words if w not in resume_text]
    score = len(match) / len(jd_words) if jd_words else 0
    return score, missing

def semantic_score(resume_text, jd_text):
    resume_embedding = model.encode([resume_text])[0]
    jd_embedding = model.encode([jd_text])[0]
    sim = cosine_similarity([resume_embedding], [jd_embedding])[0][0]
    return float(sim)

def calculate_resume_score(resume_text, jd_text):
    resume_clean, jd_clean = clean_text(resume_text), clean_text(jd_text)
    k_score, missing = keyword_score(resume_clean, jd_clean)
    s_score = semantic_score(resume_clean, jd_clean)
    final = 0.5*k_score + 0.5*s_score
    return {
        "final_score": round(final*100,2),
        "keyword_score": round(k_score*100,2),
        "semantic_score": round(s_score*100,2),
        "missing_keywords": missing
    }

@app.post("/score_resume/")
async def score_resume(file: UploadFile = File(...), job_description: str = Form(...)):
    pdf_bytes = await file.read()
    text = ""
    # 👇 wrap pdf_bytes inside BytesIO
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
    result = calculate_resume_score(text, job_description)
    print(result);
    return result

if __name__ == "__main__":
    uvicorn.run("index:app", host="127.0.0.1", port=8000, reload=True)
