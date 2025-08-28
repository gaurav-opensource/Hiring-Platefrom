import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "../../apiConfig";

// ✅ Cloudinary Upload Helper (for PDF/Docs resumes)
const uploadToCloudinary = async (file, type = "raw") => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ml_default"); // 👈 replace with your preset from Cloudinary
  data.append("cloud_name", "dznnyaj0z"); // 👈 your cloud name
  data.append("folder", "Healthcare");

  const url =
    type === "image"
      ? "https://api.cloudinary.com/v1_1/dznnyaj0z/image/upload"
      : "https://api.cloudinary.com/v1_1/dznnyaj0z/raw/upload";

  // 👇 IMPORTANT: for raw files (PDF/Docs), force resource_type
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

      // 1️⃣ Upload resume to Cloudinary
      const resumeLink = await uploadToCloudinary(form.resume, "raw");

      // 2️⃣ Send to backend
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
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Apply for {job?.title}</h2>

      {/* Job Details */}
      <div className="mb-6 text-gray-700">
        <p><strong>Company:</strong> {job?.company}</p>
        <p><strong>Location:</strong> {job?.location}</p>
        <p><strong>Type:</strong> {job?.jobType}</p>
        <p><strong>Salary:</strong> {job?.salary}</p>
        <p><strong>Deadline:</strong> {job?.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</p>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyPage;
