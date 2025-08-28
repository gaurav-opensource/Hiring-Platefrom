// controllers/applicationController.js
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const ApplicationTracker = require("../models/applicationTrackerModel");
const axios = require("axios");

// Calculate ATS score for all applicants of a job
exports.calculateScoresForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Get job with applicants
    const job = await Job.findById(jobId).populate("applicants");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2. Prepare JD weights (your HR-defined skills with weights)
    // Example: Convert job.skillsRequired into a map with HR-provided weights
    // This should ideally come from DB when HR creates job
    const jdWeightsMap = {};
    job.skillsRequired.forEach(skill => {
      jdWeightsMap[skill] = 3; // default weight; can be set manually by HR
    });

    const results = [];

    // 3. Loop through applicants
    for (const applicant of job.applicants) {
      if (!applicant.resumeUrl) continue; // Skip if resume missing

      // 4. Call ML ATS Scoring API
      const atsResponse = await axios.post("http://localhost:8000/score", {
        jd_weights: jdWeightsMap,
        resume_url: applicant.resumeUrl,
        job_description: job.description,
        use_similarity: true
      });

      const scoreData = atsResponse.data;

      // 5. Save or update ApplicationTracker (only score)
      let tracker = await ApplicationTracker.findOne({ jobId, userId: applicant._id });

      if (tracker) {
        tracker.score = scoreData.final_score;
        await tracker.save();
      } else {
        tracker = await ApplicationTracker.create({
          jobId,
          userId: applicant._id,
          score: scoreData.final_score
        });
      }

      results.push({
        userId: applicant._id,
        score: scoreData.final_score
      });
    }

    return res.json({
      message: "Scores calculated successfully",
      results
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
