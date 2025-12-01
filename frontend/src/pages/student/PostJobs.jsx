import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../apiConfig";
import {
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaUserTie,
  FaBuilding,
  FaBullhorn,
  FaBriefcase,
  FaClipboardList,
  FaGraduationCap,
} from "react-icons/fa";

const PostJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const gradientStyle = {
    background: "linear-gradient(to bottom right, #e0b0ff, #87ceeb)",
  };

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

  const getTimeElapsed = (dateString) => {
    if (!dateString) return "Recently posted";
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Posted today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 30) return `${diffInDays} days ago`;

    return postDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen" style={gradientStyle}>
        <p className="text-xl text-purple-800 animate-pulse">
          ⏳ Fetching your next big opportunity...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen" style={gradientStyle}>
        <p className="text-red-600 text-xl font-semibold">
          ❌ Failed to load jobs: {error}
        </p>
      </div>
    );
    return (
  <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#eef2ff] px-6 py-10 pt-28">

    {/* ---- HEADER ---- */}
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        Find the Right Job for Your Career
      </h1>
      <p className="text-gray-600 mt-3 text-lg">
        Explore thousands of job opportunities tailored just for you.
      </p>

      {/* Search bar */}
      <div className="mt-6 flex justify-center">
        <div className="bg-white shadow-lg rounded-full flex items-center border border-gray-100 px-4 py-2 w-full max-w-xl">
          <input
            type="number"
            placeholder="Search jobs posted in last X days..."
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="flex-1 p-3 outline-none text-gray-600"
          />
          <button
            onClick={() => fetchJobs(days)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Trending tags */}
      <div className="flex flex-wrap justify-center gap-3 mt-5">
        {["Remote", "Design", "Tech", "Finance", "Internships"].map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-gray-700 text-sm cursor-pointer transition"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>

    {/* ---- JOB CARD GRID ---- */}
    {jobs.length === 0 ? (
      <p className="text-center text-gray-600 text-xl mt-20">
        No jobs match your search.
      </p>
    ) : (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          >
            {/* Card Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                <FaBuilding className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.company}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {getTimeElapsed(job.createdAt)}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                <FaMapMarkerAlt className="inline mr-1" /> {job.location || "Remote"}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                <FaUserTie className="inline mr-1" /> {job.jobType || "Full-time"}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                <FaDollarSign className="inline mr-1" /> {job.salary || "N/A"}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {job.description}
            </p>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <p className="text-sm text-gray-600 mb-1">
                <strong className="text-gray-800">Skills:</strong>{" "}
                {job.skills.join(", ")}
              </p>
            )}

            {job.experience && (
              <p className="text-sm text-gray-600">
                <strong className="text-gray-800">Experience:</strong>{" "}
                {job.experience} years
              </p>
            )}

            {job.qualification && (
              <p className="text-sm text-gray-600 mt-1">
                <strong className="text-gray-800">Qualification:</strong>{" "}
                {job.qualification}
              </p>
            )}

            {/* Footer */}
            <div className="mt-6 flex justify-between items-center border-t pt-4 border-gray-100">
              <span className="text-sm text-gray-500">
                Posted by:{" "}
                <span className="font-medium text-gray-800">
                  {job.postedBy?.name || job.postedBy?.companyName}
                </span>
              </span>

              {role !== "hr" && (
                <button
                  onClick={() =>
                    navigate(`/student/apply/${job._id}`, { state: job })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        ))}

      </div>
    )}
  </div>
);

};

export default PostJobs;
