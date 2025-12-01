const ApplicationProgress = require('../model/applicationProgress.model.js');
const Job = require('../model/job.model.js');
const Submission = require("../model/submission.model.js");
const Question = require("../model/question.model.js");
const PQueue = require("p-queue").default;
require("dotenv").config();
const axios = require("axios");




// language map code 
const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  java: 62,
};


const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = "1b7e563300msh3a6a8fa89c5812bp17fcd1jsn302890a8dc8a";
const JUDGE0_HOST = "judge0-ce.p.rapidapi.com";

//After complete test, Hr will be calculte test score
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

    res.json({ message: "Evaluation completed successfully" });
  } catch (error) {
    console.error("Server error in evaluateJob:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//create test session, test submit automatically after complete time
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

//send test email
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
  evaluateJob,
  enableTestSection,
  sendTestEmail
}