import React, { useState } from "react";
import API from "../../apiConfig";

export default function HRGenerateLink(){
  const [jobId, setJobId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [link, setLink] = useState("");

  const assign = async (sendEmail=false) => {
    if(!jobId || !studentId) return alert("jobId & studentId required");
    try {
      const res = await API.post("/progress/assign-test", { jobId, studentId, studentEmail, studentName, sendEmail });
      setLink(res.data.testLink);
      alert("Assigned. Link: " + res.data.testLink);
    } catch (err) {
      alert("Error: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Assign Test (generate link)</h2>
      <div>
        <label>jobId:</label><br/>
        <input value={jobId} onChange={e=>setJobId(e.target.value)} style={{width:300}} />
      </div>
      <div>
        <label>studentId (unique id)</label><br/>
        <input value={studentId} onChange={e=>setStudentId(e.target.value)} style={{width:300}} />
      </div>
      <div>
        <label>studentEmail (optional to send mail)</label><br/>
        <input value={studentEmail} onChange={e=>setStudentEmail(e.target.value)} style={{width:300}} />
      </div>
      <div>
        <label>studentName</label><br/>
        <input value={studentName} onChange={e=>setStudentName(e.target.value)} style={{width:300}} />
      </div>
      <div style={{marginTop:8}}>
        <button onClick={()=>assign(false)}>Generate Link (no email)</button>
        <button onClick={()=>assign(true)} style={{marginLeft:8}}>Generate & Send Email</button>
      </div>
      {link && (
        <div style={{marginTop:12}}>
          <b>Generated Link:</b><br/>
          <a href={link} target="_blank" rel="noreferrer">{link}</a>
        </div>
      )}
    </div>
  );
}
