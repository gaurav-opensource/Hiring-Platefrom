// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true, // Example: "Software Engineer - Frontend"
    },
    company: {
      type: String,
    },
    location: {
      type: String,
      default: "Remote", // Remote / On-site / Hybrid
    },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid-Level", "Senior", "Lead"],
      default: "Fresher",
    },
    description: {
      type: String, // JD (Job Description)
    },
    responsibilities: [
      {
        type: String,
      },
    ],
    requirements: [
      {
        type: String, // Example: "Proficiency in React.js"
      },
    ],
    skills: [
      {
        type: String, // Example: "JavaScript", "Node.js", "MongoDB"
      },
    ],
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "INR" }, // or USD/EUR
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // HR/Admin who created the job
    },
    deadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
     currentStep: {
    type: Number,
    default: 0, // stepper ka index (0 = first step)
    },

    // ✅ New Field: Recruitment Steps
    steps: [
      {
        key: { type: String, required: true },   // e.g. "resumeScreen"
        label: { type: String, required: true }, // e.g. "Resume Screening"
        completed: { type: Boolean, default: false }, // track progress
      },
    ],
  },
  { timestamps: true }
);

// ✅ Default steps when a new Job is created
jobSchema.pre("save", function (next) {
  if (!this.steps || this.steps.length === 0) {
    this.steps = [
      { key: "resumeScreen", label: "Resume Screening" },
      { key: "sortResume", label: "Sort by Resume Score" },
      { key: "selectForTest", label: "Select Top for Test" },
      { key: "createQ", label: "Create Questions" },
      { key: "genLinks", label: "Generate Test Links" },
      { key: "calcScore", label: "Calculate Test Scores" },
      { key: "finalSelect", label: "Final Selection (Interview)" },
    ];
  }
  next();
});

module.exports = mongoose.model("Job", jobSchema);
