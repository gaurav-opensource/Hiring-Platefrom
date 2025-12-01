import { useEffect, useState } from "react";
import axios from "axios";

import BASE_URL from "../../../apiConfig";

export default function TestEvaluation({ job }) {
  const [allSubmitted, setAllSubmitted] = useState(true);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectCount, setSelectCount] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (!job) return;
    setAllSubmitted(job.allStudentTestSubmit || false);
    if (job.allStudentTestSubmit) {
      fetchStudents();
    }
  }, [job]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/job/students/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data.sort((a, b) => b.testScore - a.testScore);
      setStudents(sorted);
    } catch (err) {
      console.error("Error fetching students:", err);
      alert("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTop = () => {
    const top = students.slice(0, selectCount).map((s) => s._id);
    setSelectedStudents(top);
  };

  const handleToggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleConfirmSelection = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }
    try {
      const token = localStorage.getItem("token");

      // ✅ Update job stage to interview
      await axios.post(
        `${BASE_URL}/job/${job._id}/stageChange`,
        { stage: "interview" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update selected students' stage to interview
      await axios.post(
        `${BASE_URL}/job/${job._id}/stageChangeInStudent`,
        { studentIds: selectedStudents, stage: "interview" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Interview stage updated for selected students.");
    } catch (err) {
      console.error("Error updating stages:", err);
      alert("Failed to update stages.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Test Evaluation</h2>

      {!allSubmitted ? (
        <div className="bg-yellow-100 p-4 rounded">
          <p>Test not completed yet by all students.</p>
        </div>
      ) : (
        <div>
          <p>Total Students: {students.length}</p>

          <div className="my-4">
            <input
              type="number"
              min="1"
              max={students.length}
              value={selectCount}
              onChange={(e) => setSelectCount(Number(e.target.value))}
              placeholder="Enter number of top students to select"
              className="border p-2 mr-2"
            />
            <button
              onClick={handleSelectTop}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Select Top Students
            </button>
          </div>

          <div className="my-4">
            <h3 className="text-lg font-semibold mb-2">Select Students Manually:</h3>
            {loading ? (
              <p>Loading students...</p>
            ) : (
              <ul className="max-h-64 overflow-auto border p-2 rounded space-y-2">
                {students.map((student) => (
                  <li key={student._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleToggleStudent(student._id)}
                    />
                    <div>
                      <p>{student.userId?.name}</p>
                      <p className="text-sm text-gray-600">Score: {student.testScore}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleConfirmSelection}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Confirm Selection & Update Stage
          </button>
        </div>
      )}
    </div>
  );
}
