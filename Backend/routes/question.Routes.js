const express = require("express");
const router = express.Router();
const TestcaseResult = require("../model/TestCase.model");
const ApplicationProgress = require("../model/applicationProgress.model");
const Question = require("../model/question.model");
const { runSingleTest } = require("../utils/judge0");

// Create question (HR)
router.post("/create", async (req, res) => {
   try {
    const { jobId, title, description, starterCode, marks, testCases } = req.body;

    const newQuestion = new Question({
      jobId,
      title,
      description,
      starterCode,
      marks,
      testCases // yaha array of {input, output}
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get questions by jobId (frontend test page will call this; exclude hidden testcases)
router.get("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get all questions by jobId
    const questions = await Question.find({ jobId });

    // Hide hidden test cases before sending to frontend
    const sanitized = questions.map((q) => {
      const publicTcs = q.testCases.filter((t) => !t.hidden);

      return {
        _id: q._id,
        jobId: q.jobId,
        title: q.title,
        description: q.description,
        starterCode: q.starterCode,
        marks: q.marks,
        testCases: publicTcs, // sirf visible test cases
        createdAt: q.createdAt,
      };
    });

    res.json(sanitized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Student submits code for a single question
router.post("/submit", async (req, res) => {
  try {
    const { userId, jobId, questionId, code, languageId } = req.body;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const results = [];
    let passed = 0;

    // run each testcase (including hidden)
    for (const tc of question.testCases) {
      try {
        const runResult = await runSingleTest(code, languageId, tc.input);
        const actual = (runResult.stdout || "").trim();
        const expected = (tc.output || "").trim();
        const status = actual === expected ? "PASSED" : "FAILED";
        if (status === "PASSED") passed++;

        results.push({
          input: tc.input,
          expectedOutput: expected,
          actualOutput: actual,
          status
        });
      } catch (err) {
        results.push({
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: err.message.substring(0, 200),
          status: "FAILED"
        });
      }
    }

    const score = Math.round((passed / question.testCases.length) * (question.marks || 100));

    // save per-question testcase result
    const tcResult = new TestcaseResult({
      userId,
      jobId,
      questionId,
      results,
      score
    });
    await tcResult.save();

    // update ApplicationProgress: aggregate totalScore across questions for this user+job
    let progress = await ApplicationProgress.findOne({ jobId, studentId: userId });
    if (!progress) {
      progress = new ApplicationProgress({ jobId, studentId: userId, totalScore: 0 });
    }
    // to avoid double-counting if user re-submits, simplest approach: sum all scores from TestcaseResult for this user/job
    const allResults = await TestcaseResult.find({ userId, jobId });
    const totalScore = allResults.reduce((acc, r) => acc + (r.score || 0), 0);
    progress.totalScore = totalScore;
    // optional: detect completion if user has submissions for all questions for this job
    const totalQuestions = await Question.countDocuments({ jobId });
    const answeredQuestions = await TestcaseResult.distinct("questionId", { userId, jobId }).then(a => a.length);
    progress.testCompleted = answeredQuestions >= totalQuestions;
    await progress.save();

    res.json({ tcResult, totalScore: progress.totalScore, testCompleted: progress.testCompleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
