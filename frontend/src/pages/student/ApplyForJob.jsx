import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "../../apiConfig";
import Loader from "../../ui/Loader";

const uploadToCloudinary = async (file, type = "raw") => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ml_default");
  data.append("cloud_name", "dznnyaj0z");
  data.append("folder", "Healthcare");

  const url =
    type === "image"
      ? "https://api.cloudinary.com/v1_1/dznnyaj0z/image/upload"
      : "https://api.cloudinary.com/v1_1/dznnyaj0z/raw/upload";

  const res = await axios.post(url, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.secure_url;
};

const ApplyPage = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state;
  console.log("Job ID:", jobId);

  const [form, setForm] = useState({
    name: "",
    email: "",
    resume: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.resume) {
      alert("Please upload your resume!");
      return;
    }

    try {
      setLoading(true);
      const resumeLink = await uploadToCloudinary(form.resume, "raw");

      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/job/apply/${jobId}`,
        {
          name: form.name,
          email: form.email,
          resumeLink,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Application submitted successfully!");
      navigate("/jobs");
    } catch (err) {
      console.error("Application Error:", err);
      alert(err.response?.data?.message || "Error applying for job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl">
        {/* Page Header */}
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Apply for {job?.title}
        </h2>

        {/* Job Summary Card */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8">
          <p className="text-gray-800">
            <strong>Company:</strong> {job?.company}
          </p>
          <p className="text-gray-800">
            <strong>Location:</strong> {job?.location}
          </p>
          <p className="text-gray-800">
            <strong>Type:</strong> {job?.jobType}
          </p>
          <p className="text-gray-800">
            <strong>Salary:</strong> {job?.salary}
          </p>
          <p className="text-gray-800">
            <strong>Deadline:</strong>{" "}
            {job?.deadline
              ? new Date(job.deadline).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              name="resume"
              accept=".pdf"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              required
            />
          </div>

          <div className="pt-4">
            {loading ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyPage;
