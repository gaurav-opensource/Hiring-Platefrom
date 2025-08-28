const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  to: String,
  subject: String,
  content: String,
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
