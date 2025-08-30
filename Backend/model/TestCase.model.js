const mongoose = require("mongoose");

const testCodeSaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  submissions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      code: String,
      language: String,
    },
  ],
});

module.exports = mongoose.model("TestCodeSave", testCodeSaveSchema);
