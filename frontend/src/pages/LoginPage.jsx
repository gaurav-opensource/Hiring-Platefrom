// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../apiConfig";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const endpoint = `${BASE_URL}/students/login`; // 👈 common login API
      const response = await axios.post(endpoint, { email, password });

      const { token, role } = response.data; // backend must return {token, role}
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      alert("Login successful!");

      // Redirect based on role
      if (role === "student") {
        window.location.href = "/student/profile";
      } else if (role === "hr") {
        window.location.href = "/hr/profile";
      } else {
        window.location.href = "/"; // fallback
      }
    } catch (error) {
      alert(
        "Login failed: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded mb-4"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
