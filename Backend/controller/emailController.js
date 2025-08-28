const nodemailer = require("nodemailer");
require("dotenv").config();

const sendSelectionEmail = async (req, res) => {
  const { email, name, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <h2>Congratulations ${name || "Student"}!</h2>
        <p>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = { sendSelectionEmail };
