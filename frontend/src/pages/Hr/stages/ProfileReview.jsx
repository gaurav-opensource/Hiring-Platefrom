import { useEffect, useState } from "react";
import axios from "axios";

import BASE_URL from "../../../apiConfig";

const ResumeScreening = ({ job }) => {
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectCount, setSelectCount] = useState(0);

  useEffect(() => {
    if (!job) return;

    const fetchApplicants = async () => {
      try {
        setLoadingApplicants(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/job/students/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Sort applicants by resumeScore in descending order
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

  const handleSelectTopStudents = () => {
    const topStudents = applicants.slice(0, selectCount).map((s) => s._id);
    setSelectedStudents(topStudents);
  };

  const handleToggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleConfirmSelection = async () => {
    if (!job || selectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem("token");

      // ✅ Update job stage
      await axios.post(
        `${BASE_URL}/job/${job._id}/stageChange`,
        { stage: "coding" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update selected students' stages
      await axios.post(
        `${BASE_URL}/job/${job._id}/stageChangeInStudent`,
        { studentIds: selectedStudents, stage: "coding" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Selection confirmed and stages updated!");
      setSelectedStudents([]);
    } catch (err) {
      console.error("Error confirming selection:", err);
      alert("Failed to update stages.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Resume Screening</h3>
      {job ? (
        <>
          <p>Total Applicants: <strong>{applicants.length}</strong></p>

          <div className="mb-4">
            <input
              type="number"
              min="1"
              max={applicants.length}
              value={selectCount}
              onChange={(e) => setSelectCount(Number(e.target.value))}
              placeholder="Enter number of students to select"
              className="border p-1 mr-2"
            />
            <button
              onClick={handleSelectTopStudents}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Select Top Students
            </button>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Or select manually:</h4>
            {loadingApplicants ? (
              <p>⏳ Loading applicants...</p>
            ) : applicants.length === 0 ? (
              <p>No applicants found.</p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-auto">
                {applicants.map((student) => (
                  <li
                    key={student._id}
                    className="flex items-center space-x-2 p-2 border rounded bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleToggleStudent(student._id)}
                    />
                    <div>
                      <p className="font-medium">{student.userId?.name}</p>
                      <p className="text-sm text-gray-600">📧 {student.userId?.email}</p>
                      <p className="text-sm text-gray-700">Score: {student.resumeScore}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleConfirmSelection}
            disabled={processing || selectedStudents.length === 0}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {processing ? "Processing..." : "Confirm Selection"}
          </button>
        </>
      ) : (
        <p>No job selected.</p>
      )}
    </div>
  );
};

export default ResumeScreening;
