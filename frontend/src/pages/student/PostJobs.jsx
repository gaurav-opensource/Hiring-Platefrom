import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // 👈 Add this
import axios from "axios";
import BASE_URL from "../../apiConfig";

const PostJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 React Router hook

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

  if (loading) return <p className="text-center mt-10">Loading jobs...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Jobs</h2>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <input
          type="number"
          placeholder="Last X days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <button
          onClick={() => fetchJobs(days)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs available.</p>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition border border-gray-100"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    {job.company} • {job.location}
                  </p>
                </div>
                <span className="text-sm text-gray-400">
                  {job.deadline ? `Apply by ${new Date(job.deadline).toLocaleDateString()}` : "No deadline"}
                </span>
              </div>

              {/* Details */}
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Type:</span> {job.jobType}</p>
                <p><span className="font-medium">Salary:</span> {job.salary}</p>
                <p>
                  <span className="font-medium">Posted By:</span>{" "}
                  {job.postedBy ? job.postedBy.name || job.postedBy.companyName : "N/A"}
                </p>
              </div>

              {/* Action */}
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/student/apply/${job._id}`, { state: job })} // 👈 Passing job data
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostJobs;
