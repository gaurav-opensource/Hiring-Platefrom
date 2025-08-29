import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const TestEvaluation = ({ job }) => {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [hrEmail, setHrEmail] = useState(""); // HR email state

  const handleGenerateLinks = async () => {
    if (!job) return;
    if (!hrEmail) return alert("Please enter HR email");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BASE_URL}/job/${job._id}/generate-links`,
        { email: hrEmail }, // HR email send in body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLinks(res.data.links || []);
      alert("Test links generated and emailed successfully!");
    } catch (err) {
      console.error("Error generating test links:", err);
      alert(err.response?.data?.message || "Failed to generate test links");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Test Evaluation</h3>

      {job ? (
        <>
          <p>
            Evaluating test results for job: <strong>{job.title}</strong>
          </p>

          {/* HR Email Input */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">HR Email:</label>
            <input
              type="email"
              value={hrEmail}
              onChange={(e) => setHrEmail(e.target.value)}
              placeholder="Enter HR email"
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          {/* Generate Test Links Button */}
          <button
            onClick={handleGenerateLinks}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Generating Links..." : "Generate Test Links & Send Email"}
          </button>

          {/* Display Generated Links */}
          {links.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Generated Links:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {links.map((link) => (
                  <li key={link.userId}>
                    {link.userId}:{" "}
                    <a
                      href={link.testLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 underline"
                    >
                      {link.testLink}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>No job selected.</p>
      )}
    </div>
  );
};

export default TestEvaluation;
