const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const Job = require('../model/job.model.js');
const TestCodeSave = require("../model/TestCase.model.js");
const Submission = require("../model/submission.model.js");

const {
  applyToJob,
  fetchAllJob,
  getAppliedJobs,
   updatePipelineStep,
  calculateResumeScore,
//   shortlistTopByResume,
//   submitTestScore,
//   shortlistAfterTest,
  getStudentsByJobId,
  getJobsByHRId,
  evaluateJob
 
} = require('../controller/jobController');
const ApplicationProgress = require('../model/applicationProgress.model.js');

const {
  getShuffledQuestions,
  submitSolution,
} = require('../controller/testController');

const authenticate = require('../middleware/authMiddleware');

// -------------------- Job Related -------------------- //

// 📌 Apply to a job
router.post('/apply/:jobId', authenticate, applyToJob);
router.post('/update/:jobId', authenticate, updatePipelineStep);

// 📌 Fetch all jobs
router.get('/alljob', fetchAllJob);
router.get('/getjobs',authenticate,getJobsByHRId );
router.get("/students/:jobId", getStudentsByJobId);
router.post("/:jobId/resume-screen",calculateResumeScore);
router.post("/:jobId/evaluate", evaluateJob);

// routes/jobRoutes.js
router.post("/:jobId/select-students", async (req, res) => {
  try {
    const { studentIds } = req.body; // selected student ids
    const { jobId } = req.params;

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ message: "No students selected" });
    }

    // Update selected students stage = test
    await ApplicationProgress.updateMany(
      { jobId, studentId: { $in: studentIds } },
      { $set: { stage: "test" } }
    );

    res.json({ success: true, message: "Students moved to test stage" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error selecting students" });
  }
});

router.post("/:jobId/generate-links", async (req, res) => {
  try {
    const { jobId } = req.params;
    const { email: hrEmail } = req.body; // HR email

    // 1️⃣ Job ke sabhi applications fetch karo
    const applications = await ApplicationProgress.find({ jobId });

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job" });
    }

    // 2️⃣ Filter only students in "test" stage
    const testStageApps = applications.filter(app => app.currentStage === "test");

    if (testStageApps.length === 0) {
      return res.status(404).json({ message: "No students are in the Test stage" });
    }

    // 3️⃣ Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: hrEmail, // HR email se send
        pass: "your-email-password-or-app-password", // secure way use env variable
      },
    });

    let updatedApps = [];

    for (let app of testStageApps) {
      // ⚡️ Secure token
      const token = 'fdsjfndsdbvdvfbdbdbdjfbdffb';
      const testLink = `http://localhost:3000/students/${jobId}/${app.userId}?token=${token}`;

      // 4️⃣ Update application
      app.testLink = testLink;
      app.testToken = token;
      await app.save();

      // 5️⃣ Send email to student
      await transporter.sendMail({
        from: hrEmail,
        to: app.email,
        subject: `Coding Test Link for Job ${jobId}`,
        html: `<p>Dear Candidate,</p>
               <p>Your coding test for job <strong>${jobId}</strong> is ready.</p>
               <p>Click here to start: <a href="${testLink}">${testLink}</a></p>
               <p>Best Regards,<br/>HR Team</p>`,
      });

      updatedApps.push({
        userId: app.userId,
        testLink,
        token,
        email: app.email,
      });
    }

    res.status(200).json({
      message: "Test links generated and emailed successfully for students in Test stage",
      links: updatedApps,
    });
  } catch (err) {
    console.error("Error in generate-links:", err);
    res.status(500).json({ error: err.message });
  }
});



router.post("/:jobId/batch-update-stage", async (req, res) => {
    try {
    const { jobId } = req.params;
    const { studentIds, stage } = req.body;
    console.log("My Name is gaurav yadav")

    if (!studentIds || !stage || !Array.isArray(studentIds)) {
      return res.status(400).json({ message: "studentIds array and stage required" });
    }

    const result = await ApplicationProgress.updateMany(
      { jobId, _id: { $in: studentIds } },
      { currentStage: stage }
    );

    res.json({
      message: `${result.modifiedCount} applicants updated to stage ${stage}`,
    });
  } catch (err) {
    console.error("Error in batch updating applicants:", err);
    res.status(500).json({ message: "Server error" });
  }
});





router.post("/:jobId/step/:stepIndex", async (req, res) => {
  try {
    const { jobId, stepIndex } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.currentStep = stepIndex; // save current step index
    await job.save();

    res.json({ message: "Step updated", currentStep: job.currentStep });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/test/save
router.post("/save", async (req, res) => {
  try {
    const { userId, jobId, questionId, code, language } = req.body;

    let submission = await TestCodeSave.findOne({ userId, jobId });

    if (!submission) {
      // Agar entry pehli baar ban rahi hai
      submission = new TestCodeSave({
        userId,
        jobId,
        submissions: [{ questionId, code, language }],
      });
    } else {
      // Yaha error aa raha hai
      if (!submission.submissions) {
        submission.submissions = []; // ✅ fix: ensure array exists
      }

      const existingIndex = submission.submissions.findIndex(
        (s) => s.questionId.toString() === questionId.toString()
      );

      if (existingIndex > -1) {
        // Update existing
        submission.submissions[existingIndex].code = code;
        submission.submissions[existingIndex].language = language;
      } else {
        // Push new
        submission.submissions.push({ questionId, code, language });
      }
    }

    await submission.save();
    res.json({ success: true, message: "Code saved successfully" });
  } catch (error) {
    console.error("Error while saving test code:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// POST /api/test/submit
router.post("/submit", async (req, res) => {
  try {
  const { userId, jobId } = req.body;
  console.log(jobId)
  const test = await TestCodeSave.findOne({ userId, jobId });

if (!test) return res.status(400).json({ error: "No saved answers" });

await Submission.create({
  userId,
  jobId,
  submissions: test.submissions.map(q => ({
    questionId: q.questionId,
    code: q.code,
    language: q.language,
  })),
});

// Optional: delete temp save
await TestCodeSave.deleteOne({ _id: test._id });

res.json({ success: true, message: "Final test submitted!" });

} catch (err) {
  console.error("Error while submitting test:", err);
  res.status(500).json({ error: err.message });
}

});









// 📌 Update resume scores
// router.post('/calculate-resume-score/:jobId', auth, calculateResumeScore);

// // 📌 Shortlist top candidates
// router.post('/shortlist', shortlistTopByResume);

// // 📌 Submit test score
// router.put('/submit-test/:applicationId', auth, submitTestScore);

// // 📌 Shortlist after test
// router.post('/shortlist/test', auth, shortlistAfterTest);

// // 📌 Get HR jobs
router.get('/tracker', authenticate, getJobsByHRId);

// // -------------------- Test Related -------------------- //

// // 📌 Get shuffled questions
// router.get('/test/:jobId/attempt', auth, getShuffledQuestions);

// // 📌 Submit test solution
// router.post('/test/:jobId/submit', auth, submitSolution);

module.exports = router;
