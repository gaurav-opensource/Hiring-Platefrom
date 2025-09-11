const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const ApplicationProgress = require("../model/applicationProgress.model");
const { sendTestEmail } = require("../utils/mailer");


router.post("/generate-links", async (req, res) => {
  try {
    const { jobId, studentId, studentEmail, studentName, sendEmail } = req.body;
    if (!jobId || !studentId) return res.status(400).json({ error: "jobId & studentId required" });

    // token to validate link (simple)
    const token = crypto.randomBytes(16).toString("hex");
    const testLink = `${process.env.FRONTEND_URL}/test/${jobId}/${studentId}/${token}`;

    let progress = await ApplicationProgress.findOne({ jobId, studentId });
    if (!progress) {
      progress = new ApplicationProgress({ jobId, studentId });
    }
    progress.testAssigned = true;
    progress.testLink = testLink;
    progress.testToken = token;
    await progress.save();

    if (sendEmail && studentEmail) {
      await sendTestEmail(studentEmail, studentName, testLink);
    }

    res.json({ message: "Test assigned", testLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/verify/:jobId/:studentId/:token", async (req, res) => {
  const { jobId, studentId, token } = req.params;
  const progress = await ApplicationProgress.findOne({ jobId, studentId });
  if (!progress) return res.status(404).json({ error: "Not found" });
  if (progress.testToken !== token) return res.status(401).json({ error: "Invalid token" });
  res.json({ ok: true, testLink: progress.testLink });
});

module.exports = router;
