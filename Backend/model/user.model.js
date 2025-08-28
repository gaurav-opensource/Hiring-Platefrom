const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["student", "hr"], required: true },

  // Common fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // HR specific
  companyName: String,
  position: String,
  contact: String,

  // Student specific
  college: String,
  degree: String,
  branch: String,
  graduationYear: Number,
  skills: [String],
  projects: [{ title: String, description: String, githubLink: String }],
  experience: [{ company: String, role: String, duration: String }],
  certifications: [{ title: String, issuer: String, year: String }],
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
  },
  resume: String,
  location: String,
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
