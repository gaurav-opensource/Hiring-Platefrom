import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../apiConfig";

const CreateJobs = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    employmentType: "Full-Time",
    experienceLevel: "Fresher",
    description: "",
    responsibilities: [""],
    requirements: [""],
    skills: [""],
    salaryRange: { min: "", max: "", currency: "INR" },
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleSalaryChange = (e) => {
    setFormData({
      ...formData,
      salaryRange: { ...formData.salaryRange, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/hr/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 pt-40 pb-20">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/50">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
          🧑‍💼 Create a New Job Posting
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Title */}
          <input
            name="title"
            placeholder="Job Title"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Company */}
          <input
            name="company"
            placeholder="Company"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Location */}
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Employment Type */}
          <select
            name="employmentType"
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>

          {/* Experience Level */}
          <select
            name="experienceLevel"
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option>Fresher</option>
            <option>Junior</option>
            <option>Mid-Level</option>
            <option>Senior</option>
            <option>Lead</option>
          </select>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Job Description"
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Responsibilities */}
          <div>
            <h4 className="font-semibold text-indigo-600 mb-2">
              Responsibilities
            </h4>
            {formData.responsibilities.map((res, i) => (
              <input
                key={i}
                value={res}
                onChange={(e) =>
                  handleArrayChange("responsibilities", i, e.target.value)
                }
                placeholder={`Responsibility ${i + 1}`}
                className="w-full border border-gray-300 p-2 rounded-lg mb-2 focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayField("responsibilities")}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Responsibility
            </button>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="font-semibold text-indigo-600 mb-2">Requirements</h4>
            {formData.requirements.map((req, i) => (
              <input
                key={i}
                value={req}
                onChange={(e) =>
                  handleArrayChange("requirements", i, e.target.value)
                }
                placeholder={`Requirement ${i + 1}`}
                className="w-full border border-gray-300 p-2 rounded-lg mb-2 focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayField("requirements")}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Requirement
            </button>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-semibold text-indigo-600 mb-2">Skills</h4>
            {formData.skills.map((skill, i) => (
              <input
                key={i}
                value={skill}
                onChange={(e) =>
                  handleArrayChange("skills", i, e.target.value)
                }
                placeholder={`Skill ${i + 1}`}
                className="w-full border border-gray-300 p-2 rounded-lg mb-2 focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayField("skills")}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Skill
            </button>
          </div>

          {/* Salary Range */}
          <div>
            <h4 className="font-semibold text-indigo-600 mb-2">Salary Range</h4>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                name="min"
                placeholder="Min"
                value={formData.salaryRange.min}
                onChange={handleSalaryChange}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
              />
              <input
                type="number"
                name="max"
                placeholder="Max"
                value={formData.salaryRange.max}
                onChange={handleSalaryChange}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
              />
              <select
                name="currency"
                value={formData.salaryRange.currency}
                onChange={handleSalaryChange}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
              >
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <h4 className="font-semibold text-indigo-600 mb-2">Deadline</h4>
            <input
              type="date"
              name="deadline"
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition duration-300 font-semibold text-lg"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobs;
