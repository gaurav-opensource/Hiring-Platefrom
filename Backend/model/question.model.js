const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const questionSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  title: String,
  description: String,
  starterCode: { type: String, default: "" },
  marks: { type: Number, default: 100 },
  testCases: [testCaseSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", questionSchema);
