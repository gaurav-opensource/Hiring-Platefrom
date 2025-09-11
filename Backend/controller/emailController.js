const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gauravwithhost@gmail.com",
    pass: "Gaurav@123",
  },
});

// API to send emails to all students for a job
router.post("/send-emails", async (req, res) => {
  try {
    const { jobId, hrEmail } = req.body;

    const applications = await Application.find({ jobId });

    if (!applications.length) {
      return res.status(404).json({ message: "No applicants found for this job." });
    }

    // send emails to all students
    for (const app of applications) {
      const studentEmail = app.studentEmail;

      const mailOptions = {
        from: hrEmail,
        to: studentEmail,
        subject: "Job Application Update",
        text: `You are selected for the job with ID: ${jobId}. Please contact HR at ${hrEmail}.`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${studentEmail}`);
    }

    res.json({ message: "Emails sent to all students." });

  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
