const mongoose = require('mongoose');

const applicationProgressSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  name: String,
  email: String,
  resumeLink: String,

  resumeScore: Number,

  testLink: { type: String },
  testToken: { type: String },
  testCompleted: { type: Boolean, default: false },         

  // New fields for test evaluation
  score: { type: Number, default: 0 },   // percentage score
  correct: { type: Number, default: 0 }, // correct test cases
  total: { type: Number, default: 0 },   // total test cases

  testScore: Number,             

  currentStage: {
    type: String,
    enum: ['resume', 'test', 'interview', 'final', 'rejected'],
    default: 'resume'
  },

  isShortlisted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ApplicationProgress', applicationProgressSchema);
