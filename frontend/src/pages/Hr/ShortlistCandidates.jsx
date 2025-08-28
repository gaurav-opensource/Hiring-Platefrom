import React, { useState } from "react";
import axios from "axios";

const ShortlistCandidates = () => {
  const [jobId, setJobId] = useState("");
  const [topN, setTopN] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!jobId || !topN || isNaN(topN) || topN <= 0) {
      setError("Please enter a valid Job ID and positive number for topN.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/job/shortlist", {
        jobId,
        topN,
      });

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Shortlist Candidates</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Job ID:</label>
          <input
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="Enter Job ID"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        <div>
          <label>Top N Candidates:</label>
          <input
            type="number"
            value={topN}
            onChange={(e) => setTopN(e.target.value)}
            placeholder="Enter top N"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Shortlist"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Shortlisted Candidates</h2>
          {result.shortlisted && result.shortlisted.length > 0 ? (
            <ul>
              {result.shortlisted.map((c, idx) => (
                <li key={idx}>
                  <strong>{c.name}</strong> ({c.email}) - Score:{" "}
                  {c.resumeScore}
                </li>
              ))}
            </ul>
          ) : (
            <p>No candidates found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortlistCandidates;
