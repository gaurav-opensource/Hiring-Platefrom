
# Hiring Project

https://github.com/gaurav-opensource/Hiring-Platefrom/assets/banner-video.png

## 🎥 Project Demo (Click to Watch)

[![Watch Video](./frontend/src/assets/home_page.png)](https://www.canva.com/design/DAG6tBW2sls/zM5cWMKwrZU0KHZ0juv5vA/watch)


*(Thumbnail opens the full project video demo)*

---

I developed a full-stack **Hiring Platform** where students can directly connect with companies, apply for jobs, give coding tests, and get evaluated automatically.  
The system manages the **entire recruitment workflow** — from job posting, resume evaluation, coding assessments, to interview shortlisting.

It integrates an **AI-powered Resume Scoring API** and a built-in **online code editor** for coding assessments.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [AI Resume Scoring System](#ai-resume-scoring-system)
- [Video Demo](#video-demo)
- [Installation](#installation)
- [Project Flow](#project-flow)
- [Future Improvements](#future-improvements)
- [Contact](#contact)

---

## 📘 About the Project

The **Hiring Project** is a full-stack recruitment system built to automate real-world hiring.

It offers:

- Job posting portal for HR  
- Student registration + resume upload  
- AI-powered resume screening  
- Automated coding test evaluation  
- Step-by-step shortlisting process  

This is an end-to-end solution demonstrating **full-stack + AI + system design**.

---

## ✨ Features

- **Two Roles:** Student & HR
- **Student Panel:**  
  - Create profile  
  - Upload resume  
  - Apply for jobs  
  - Give coding tests  
  - Track application status  
- **HR Panel:**  
  - Create & manage job listings  
  - AI resume screening  
  - Candidate scoring dashboard  
  - Coding test evaluation  
  - Interview shortlisting  
- **AI Resume Scoring:**  
  - FastAPI NLP microservice  
  - Extract, clean & analyze resume text  
  - Calculate similarity with Job Description  
- **Coding Test System:**  
  - Judge0 API integrated  
  - Real-time code execution  

---

## 🖼️ Screenshots

### 🧑‍🎓 Student Dashboard
![Student Dashboard](./frontend/src/assets/student_dashboard.png)

### 👩‍💼 HR Dashboard
![HR Dashboard](./frontend/src/assets/hr_dashboard.png)

### 💻 Home Page
![Home Page](./frontend/src/assets/home_page.png)

### 📊 Resume Score Analysis
![Resume Score](./frontend/src/assets/resume_score.png)

### 📬 Application Status Page
![Application Status](./frontend/src/assets/application-status.png)

---

## 🧠 Technology Stack

### Frontend
- React  
- Tailwind CSS  

### Backend
- Node.js  
- Express.js  
- MongoDB  

### AI Microservice
- FastAPI  
- pdfplumber  
- SentenceTransformer (MiniLM-L3-v2)  
- scikit-learn  

### Other Tools
- Judge0 API  
- JWT Authentication  
- Nodemailer  
- Bcrypt  

---

## 🤖 AI Resume Scoring System

A FastAPI service that evaluates resumes using:

### 🔍 Working Steps
1. Text extraction (PDF → raw text)  
2. Preprocessing & cleaning  
3. Keyword matching  
4. Semantic similarity using MiniLM-L3-v2  
5. Final score generation  

### 🔥 Example API Output

```json
{
  "final_score": 87.45,
  "keyword_score": 82.33,
  "semantic_score": 92.57,
  "missing_keywords": ["react", "mongodb"]
}
````

---

## 🎥 Video Demo

### ▶ Watch the Full Project Walkthrough

**Click the thumbnail below**

[![Watch Video](https://img.youtube.com/vi/1x4h3nM8Ujs/maxresdefault.jpg)](https://www.canva.com/design/DAG6tBW2sls/zM5cWMKwrZU0KHZ0juv5vA/watch)

---

## ⚙ Installation

### Clone the Repository

```bash
git clone https://github.com/gaurav-opensource/Hiring-Platefrom.git
cd hiring-project
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Run AI Microservice

```bash
cd ml_api
python app.py
```

---

## 🧭 Project Flow

### 👨‍🎓 Student Flow

* Register → Create Profile → Upload Resume
* Apply to Jobs
* Give coding test
* Track status

### 🧑‍💼 HR Flow

* Register → Create Job
* AI Resume Screening
* Coding Test Review
* Shortlist Candidates

---

## 🚀 Future Improvements

* Real-time Notifications
* Video Interview Module
* Advanced Resume Parsing (BERT)
* HR Analytics Dashboard
* Bulk Email/SMS System

---

## 📬 Contact

**Author:** Gaurav Yadav
**Email:** [gauravyadavgh@example.com](mailto:gauravyadavgh@example.com)
**LinkedIn:** [https://www.linkedin.com/in/gauravyadav95/](https://www.linkedin.com/in/gauravyadav95/)
**GitHub:** [https://github.com/gaurav-opensource](https://github.com/gaurav-opensource)

---

```


