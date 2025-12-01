const ApplicationProgress = require('../model/applicationProgress.model.js');
const Job = require('../model/job.model.js');
const Submission = require("../model/submission.model.js");
const Question = require("../model/question.model.js");
const PQueue = require("p-queue").default;
require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");



//student apply for job
const applyToJob = async (req, res) => {
  const { jobId } = req.params;//get job id from header
  const {name, email, resumeLink } = req.body;
  const userId = req.user.userId;

  try {
    const jobData = await Job.findById(jobId);
    if (!jobData) return res.status(404).json({ message: "Job not found" });

    const existingProgress = await ApplicationProgress.findOne({ userId, jobId });
    if (existingProgress) return res.status(400).json({ message: "You have already applied for this job" });
  

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

//student get all applied job
const getAppliedJobs = async (req, res) => {
  try {
    const {userId} = req.user.userId; 
   
    const applications = await ApplicationProgress.find({ userId })
      .populate("jobId", "title company location description");

    if (!applications || applications.length === 0) return res.status(404).json({ message: "No applied jobs found" });
    
    const formatted = applications.map(app => ({
      jobId: app.jobId._id,
      title: app.jobId.title,
      company: app.jobId.company,
      location: app.jobId.location,
      description: app.jobId.description,
      currentStage: app.stage,  
      allStages: ['resume', 'test', 'interview', 'final', 'rejected']
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ message: error.message });
  }
};


//calculate resume score basis of  job description
const calculateResumeScore = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log("Calculate Resume Score")

    // 1. Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // 2. Find applicants
    const applicants = await ApplicationProgress.find({ jobId });
    if (applicants.length === 0) return res.status(404).json({ message: "No applicants found" });
    

    // 3. Build job description text
    let jobDescriptionText = job.description || "";
    if (job.requirements?.length > 0) jobDescriptionText += "\nRequirements: " + job.requirements.join(", ");
    
    if (job.responsibilities?.length > 0) {
      jobDescriptionText +=
        "\nResponsibilities: " + job.responsibilities.join(", ");
    }

    console.log("Processing resume scores...");

    const results = [];

    // 4. Iterate over applicants
    for (const applicant of applicants) {
      if (!applicant.resumeLink) continue;

      try {
        // Fetch the resume PDF from Cloudinary
        const resumePdf = await axios.get(applicant.resumeLink, {
          responseType: "arraybuffer",
        });

        // Create FormData (use Buffer, not Blob!)
        const formData = new FormData();
        formData.append("file", Buffer.from(resumePdf.data), {
          filename: "resume.pdf",
          contentType: "application/pdf",
        });
        formData.append("job_description", jobDescriptionText);

        // Send to Python FastAPI
        const response = await axios.post(
          "http://127.0.0.1:8000/score_resume/",
          formData,
          { headers: formData.getHeaders() }
        );

        const scoreData = response.data;
        console.log(scoreData)
       
        applicant.resumeScore = scoreData.final_score;
        await applicant.save();

        results.push({
          userId: applicant.userId,
          name: applicant.name,
          email: applicant.email,
          resumeLink: applicant.resumeLink,
          score: scoreData.final_score,
        });
      } catch (err) {
        console.error(
          "Error scoring resume:",
          applicant.resumeLink,
          err.message
        );
      }
    }

    // 5. Send response
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


//state change in job after completed current state
const stageChange = async (req, res) => {
  try {
    const { jobId } = req.params;    
    const { stage } = req.body;       

    if (!stage) return res.status(400).json({ message: "Stage is required" });
    

    // Find and update job
    const job = await Job.findByIdAndUpdate(
      jobId,
      { stage },
      { new: true }   
    );

    if (!job) return res.status(404).json({ message: "Job not found" });
    

    return res.json({ message: "Stage updated successfully",job,});
  } catch (error) {
    console.error("Error in stageChange:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//state chnage in student dashboard
const stageChangeInStudent = async (req, res) => {
  try {
    const { jobId } = req.params;             // from URL
    const { studentIds, stage } = req.body;   // from request body

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ message: "No student IDs provided" });
    }
    if (!stage) return res.status(400).json({ message: "Stage is required" });
    

    // Update all matching ApplicationProgress docs
    const result = await ApplicationProgress.updateMany(
      { jobId, userId: { $in: studentIds } },
      { $set: { stage } }
    );

    return res.json({
      message: "Student stages updated successfully",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error in stageChangeInStudent:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//get all existing job of hr
const getJobsByHRId = async (req, res) => {
  try {
    const hrId = req.user.userId;
    const jobs = await Job.find({ postedBy: hrId }).sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// fetch all jobs
const fetchAllJob = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

//Get all job whose student applied
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
//

//Get top scores profile after calculate resume score
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

//upadate step pipe line so easily identify 
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


const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  java: 62,
};


const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = "1b7e563300msh3a6a8fa89c5812bp17fcd1jsn302890a8dc8a";
const JUDGE0_HOST = "judge0-ce.p.rapidapi.com";


const evaluateJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const submissions = await Submission.find({ jobId }).populate("userId");
    console.log(`Found ${submissions.length} submissions for job ${jobId}`);

    if (!submissions.length) {
      return res
        .status(404)
        .json({ message: "No submissions found for this job" });
    }

    const queue = new PQueue({ concurrency: 2, interval: 1000, intervalCap: 2 });

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

    await queue.onIdle();

    res.json({ message: "Evaluation completed successfully ✅" });
  } catch (error) {
    console.error("Server error in evaluateJob:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const sendEmailoftest = async(req,res) =>{
  

}
const enableTestSection = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndUpdate(
      jobId,
      { $set: { testSection: true } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json({
      message: "Test section enabled successfully",
      job,
    });
  } catch (error) {
    console.error("Error in enableTestSection:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const sendTestEmail = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { description, startTime, endTime } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicants = await ApplicationProgress.find({ jobId, currentStage: "test" })
      .populate("userId");

    if (!applicants || applicants.length === 0) {
      return res.status(404).json({ message: "No applicants found in test stage" });
    }

    for (const applicant of applicants) {
      if (!applicant.userId) continue;

      const testLink = `${process.env.APP_BASE_URL}/test/${applicant.userId._id}/${job._id}?start=${encodeURIComponent(
        startTime
      )}&end=${encodeURIComponent(endTime)}`;

      await sendEmail({
        to: applicant.userId.email,
        subject: `Coding Test Invitation for ${job.title}`,
        html: `
          <p>Dear <strong>${applicant.userId.name}</strong>,</p>
          <p>${description}</p>
          <p><strong>Test Window:</strong> 
             ${new Date(startTime).toLocaleString()} - 
             ${new Date(endTime).toLocaleString()}</p>
          <p><a href="${testLink}">Start Test</a></p>
        `,
      });
    }

    return res.json({ message: "Test emails sent successfully!" });

  } catch (error) {
    console.error("Error sending test emails:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = {
  applyToJob,
  evaluateJob,
  getJobsByHRId,
  fetchAllJob,
  getAppliedJobs,
  updatePipelineStep,
  getStudentsByJobId,
  calculateResumeScore,
  stageChange,
  stageChangeInStudent,
  enableTestSection,
  sendEmailoftest,
  sendTestEmail
}