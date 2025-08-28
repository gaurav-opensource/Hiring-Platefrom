const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  questionId: Schema.Types.ObjectId,
  type: String,
  answerText: Schema.Types.Mixed,
  code: String,
  language: String,
  codeHash: String,
  judged: { type: Boolean, default: false },
  passed: Number,
  totalTestCases: Number,
  score: Number
}, {_id: false});

const SubmissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: Schema.Types.ObjectId, ref: 'TestSession' },
  answers: [AnswerSchema],
  totalScore: Number,
  flagged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
