const Queue = require("bull");
const axios = require("axios");
const ApplicationProgress = require("../model/applicationProgress.model.js");

// Create a queue named "resumeQueue"
const resumeQueue = new Queue("resumeQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379
  }
});

// Worker to process each job in the queue
resumeQueue.process(async (job) => {
  const { progressId, resumeLink, jobDescription } = job.data;

  try {
    // Call Python ML API to calculate resume score
    const response = await axios.post("http://127.0.0.1:5001/calculate-score", {
      resumeLink,
      jobDescription
    });

    const score = response.data.score;

    // Update ApplicationProgress in MongoDB
    await ApplicationProgress.findByIdAndUpdate(progressId, {
      resumeScore: score,
      currentStage: "resume" // move to next stage
    });
     console.log("Python result:", res.data);

    console.log(`Resume scoring completed for application: ${progressId}`);
    return Promise.resolve();
  } catch (err) {
    console.error(`Error processing resume for application: ${progressId}`, err.message);
    return Promise.reject(err);
  }
});

// Optional: Event listeners for monitoring
resumeQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

resumeQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = resumeQueue;
