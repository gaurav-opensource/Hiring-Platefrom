const express = require("express");
const router = express.Router();
const ApplicationProgress = require('../model/applicationProgress.model.js');
const { transporter } = require("../config/emailConfig");
const { generateTestEmailTemplate } = require("../controller/emailController");

// Generate a random secure token
const generateToken = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

router.post("/send-test-email/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    

    const { startTime, endTime, description, jobTitle } = req.body;

    const applications = await ApplicationProgress.find({ jobId });

    if (!applications.length) {
      return res.status(404).json({ message: "No applications found for this job" });
    }
    
    const testStageApps = applications.filter(app => app.currentStage === "test");
    console.log("JobID:", jobId,testStageApps);
    if (!testStageApps.length) {
      return res.status(404).json({ message: "No students are in Test Stage" });
    }

    let updatedApps = [];


    for (let app of testStageApps) {
      const token = generateToken();

      const testLink = `${process.env.FRONTEND_URL}/students/${jobId}/${app.userId}?token=${token}`;

      app.testLink = testLink;
      app.testToken = token;
      await app.save();

      const emailContent = generateTestEmailTemplate({
        name: app.name || "Candidate",
        description,
        jobTitle,
        startTime,
        endTime,
        testLink,
      });
      

      // 🚨 TRY-CATCH JUST FOR EMAIL SENDING
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: app.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });
      } catch (mailErr) {
        console.error("❌ Email sending failed!");
        console.error("Message:", mailErr.message);
        console.error("Code:", mailErr.code);
        console.error("Stack:", mailErr.stack);
        console.error("Response:", mailErr.response);
        console.error("ResponseCode:", mailErr.responseCode);
        console.error("Command:", mailErr.command);
      }

      updatedApps.push({
        candidate: app.name,
        email: app.email,
        testLink,
        token,
      });
    }

    res.status(200).json({
      message: "✔ Test links generated & email send attempted for all candidates",
      sent: updatedApps,
    });

  } catch (err) {
    console.error("❌ Fatal Server Error");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
