import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const ResumeScreening = ({ job, currentStageIndex = 0, onStageUpdate }) => {
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [processing, setProcessing] = useState(false);

  // ✅ Fetch applicants
  useEffect(() => {
    if (!job) return;

    const fetchApplicants = async () => {
      try {
        setLoadingApplicants(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/job/students/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicants(res.data || []);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        alert("Failed to fetch applicants");
      } finally {
        setLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [job]);

  // ✅ Handle "Process Resumes" click
  const handleProcessResumes = async () => {
    if (!job) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Trigger resume screening
      await axios.post(
        `${BASE_URL}/job/${job._id}/resume-screen`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2️⃣ Update current step in backend
      const res = await axios.post(
        `${BASE_URL}/job/${job._id}/step/${currentStageIndex + 1}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optional: parent component callback to update dashboard state
      if (onStageUpdate && res.data.updatedJob) {
        onStageUpdate(res.data.updatedJob);
      }

      alert("Resume screening completed and step updated!");
    } catch (err) {
      console.error("Error processing resumes:", err);
      alert("Failed to process resumes.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Resume Screening</h3>
      {job ? (
        <>
          <p>Processing resumes for job: <strong>{job.title}</strong></p>

          <button
            onClick={handleProcessResumes}
            disabled={processing}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {processing ? "Processing..." : "Process Resumes"}
          </button>

          {/* Applicants List */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Applicants:</h4>
            {loadingApplicants ? (
              <p>⏳ Loading applicants...</p>
            ) : applicants.length === 0 ? (
              <p>No applicants found.</p>
            ) : (
              <ul className="space-y-2">
                {applicants.map((student) => (
                  <li
                    key={student._id}
                    className="p-2 border rounded bg-gray-50"
                  >
                    <p className="font-medium">{student.userId?.name}</p>
                    <p className="text-sm text-gray-600">📧 {student.userId?.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <p>No job selected.</p>
      )}
    </div>
  );
};

export default ResumeScreening;
