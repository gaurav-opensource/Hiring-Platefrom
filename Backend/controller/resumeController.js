// controllers/applicationController.js
const Job = require("../models/jobModel");
const ApplicationTracker = require("../models/applicationTrackerModel");
const axios = require("axios");


exports.calculateScoresForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

   
    const job = await Job.findById(jobId).populate("applicants");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }


    const jdWeightsMap = {};
    job.skillsRequired.forEach(skill => {
      jdWeightsMap[skill] = 3; 
    });

    const results = [];

    
    for (const applicant of job.applicants) {
      if (!applicant.resumeUrl) continue; // Skip if resume missing

      
      const atsResponse = await axios.post("http://localhost:8000/score", {
        jd_weights: jdWeightsMap,
        resume_url: applicant.resumeUrl,
        job_description: job.description,
        use_similarity: true
      });

      const scoreData = atsResponse.data;

     
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
