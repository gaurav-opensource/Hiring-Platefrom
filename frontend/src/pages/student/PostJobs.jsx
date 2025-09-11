import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../apiConfig";

const PostJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    setRole(decoded?.role || "");
  }, []);

  const fetchJobs = async (filterDays = "") => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/job/alljob`;
      if (filterDays) url += `?days=${filterDays}`;
      const res = await axios.get(url);
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-50">
        <p className="text-lg text-gray-600">⏳ Loading jobs...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-50">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 pt-24">
      <h2 className="text-3xl font-bold text-center text-purple-800 mb-8">
        🚀 Explore Latest Job Opportunities
      </h2>

      {/* Filter Section */}
      <div className="flex justify-center gap-3 mb-10">
        <input
          type="number"
          placeholder="Last X days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-40 text-sm focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition"
        />
        <button
          onClick={() => fetchJobs(days)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition duration-300"
        >
          Apply Filter
        </button>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No jobs available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-transform transform hover:-translate-y-1 border border-gray-200"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-purple-800">{job.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.company} • {job.location}
                  </p>
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  {job.deadline
                    ? `Apply by ${new Date(job.deadline).toLocaleDateString()}`
                    : "No deadline"}
                </span>
              </div>

              {/* Job Details */}
              <div className="text-sm text-gray-600 space-y-2 mb-4">
                <p>
                  <span className="font-medium">📌 Type:</span> {job.jobType}
                </p>
                <p>
                  <span className="font-medium">💰 Salary:</span> {job.salary}
                </p>
                <p>
                  <span className="font-medium">👤 Posted By:</span>{" "}
                  {job.postedBy ? job.postedBy.name || job.postedBy.companyName : "N/A"}
                </p>
              </div>

              {/* Apply Button */}
              {role !== "hr" && (
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/student/apply/${job._id}`, { state: job })}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition duration-300"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostJobs;
