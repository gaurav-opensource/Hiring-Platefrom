const mongoose = require('mongoose');

const hrSchema = new mongoose.Schema({
  name: String,
  email: String,
  password:String,
  contact: String,
  companyName: String,
  position: String,
  
});

module.exports = mongoose.model('HR', hrSchema);
