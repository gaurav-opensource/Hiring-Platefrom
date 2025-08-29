import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const Interview = ({ job, onStageUpdate }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // ✅ Fetch all students who completed test stage
  useEffect(() => {
    if (!job) return;

    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/job/students/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Only students who completed test stage
        const testCompleted = (res.data || []).filter(
          (a) => a.currentStage === "testCompleted"
        );

        // Sort by testScore descending
        testCompleted.sort((a, b) => b.testScore - a.testScore);

        setApplicants(testCompleted);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        alert("Failed to fetch applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [job]);

  // ✅ Promote top student(s) to interview stage
  const handleSelectTopForInterview = async () => {
    if (applicants.length === 0) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");

      // Example: select top 1 student, can modify to select more
      const topStudent = applicants[0];

      await axios.post(
        `${BASE_URL}/job/${job._id}/promote-interview`,
        { userId: topStudent.userId._id }, // send userId to backend
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update frontend list
      setApplicants((prev) => prev.filter((a) => a.userId._id !== topStudent.userId._id));

      if (onStageUpdate)
        onStageUpdate({ ...job, currentStep: 5 }); // optional update for HRDashboard

      alert(`Top student ${topStudent.userId.name} moved to Interview stage!`);
    } catch (err) {
      console.error("Error promoting student:", err);
      alert("Failed to promote student");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Interview Stage</h3>

      {loading ? (
        <p>⏳ Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p>No applicants ready for interview.</p>
      ) : (
        <>
          <ul className="space-y-3 mb-4">
            {applicants.map((student) => (
              <li
                key={student.userId._id}
                className="p-3 border rounded bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{student.userId.name}</p>
                  <p className="text-sm text-gray-600">{student.userId.email}</p>
                  <p className="text-sm text-gray-700">
                    Test Score: {student.testScore}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSelectTopForInterview}
            disabled={processing}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {processing ? "Processing..." : "Select Top for Interview"}
          </button>
        </>
      )}
    </div>
  );
};

export default Interview;
