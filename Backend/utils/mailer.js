const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendTestEmail(toEmail, studentName, testLink) {
  const html = `
    <p>Hi ${studentName || "Candidate"},</p>
    <p>You have been invited to take a coding test. Click below to start:</p>
    <a href="${testLink}">${testLink}</a>
    <p>Regards,<br/>Hiring Team</p>
  `;
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Coding Test Invitation",
    html
  });
}

module.exports = { sendTestEmail };
