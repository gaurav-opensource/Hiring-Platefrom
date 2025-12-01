
const nodemailer = require("nodemailer");
require("dotenv").config();

// this nodemailer to send email
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


module.exports = { transporter};
