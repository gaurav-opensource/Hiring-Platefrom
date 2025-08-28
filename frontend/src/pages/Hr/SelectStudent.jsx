// src/pages/SelectStudentsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const SelectStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch students list
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/api/hr/applicants");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching applicants", err);
      }
    };
    fetchStudents();
  }, []);

  // Handle select/unselect
  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Submit selected students for test stage
  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one student!");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/api/hr/select-for-test", {
        studentIds: selectedIds,
        testLink: "https://test-platform.com/test/12345", // Example test link
      });
      alert("Students moved to test stage!");
      setSelectedIds([]);

      // Refresh updated list
      const res = await axios.get("/api/hr/applicants");
      setStudents(res.data);
    } catch (err) {
      console.error("Error submitting students", err);
    } finally {
      setLoading(false);
    }
  };

  // Sort by resumeScore (highest first)
  const sortedStudents = [...students].sort(
    (a, b) => b.resumeScore - a.resumeScore
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select Students for Test</h2>

      {sortedStudents.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Select</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Resume Score</th>
              <th className="p-2">Stage</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr key={student._id} className="border-t">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(student._id)}
                    onChange={() => handleCheckboxChange(student._id)}
                    disabled={student.currentStage === "test"} // already moved to test
                  />
                </td>
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.email}</td>
                <td className="p-2">{student.resumeScore}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      student.currentStage === "test"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {student.currentStage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Submitting..." : "Move to Test Stage"}
      </button>
    </div>
  );
};

export default SelectStudentsPage;
