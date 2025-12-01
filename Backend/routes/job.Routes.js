const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const Job = require('../model/job.model.js');
const TestCodeSave = require("../model/TestCase.model.js");
const Submission = require("../model/submission.model.js");

const {
  applyToJob,
  fetchAllJob,
  updatePipelineStep,
  calculateResumeScore,
  getStudentsByJobId,
  getJobsByHRId,
  evaluateJob,
  stageChange,
  stageChangeInStudent,
  enableTestSection,
  sendEmailoftest
 
} = require('../controller/jobController');
const ApplicationProgress = require('../model/applicationProgress.model.js');
const { sendEmail } = require('../config/emailConfig');


const authenticate = require('../middleware/authMiddleware');


router.post('/apply/:jobId', authenticate, applyToJob);
router.post('/update/:jobId', authenticate, updatePipelineStep);
router.post('/:jobId/stageChange', authenticate, stageChange);
router.post("/:jobId/stageChangeInStudent",authenticate, stageChangeInStudent);
router.post("/change/:jobId", enableTestSection);



router.get('/alljob', fetchAllJob);
router.get('/getjobs',authenticate,getJobsByHRId );
router.get("/students/:jobId", getStudentsByJobId);
router.post("/:jobId/resume-screen",calculateResumeScore);
router.post("/:jobId/evaluate", evaluateJob);


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




router.post("/:jobId/batch-update-stage", async (req, res) => {
    try {
    const { jobId } = req.params;
    const { studentIds, stage } = req.body;

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


router.get("/my-applications-stages",authenticate, async (req, res) => {
  try {
   

   const userId = req.user.userId;

    // 1️⃣ Find all applications for the user
    const applications = await ApplicationProgress.find({ userId }).sort({ createdAt: -1 });

    // 2️⃣ Fetch Job details for each application
    const result = await Promise.all(
      applications.map(async (app) => {
        const job = await Job.findById(app.jobId).select("title company location employmentType");

        return {
          applicationId: app._id,
          jobId: app.jobId,
          jobTitle: job?.title || "N/A",
          company: job?.company || "N/A",
          location: job?.location || "Remote",
          employmentType: job?.employmentType || "N/A",
          currentStage: app.currentStage
        };
      })
    );

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/tracker', authenticate, getJobsByHRId);


module.exports = router;
