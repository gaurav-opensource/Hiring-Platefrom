import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../apiConfig";
import Loader from "../ui/Loader";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const endpoint = `${BASE_URL}/students/login`;
      const response = await axios.post(endpoint, { email, password });

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "student") {
        navigate("/student/profile");
      } else if (role === "hr") {
        navigate("/hr/profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#0A0F1F] via-[#1B2340] to-[#301A4A]">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/20 blur-[150px]" />
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <Loader />
        </div>
      )}

      {/* LOGIN FORM */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-10 rounded-2xl shadow-2xl border border-white/10 bg-white/10 backdrop-blur-xl text-gray-200"
      >
        <h2 className="text-4xl font-extrabold text-center text-white drop-shadow mb-8">
          Welcome Back
        </h2>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="bg-red-500/20 text-red-300 border border-red-500/40 p-3 rounded-lg text-sm text-center mb-4">
            {errorMsg}
          </div>
        )}

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-300 mb-2 font-medium">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-lg shadow-md transition-all
          bg-purple-600 hover:bg-purple-700 active:scale-[0.98]
          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register Link */}
        <p className="text-center text-gray-300 mt-5 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-300 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
