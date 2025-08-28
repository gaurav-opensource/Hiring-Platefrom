const express = require('express');
const router = express.Router();
const Job = require('../model/job.model.js');
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

    // 1. Job ke sabhi applications lao
    const applications = await ApplicationProgress.find({ jobId });

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job" });
    }

    let updatedApps = [];

    // 2. Har student ke liye link aur token banao
    for (let app of applications) {
      const token = 'djfsdfsdjhfsvfsdfsd fsdbfsdvfdjh'
      const testLink = `http://localhost:3000/students/${jobId}/${app.userId}?token=${token}`;

      app.testLink = testLink;
      app.testToken = token;
      await app.save();

      updatedApps.push({
        userId: app.userId,
        testLink,
        token
      });
    }

    // 3. Response bhejo
    res.status(200).json({
      message: "Test links generated successfully",
      links: updatedApps,
    });
  } catch (err) {
    console.error("Error in generate-links:", err);
    res.status(500).json({ error: err.message });
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
