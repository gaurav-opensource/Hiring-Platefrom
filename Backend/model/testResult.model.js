const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  code: String,
  language: String,
  testCaseResults: [
    { input: String, expectedOutput: String, actualOutput: String, passed: Boolean }
  ],
  totalTestCases: Number,
  passedTestCases: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TestAttempt", testAttemptSchema);
