# Hiring Project

I developed a full-stack **Hiring Platform** where students can directly connect with companies and apply for jobs.
The system manages the **entire recruitment workflow** — from job posting to resume evaluation, coding tests, and interviews.
It integrates **ML models** for resume scoring and test evaluation, and also includes a built-in **online code editor**.

---

## Table of Contents

* [About the Project](#about-the-project)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Getting Started](#getting-started)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Project Flow](#project-flow)

  * [Student Flow](#student-flow)
  * [HR Flow](#hr-flow)
* [Future Improvements](#future-improvements)
* [License](#license)
* [Contact](#contact)

---

## About the Project

The **Hiring Project** is a full-stack recruitment system designed to connect students and recruiters.
It simplifies the hiring process by providing:

* Job posting by HR
* Student applications with resumes
* Automated resume scoring (ML)
* Online test system with real-time code editor
* Test evaluation using ML
* Candidate shortlisting for interviews

This project demonstrates **end-to-end recruitment automation** with both web development and AI/ML integration.

---

## Features

* **User Roles:** Separate portals for Students and HR.
* **Student Profile:** Students create detailed profiles and upload resumes.
* **Job Posting:** HR can create and manage job listings.
* **Application Tracking:** Each student-job pair is tracked with a unique record.
* **Recruitment Stages:**

  1. Resume Submission
  2. Profile Screening
  3. Online Coding Test
  4. Test Evaluation & Analysis
  5. Interview Shortlisting
* **Resume Score Calculation:** ML model calculates resume quality and stores it in the database.
* **Code Editor:** Integrated online coding environment using **Judge0 API**.
* **Test Evaluation:** Scores automatically calculated for each student.
* **Dashboard for HR:** HR can see all applicants, their scores, and shortlist them step by step.

---

## Technology Stack

* **Frontend:**

  * React
  * Tailwind CSS

* **Backend:**

  * Node.js & Express.js
  * MongoDB
  * Mongoose

* **Machine Learning Models:**

  * Python (Resume Scoring & Test Evaluation)

* **Key Tools & Libraries:**

  * Judge0 API (for code execution & online tests)
  * JWT (for authentication)
  * Bcrypt (for password hashing)
  * Nodemailer (for sending test emails & notifications)

---

## Getting Started

### Prerequisites

* Node.js (v14 or higher) and npm
* MongoDB database (local or cloud)
* Git client
* Python environment for ML models
* Judge0 API credentials

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gaurav-opensource/hiring-project.git
   cd hiring-project
   ```

2. Setup Backend:

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory with:

   ```
   MONGO_URI=mongodb://127.0.0.1:27017/hiring-project
   PORT=5000
   JWT_SECRET=your_super_secret_key
   JUDGE0_API_KEY=your_judge0_api_key
   ```

   Start the backend server:

   ```bash
   npm start
   ```

3. Setup Frontend:
   Open a new terminal window:

   ```bash
   cd frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

   Start the frontend server:

   ```bash
   npm start
   ```

---

## Project Flow

### Student Flow

* Register and create a profile (upload resume, personal info).
* View all job postings.
* Apply to jobs (resume automatically submitted).
* Get notifications about tests and interviews.
* Solve coding tests using the **built-in code editor**.
* Progress through recruitment stages.

### HR Flow

* Register and create HR profile.
* Post new jobs.
* View all applicants for each job.
* Stage 1: Resume Scoring (ML model ranks students).
* Stage 2: Shortlist top students.
* Stage 3: Send coding tests via email link.
* Stage 4: Evaluate test scores (ML + Judge0).
* Stage 5: Select candidates for interview.

---

## Future Improvements

* Add **real-time notifications** with Socket.IO.
* Integrate **video interviews** inside the platform.
* Improve **resume parsing and scoring** with NLP models.
* Add **analytics dashboard** for HR with hiring insights.
* Enable **bulk email/SMS notifications** for candidates.

---

## Contact

For questions, suggestions, or feedback, feel free to reach out:

* **Author:** Gaurav Yadav
* **Email:** [gauravyadavgh@example.com](mailto:gauravyadavgh@example.com)
* **LinkedIn:** [linkedin.com/in/gauravyadav](https://www.linkedin.com/in/gauravyadav95/)
* **GitHub:** [github.com/gauravyadav](https://github.com/gaurav-opensource)
