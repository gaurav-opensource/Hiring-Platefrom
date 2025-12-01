import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../../apiConfig";

export default function HRSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    companyName: "",
    position: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${BASE_URL}/hr/register`, formData);
      setMessage("HR Registered Successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        contact: "",
        companyName: "",
        position: "",
      });
      navigate("/login");
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#0A0F1F] via-[#1B2340] to-[#301A4A]">
      
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/20 blur-[150px]" />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10 bg-white/10 backdrop-blur-xl text-gray-200">

        <h2 className="text-4xl font-extrabold mb-6 text-center text-white drop-shadow">
          HR Sign Up
        </h2>

        {message && (
          <div
            className={`text-sm p-3 mb-4 rounded text-center border ${
              message.includes("Error")
                ? "bg-red-500/20 text-red-300 border-red-500/40"
                : "bg-green-500/20 text-green-300 border-green-500/40"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fields */}
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Contact Number", name: "contact", type: "text" },
            { label: "Company Name", name: "companyName", type: "text" },
            { label: "Position", name: "position", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-300 mb-2 font-medium">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.label}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          ))}

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold p-3 rounded-lg transition shadow-lg"
          >
            Sign Up
          </button>
        </form>

        {/* Go to Login */}
        <p className="text-center text-gray-300 mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-300 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
