import { useEffect, useState } from "react";
import axios from "axios";

import BASE_URL from "../../../apiConfig";

export default function Interview({ job }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!job) return;

    const fetchInterviewStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/job/students/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const interviewStudents = (res.data || []).filter(
          (student) => student.currentStage === "interview"
        );

        setStudents(interviewStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
        alert("Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewStudents();
  }, [job]);

  const markAsContacted = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/students/${studentId}/mark-contacted`,
        { jobId: job._id }, // ✅ sending jobId along with request
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStudents((prev) =>
        prev.map((student) =>
          student._id === studentId
            ? { ...student, contacted: true }
            : student
        )
      );
    } catch (err) {
      console.error("Error marking student as contacted:", err);
      alert("Failed to mark as contacted.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Interview Students</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students are at the interview stage.</p>
      ) : (
        <ul className="space-y-4">
          {students.map((student) => (
            <li
              key={student._id}
              className="border p-4 rounded bg-gray-50 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-lg">{student.userId?.name}</p>
                <p className="text-sm text-gray-600">📧 {student.userId?.email}</p>
                <p className="text-sm text-gray-600">Score: {student.testScore}</p>
              </div>
              <div>
                {student.contacted ? (
                  <span className="text-green-600 font-semibold">Contacted</span>
                ) : (
                  <button
                    onClick={() => markAsContacted(student._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Mark as Contacted
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
