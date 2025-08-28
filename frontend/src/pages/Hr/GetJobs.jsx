import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../apiConfig";
const GetJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch HR jobs
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/job/tracker`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete job
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/job/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs(); // refresh jobs
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate Resume Scores API call
  const calculateResumeScore = async (jobId) => {
    if (!window.confirm("Start resume scoring for this job?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/job/calculate-resume-score/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Resume scoring started!");
    } catch (err) {
      console.error(err);
      alert("Error starting resume scoring");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading jobs...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6">📋 Your Posted Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Title</th>
                <th className="border p-2">Company</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Salary</th>
                <th className="border p-2">Deadline</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="border p-2">{job.title}</td>
                  <td className="border p-2">{job.company}</td>
                  <td className="border p-2">{job.location}</td>
                  <td className="border p-2">{job.jobType}</td>
                  <td className="border p-2">{job.salary}</td>
                  <td className="border p-2">
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border p-2 flex gap-2 flex-wrap">
                    <button
                      onClick={() => calculateResumeScore(job._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Start Scoring
                    </button>
                    <button
                      onClick={() => navigate(`/question/${job._id}`)}
                      className="bg-purple-500 text-white px-2 py-1 rounded"
                    >
                      Add Questions
                    </button>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetJobs;
