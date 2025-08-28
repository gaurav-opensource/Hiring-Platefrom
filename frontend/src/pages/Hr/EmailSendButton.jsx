import React, { useState } from "react";
import axios from "axios";
import BASE_URL from './environment.js'

const SendEmailButton  = ({ student }) => {
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/email/send-email`, {
        email: student.email,
        name: student.name,
        subject: "Selection Notification",
        message: "We are pleased to inform you that you have been selected for the next round!"
      });
      alert("Email sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={sendEmail} 
      disabled={loading} 
      style={{ backgroundColor: "#4CAF50", color: "#fff", padding: "8px 16px", border: "none" }}
    >
      {loading ? "Sending..." : "Send Email"}
    </button>
  );
}



export default SendEmailButton;
