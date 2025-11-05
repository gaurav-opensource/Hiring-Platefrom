import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../apiConfig";
import Loader from '../ui/Loader'

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md relative"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Login
        </h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading} 
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 w-full rounded-lg transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Login"} {/* ✅ Show different text if loading */}
        </button>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
