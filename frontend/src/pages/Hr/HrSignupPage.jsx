import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";

export default function HRSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password:"",
    contact: "",
    companyName: "",
    position: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/hr/register`, formData);
      setMessage("HR Registered Successfully!");
      setFormData({ name: "", email: "", contact: "",password:"", companyName: "", position: "" });
      navigate('/login')
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          HR Sign Up
        </h2>
        {message && (
          <p className="text-center mb-4 text-sm text-green-600">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
          />
           <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
