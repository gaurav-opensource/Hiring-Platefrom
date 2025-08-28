const mongoose = require("mongoose");

const jobPipelineSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  currentStep: { type: String, default: "resumeScreen" }, // abhi kaunsa step chal raha hai
  completedSteps: [{ type: String }] // jo steps complete ho chuke hain
}, { timestamps: true });

module.exports = mongoose.model("JobPipeline", jobPipelineSchema);
