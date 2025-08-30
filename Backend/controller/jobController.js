const ApplicationProgress = require('../model/applicationProgress.model.js');
const Job = require('../model/job.model.js');
const User = require('../model/user.model.js');
const JobPipeline = require('../model/currentstep.model.js');
const Submission = require("../model/submission.model.js");
const Question = require("../model/question.model.js");
const PQueue = require("p-queue").default;
// const resumeQueue = require("./resumeQueue.js");
// const nodemailer = require("nodemailer");
// const Question = require("../model/question.model.js");
require("dotenv").config();
const axios = require("axios");



const applyToJob = async (req, res) => {
  const { jobId } = req.params;
  const {name, email, resumeLink } = req.body;
  const userId = req.user.userId;

  try {
    const jobData = await Job.findById(jobId);
    if (!jobData) return res.status(404).json({ message: "Job not found" });

    const existingProgress = await ApplicationProgress.findOne({ userId, jobId });
    if (existingProgress) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const progress = new ApplicationProgress({
      name,
      email,
      userId,
      jobId,
      resumeLink,
      currentStage: "resume"
    });
    await progress.save();
    res.status(201).json({ message: "Applied successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying for job" });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const {userId} = req.user.userId; 


   
    const applications = await ApplicationProgress.find({ userId })
      .populate("jobId", "title company location description");

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applied jobs found" });
    }

    // Response को format करके भेजो
    const formatted = applications.map(app => ({
      jobId: app.jobId._id,
      title: app.jobId.title,
      company: app.jobId.company,
      location: app.jobId.location,
      description: app.jobId.description,
      currentStage: app.stage,  // जैसे "resume", "test", "interview", etc.
      allStages: ['resume', 'test', 'interview', 'final', 'rejected']
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ message: error.message });
  }
};

const calculateResumeScore = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2. Get applicants for this job
    const applicants = await ApplicationProgress.find({ jobId });
    if (applicants.length === 0) {
      return res.status(404).json({ message: "No applicants found for this job" });
    }

    // ✅ Job description string (combine description + requirements + responsibilities)
    let jobDescriptionText = job.description || "";
    if (job.requirements && job.requirements.length > 0) {
      jobDescriptionText += "\nRequirements: " + job.requirements.join(", ");
    }
    if (job.responsibilities && job.responsibilities.length > 0) {
      jobDescriptionText += "\nResponsibilities: " + job.responsibilities.join(", ");
    }

    const results = [];

    // 3. Loop through applicants
    for (const applicant of applicants) {
      if (!applicant.resumeLink) continue; // skip if no resume

      // 4. Call Flask API
      const atsResponse = await axios.post("http://localhost:5002/calculate-score", {
        resumeLink: applicant.resumeLink,
        jobDescription: jobDescriptionText
      });
     

      const scoreData = atsResponse.data;
       console.log(scoreData)

      // 5. Update applicant resumeScore
      applicant.resumeScore = scoreData.score;
      await applicant.save();

      results.push({
        userId: applicant.userId,
        name: applicant.name,
        email: applicant.email,
        resumeLink: applicant.resumeLink,
        score: scoreData.score
      });
    }

    return res.json({
      message: "Resume scores calculated successfully",
      results,
    });

  } catch (error) {
    console.error("Error in calculateResumeScore:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getJobsByHRId = async (req, res) => {
  try {
    const hrId = req.user.userId;
    const jobs = await Job.find({ postedBy: hrId }).sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const fetchAllJob = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};


const getStudentsByJobId = async (req, res) => {
  try {
  const { jobId } = req.params;
  console.log("JobId:", jobId);

  const applicants = await ApplicationProgress.find({ jobId }).populate("userId");

  // Console me saare applicants print karo
  console.log("Applicants List:", applicants);

  // Agar frontend ko bhi bhejna ho to ye line rakho
  res.json(applicants);

} catch (err) {
  console.error("Error fetching applicants:", err);
  res.status(500).json({ message: "Server Error" });
}

};
// // 📌 Shortlist by resume
const shortlistTopByResume = async (req, res) => {
  const { jobId, topN } = req.body;
  if (!jobId || !topN || isNaN(topN) || topN <= 0) {
    return res.status(400).json({ message: "Invalid jobId or topN" });
  }

  try {
    const applications = await ApplicationProgress.find({ jobId })
      .populate("userId", "name email")
      .sort({ resumeScore: -1 });

    if (!applications.length) return res.status(404).json({ message: "No applications found" });

    const shortlisted = applications.slice(0, Number(topN));
    const rejected = applications.slice(Number(topN));

    for (const app of shortlisted) {
      app.isShortlisted = true;
      app.currentStage = "test";
      await app.save();
    }
    for (const app of rejected) {
      app.isShortlisted = false;
      app.currentStage = "rejected";
      await app.save();
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    for (const student of shortlisted) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.userId.email,
          subject: "Resume Screening Result",
          html: `<h2>Congratulations ${student.userId.name}!</h2>
                 <p>You have been shortlisted for Job ID: ${jobId}.</p>`,
        });
      } catch (err) {
        console.error(`Failed to send email to ${student.userId.email}`, err.message);
      }
    }

    res.json({
      message: `Shortlisted top ${topN} candidates`,
      shortlisted: shortlisted.map(s => ({
        name: s.userId.name,
        email: s.userId.email,
        resumeScore: s.resumeScore,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // 📌 Submit test score
// const submitTestScore = async (req, res) => {
//   const { applicationId } = req.params;
//   const { testScore } = req.body;

//   try {
//     const application = await ApplicationProgress.findOne({
//       _id: applicationId,
//       isShortlisted: true,
//       currentStage: 'test'
//     });

//     if (!application) return res.status(400).json({ error: 'Candidate not eligible for test' });

//     application.testScore = testScore;
//     application.currentStage = 'interview';
//     await application.save();

//     res.json({ message: 'Test score submitted', application });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // 📌 Shortlist after test
// const shortlistAfterTest = async (req, res) => {
//   const { jobId, topN } = req.body;
//   try {
//     const shortlisted = await ApplicationProgress.find({ jobId, currentStage: 'interview' })
//       .sort({ testScore: -1 })
//       .limit(topN);

//     for (const app of shortlisted) {
//       app.currentStage = 'final';
//       await app.save();
//     }

//     res.json({ message: 'Final shortlist completed', shortlisted });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // 📌 Application tracker
// const getApplicationTracker = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const applications = await ApplicationProgress.find({ userId })
//       .select('jobId currentStage testScore')
//       .populate('jobId', 'title companyName');

//     if (!applications.length) {
//       return res.status(404).json({ message: 'No applications found' });
//     }

//     res.json({ message: 'Application tracker fetched', tracker: applications });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // 📌 Create question
// const createQuestion = async (req, res) => {
//   try {
//     const { jobId, title, text, type, options, correctOption, keywords, language, template, testCases, weight } = req.body;

//     if (!jobId || !title || !text || !type) {
//       return res.status(400).json({ message: "Required fields missing!" });
//     }

//     const newQuestion = new Question({ jobId, title, text, type, options, correctOption, keywords, language, template, testCases, weight });
//     await newQuestion.save();

//     res.status(201).json({ message: "✅ Question created successfully", question: newQuestion });
//   } catch (err) {
//     console.error("Error creating question:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
const updatePipelineStep = async(req,res) =>{
  const { jobId } = req.params;
  const { step, status } = req.body;

  try {
    let pipeline = await JobPipeline.findOne({ jobId });

    if (!pipeline) {
      pipeline = new JobPipeline({ jobId });
    }

    if (status === "completed" && !pipeline.completedSteps.includes(step)) {
      pipeline.completedSteps.push(step);
      pipeline.currentStep = step; // last completed step update
    }

    await pipeline.save();
    res.json(pipeline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// controllers/evaluateController.js



const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  java: 62,
  "c++": 54,
  c: 50,
};
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = "1b7e563300msh3a6a8fa89c5812bp17fcd1jsn302890a8dc8a";
const JUDGE0_HOST = "judge0-ce.p.rapidapi.com";
const evaluateJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    // ✅ Step 1: Find all submissions for this job
    const submissions = await Submission.find({ jobId }).populate("userId");
    console.log(`Found ${submissions.length} submissions for job ${jobId}`);

    if (!submissions.length) {
      return res
        .status(404)
        .json({ message: "No submissions found for this job" });
    }

    // ✅ Create queue (to avoid Judge0 429 errors)
    const queue = new PQueue({ concurrency: 2, interval: 1000, intervalCap: 2 });

    // ✅ Step 2: Process each student's submissions
    for (let submission of submissions) {
      const { userId, submissions: answers } = submission;

      let totalTestCases = 0;
      let correctTestCases = 0;

      for (let ans of answers) {
        const { questionId, code, language } = ans;

        const question = await Question.findById(questionId);
        if (!question || !question.testCases) continue;

        for (let test of question.testCases) {
          totalTestCases++;

          // ✅ Add Judge0 execution to queue
          queue.add(async () => {
            try {
              const response = await axios.post(
                `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
                {
                  source_code: code,
                  language_id: 71,
                  stdin: test.input,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": JUDGE0_KEY,
                    "X-RapidAPI-Host": JUDGE0_HOST,
                  },
                }
              );

              const output = response.data.stdout?.trim();
              if (output === test.output.trim()) {
                correctTestCases++;
              }
            } catch (err) {
              console.error("Judge0 error:", err.message);
            }
          });
        }
      }

      // ✅ Save results after queue finishes all tasks for this student
      queue.add(async () => {
        const scorePercent = totalTestCases
          ? Math.round((correctTestCases / totalTestCases) * 100)
          : 0;

        await ApplicationProgress.findOneAndUpdate(
          { userId, jobId },
          {
            score: scorePercent,
            correct: correctTestCases,
            total: totalTestCases,
          },
          { upsert: true, new: true }
        );
      });
    }

    // ✅ Wait for all Judge0 + DB tasks
    await queue.onIdle();

    res.json({ message: "Evaluation completed successfully ✅" });
  } catch (error) {
    console.error("Server error in evaluateJob:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ================== Export All ================== //
module.exports = {
  applyToJob,
  // calculateResumeScore,
  evaluateJob,
  getJobsByHRId,
  fetchAllJob,
  getAppliedJobs,
  updatePipelineStep,
  getStudentsByJobId,
  calculateResumeScore
  // shortlistTopByResume,
  // submitTestScore,
  // shortlistAfterTest,
  // getApplicationTracker,
  // createQuestion,
};
