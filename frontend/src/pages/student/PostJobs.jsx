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
    <div className="min-h-screen p-4 md:p-8 pt-40 md:pt-32" style={gradientStyle}>
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
        🚀 Find Your Dream Job
      </h2>
      <p className="text-center text-lg text-purple-700 mb-12 max-w-3xl mx-auto border-b-2 border-purple-300 pb-3">
        Discover opportunities that match your skills and ambitions.
      </p>

      <div className="flex justify-center gap-4 mb-10">
        <input
          type="number"
          placeholder="Jobs in last X days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="border border-gray-300 p-3 rounded-xl w-48 text-base focus:ring-2 focus:ring-purple-500 outline-none shadow-inner transition"
        />
        <button
          onClick={() => fetchJobs(days)}
          className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition duration-300 transform hover:scale-105"
        >
          <FaBullhorn className="inline mr-2" /> Filter
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-700 text-xl mt-20">
          No jobs match your filter. Try broadening your search!
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3 shadow-inner">
                  <FaBuilding className="text-purple-600 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm font-medium text-gray-700">{job.company}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <FaClock className="inline w-3 h-3 mr-1" /> {getTimeElapsed(job.createdAt)}
                  </p>
                </div>
              </div>

              {/* Job Info Tags */}
              <div className="flex flex-wrap gap-2 text-xs mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> {job.location || "Remote"}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold flex items-center">
                  <FaUserTie className="mr-1" /> {job.jobType || "Full-time"}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold flex items-center">
                  <FaDollarSign className="mr-1" /> {job.salary || "Not disclosed"}
                </span>
              </div>

              {/* Description and Skills */}
              <div className="mb-3">
                <p className="text-gray-700 text-sm line-clamp-3 mb-2">
                  <FaBriefcase className="inline mr-2 text-purple-600" />
                  {job.description || "No description provided"}
                </p>
                {job.skills && (
                  <p className="text-sm text-gray-600">
                    <FaClipboardList className="inline mr-2 text-green-600" />
                    <strong>Skills:</strong> {job.skills.join(", ")}
                  </p>
                )}
                {job.experience && (
                  <p className="text-sm text-gray-600 mt-1">
                    <FaUserTie className="inline mr-2 text-indigo-600" />
                    <strong>Experience:</strong> {job.experience} years
                  </p>
                )}
                {job.qualification && (
                  <p className="text-sm text-gray-600 mt-1">
                    <FaGraduationCap className="inline mr-2 text-pink-600" />
                    <strong>Qualification:</strong> {job.qualification}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Posted by:</span>{" "}
                  {job.postedBy?.name || job.postedBy?.companyName || "Recruiter"}
                </p>
                {role !== "hr" && (
                  <button
                    onClick={() => navigate(`/student/apply/${job._id}`, { state: job })}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition duration-300 transform hover:scale-105"
                  >
                    Apply Now
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
