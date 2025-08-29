import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const ProfileReview = ({ job, currentStageIndex = 1, onStageUpdate }) => {
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  // Fetch applicants and sort by resumeScore
  useEffect(() => {
    if (!job) return;

    const fetchApplicants = async () => {
      try {
        setLoadingApplicants(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/job/students/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedApplicants = (res.data || []).sort(
          (a, b) => b.resumeScore - a.resumeScore
        );
        setApplicants(sortedApplicants);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        alert("Failed to fetch applicants");
      } finally {
        setLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [job]);

  // Toggle applicant selection
  const toggleSelectApplicant = (studentId) => {
    setSelectedApplicants((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Batch process selected students
  const handleProcessSelected = async () => {
    if (!job || selectedApplicants.length === 0) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");

      // Backend call to update all selected students
      await axios.post(
        `${BASE_URL}/job/${job._id}/batch-update-stage`,
        {
          studentIds: selectedApplicants,
          stage: "test", // update stage to test
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update frontend state
      setApplicants((prev) =>
        prev.map((s) =>
          selectedApplicants.includes(s._id)
            ? { ...s, currentStage: "test" }
            : s
        )
      );

      // Clear selected applicants
      setSelectedApplicants([]);

      // Optional: update job step
      if (onStageUpdate) onStageUpdate({ ...job, currentStep: currentStageIndex + 1 });

      alert("Selected applicants moved to Test stage!");
    } catch (err) {
      console.error("Error processing selected applicants:", err);
      alert("Failed to update selected applicants");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Profile Review</h3>
      {job ? (
        <>
          {loadingApplicants ? (
            <p>⏳ Loading applicants...</p>
          ) : applicants.length === 0 ? (
            <p>No applicants found.</p>
          ) : (
            <div className="space-y-3 mt-4">
              {applicants.map((student) => (
                <div
                  key={student._id}
                  className="p-3 border rounded bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{student.userId?.name}</p>
                    <p className="text-sm text-gray-600">📧 {student.userId?.email}</p>
                    <p className="text-sm text-gray-700">Score: {student.resumeScore}</p>
                    <p className="text-sm text-gray-700">Stage: {student.currentStage}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(student._id)}
                    onChange={() => toggleSelectApplicant(student._id)}
                    disabled={student.currentStage !== "resume"} // only resume stage
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleProcessSelected}
            disabled={processing || selectedApplicants.length === 0}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {processing ? "Processing..." : "Process Selected Applicants"}
          </button>
        </>
      ) : (
        <p>No job selected.</p>
      )}
    </div>
  );
};

export default ProfileReview;
