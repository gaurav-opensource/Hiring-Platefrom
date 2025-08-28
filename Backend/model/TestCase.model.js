const mongoose = require("mongoose");

const testcaseResultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  results: [
    {
      input: String,
      expectedOutput: String,
      actualOutput: String,
      status: String // PASSED | FAILED
    }
  ],
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TestcaseResult", testcaseResultSchema);
