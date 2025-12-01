// const Application = require("../models/Application");
const transporter = require("../config/emailConfig")

// // Send email notification to all students who select for this job role
// exports.emailtostudent = async(req,res)=>{
//     try {
//       const { jobId, hrEmail } = req.body;

//       const applications = await Application.find({ jobId });

//       if (!applications.length) {
//         return res.status(404).json({ message: "No applicants found for this job." });
//       }

//       // send emails to all students
//       for (const app of applications) {
//         const studentEmail = app.studentEmail;

//         const mailOptions = {
//           from: hrEmail,
//           to: studentEmail,
//           subject: "Job Application Update",
//           text: `You are selected for the job with ID: ${jobId}. Please contact HR at ${hrEmail}.`,
//         };

//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${studentEmail}`);
//       }

//       res.json({ message: "Emails sent to all students." });

//   } catch (error) {
//     console.error("Error sending emails:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// }



exports.generateTestEmailTemplate = ({
  name,
  description,
  jobTitle,
  startTime,
  endTime,
  testLink,
}) => {
  return {
    subject: `Coding Test Invitation for ${jobTitle}`,
    html: `
      <p>Dear <strong>${name}</strong>,</p>
      <p>${description}</p>
      <p><strong>Test Window:</strong> ${new Date(startTime).toLocaleString()} - ${new Date(endTime).toLocaleString()}</p>
      <p>You can access your test using the link below:</p>
      <p><a href="${testLink}" style="color: #1a73e8; font-weight: bold;">Start Test</a></p>
      <br/>
      <p>Best regards,<br/>The Hiring Team</p>
    `,
  };
};
