const { sendEmail } = require('../config/emailConfig');

const sendVideoCallReminder = async ({ user, job, descrption }) => {
  const testLink = `${process.env.APP_BASE_URL}/${user._id}/${job._id}`;

  await sendEmail({
    to: user.email,
    subject: `Coding Test Invitation for ${job.title}`,
    html: `
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>${descrption}</p>
      <p>You can access your test using the link below:</p>
      <p><a href="${testLink}" style="color: #1a73e8; font-weight: bold;">Start Test</a></p>
      <br/>
      <p>Best regards,<br/>The Hiring Team</p>
    `,
  });
};

module.exports = sendVideoCallReminder;
