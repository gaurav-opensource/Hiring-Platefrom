import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const CodingTest = ({ job, onStageUpdate }) => {
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!job) return;

    const fetchApplicants = async () => {
      try {
        setLoadingApplicants(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/job/students/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        
        const testStageApplicants = (res.data || []).filter(
          (a) => a.currentStage === "test"
        );

        setApplicants(testStageApplicants);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        alert("Failed to fetch applicants");
      } finally {
        setLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [job]);

  const toggleSelectApplicant = (studentId) => {
    setSelectedApplicants((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  
  const handleProcessSelected = async () => {
    if (!job || selectedApplicants.length === 0) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${BASE_URL}/job/${job._id}/batch-update-stage`,
        {
          studentIds: selectedApplicants,
          stage: "testEvaluation", 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      
      setApplicants((prev) =>
        prev.filter((a) => !selectedApplicants.includes(a._id))
      );

      setSelectedApplicants([]);

      if (onStageUpdate)
        onStageUpdate({ ...job, currentStep: 3 }); 

      alert("Selected applicants moved to Test Evaluation stage!");
    } catch (err) {
      console.error("Error updating stage:", err);
      alert("Failed to update selected applicants");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Coding Test</h3>
      {loadingApplicants ? (
        <p>⏳ Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p>No applicants are currently in the Test stage.</p>
      ) : (
        <>
          <div className="space-y-3">
            {applicants.map((student) => (
              <div
                key={student._id}
                className="p-3 border rounded bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{student.userId?.name}</p>
                  <p className="text-sm text-gray-600">
                    📧 {student.userId?.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    Current Stage: {student.currentStage}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedApplicants.includes(student._id)}
                  onChange={() => toggleSelectApplicant(student._id)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleProcessSelected}
            disabled={processing || selectedApplicants.length === 0}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {processing ? "Processing..." : "Move Selected to Test Evaluation"}
          </button>
        </>
      )}
    </div>
  );
};

export default CodingTest;
