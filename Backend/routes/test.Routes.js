const router = require("express").Router();
const auth = require("../middleware/auth");
const TestAttempt = require("../models/TestAttempt");
const Question = require("../models/Question");
const axios = require("axios");
// Helper for Judge0
async function runCode(code, languageId, testCases) {
  const results = [];
  let passedCount = 0;

  for (const tc of testCases) {
    // Create submission
    const resp = await axios.post(`${process.env.JUDGE0_URL}/submissions`, {
      source_code: code,
      language_id: languageId,
      stdin: tc.input
    }, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
        "Content-Type": "application/json"
      }
    });

    const token = resp.data.token;

    // Poll until finished
    let result;
    do {
      const r = await axios.get(`${process.env.JUDGE0_URL}/submissions/${token}`, {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.RAPIDAPI_HOST
        }
      });
      result = r.data;
    } while (result.status.id < 3); // 1=In Queue, 2=Processing

    // Compare outputs
    const actual = (result.stdout || "").trim();
    const expected = tc.output.trim();
    const passed = actual === expected;

    if (passed) passedCount++;

    results.push({
      input: tc.input,
      expectedOutput: expected,
      actualOutput: actual,
      passed
    });
  }

  return { results, passedCount, total: testCases.length };
}

// Submit code
router.post("/submit", auth, async (req, res) => {
  try {
    const { code, language, questionId } = req.body;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const languageMap = { python: 71, cpp: 54, java: 62 };
    if (!languageMap[language]) return res.status(400).json({ message: "Unsupported language" });

    const { results, passedCount, total } = await runCode(code, languageMap[language], question.testCases);

    const attempt = new TestAttempt({
      student: req.user.id,
      question: questionId,
      code,
      language,
      testCaseResults: results,
      passedTestCases: passedCount,
      totalTestCases: total
    });
    await attempt.save();

    res.json({ passed: passedCount, total, testCaseResults: results });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
