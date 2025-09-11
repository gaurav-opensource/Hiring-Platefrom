import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const Interview = ({ job, onStageUpdate }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    if (!job) return;

    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/job/students/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

       
        const testCompleted = (res.data || []).filter(
          (a) => a.testCompleted === true && a.userId
        );

       
        testCompleted.sort((a, b) => (b.score || 0) - (a.score || 0));

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


  const handleSelectTopForInterview = async () => {
    if (applicants.length === 0) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");

    
      const topStudent = applicants[0];

      await axios.post(
        `${BASE_URL}/job/${job._id}/promote-interview`,
        { userId: topStudent.userId._id }, // send userId to backend
        { headers: { Authorization: `Bearer ${token}` } }
      );

 
      setApplicants((prev) =>
        prev.filter((a) => a.userId._id !== topStudent.userId._id)
      );

      if (onStageUpdate)
        onStageUpdate({ ...job, currentStep: 5 }); 

      alert(`Top student ${topStudent.userId.name} moved to Interview stage!`);
    } catch (err) {
      console.error("Error promoting student:", err);
      alert("Failed to promote student");
    } finally {
      setProcessing(false);
    }
  };

  
  const handleEvaluateTests = async () => {
    if (!job) return;

    try {
      setEvaluating(true);
      const token = localStorage.getItem("token");

      await axios.post(`${BASE_URL}/job/${job._id}/evaluate`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Test evaluation completed for all students!");
    } catch (err) {
      console.error("Error evaluating tests:", err);
      alert("Failed to evaluate tests");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Interview Stage</h3>

      <div className="mb-4 flex gap-3">
        <button
          onClick={handleEvaluateTests}
          disabled={evaluating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {evaluating ? "Evaluating..." : "Run Test Evaluation"}
        </button>

        <button
          onClick={handleSelectTopForInterview}
          disabled={processing || applicants.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {processing ? "Processing..." : "Select Top for Interview"}
        </button>
      </div>

      {loading ? (
        <p>⏳ Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p>No applicants ready for interview.</p>
      ) : (
        <ul className="space-y-3 mb-4">
          {applicants.map((student) => (
            <li
              key={student.userId?._id}
              className="p-3 border rounded bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{student.userId?.name || "No Name"}</p>
                <p className="text-sm text-gray-600">{student.userId?.email || "No Email"}</p>
                <p className="text-sm text-gray-700">
                  Test Score: {student.score ?? "N/A"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Interview;
