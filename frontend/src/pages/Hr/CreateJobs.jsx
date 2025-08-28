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
    deadline: ""
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
      salaryRange: { ...formData.salaryRange, [e.target.name]: e.target.value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/hr/create`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Job created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating job");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="company"
          placeholder="Company"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="employmentType"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>

        <select
          name="experienceLevel"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Fresher</option>
          <option>Junior</option>
          <option>Mid-Level</option>
          <option>Senior</option>
          <option>Lead</option>
        </select>

        <textarea
          name="description"
          placeholder="Job Description"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Responsibilities */}
        <h4 className="font-semibold">Responsibilities</h4>
        {formData.responsibilities.map((res, i) => (
          <input
            key={i}
            value={res}
            onChange={(e) => handleArrayChange("responsibilities", i, e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
        ))}
        <button type="button" onClick={() => addArrayField("responsibilities")} className="text-blue-500">
          + Add Responsibility
        </button>

        {/* Requirements */}
        <h4 className="font-semibold">Requirements</h4>
        {formData.requirements.map((req, i) => (
          <input
            key={i}
            value={req}
            onChange={(e) => handleArrayChange("requirements", i, e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
        ))}
        <button type="button" onClick={() => addArrayField("requirements")} className="text-blue-500">
          + Add Requirement
        </button>

        {/* Skills */}
        <h4 className="font-semibold">Skills</h4>
        {formData.skills.map((skill, i) => (
          <input
            key={i}
            value={skill}
            onChange={(e) => handleArrayChange("skills", i, e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
        ))}
        <button type="button" onClick={() => addArrayField("skills")} className="text-blue-500">
          + Add Skill
        </button>

        {/* Salary Range */}
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            name="min"
            placeholder="Min Salary"
            value={formData.salaryRange.min}
            onChange={handleSalaryChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="max"
            placeholder="Max Salary"
            value={formData.salaryRange.max}
            onChange={handleSalaryChange}
            className="border p-2 rounded"
          />
          <select
            name="currency"
            value={formData.salaryRange.currency}
            onChange={handleSalaryChange}
            className="border p-2 rounded"
          >
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>

        <input
          name="deadline"
          type="date"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Create Job
        </button>
      </form>
    </div>
  );
};

export default CreateJobs;
