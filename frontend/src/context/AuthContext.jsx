import { useState } from "react";
import axios from "axios";
import BASE_URL from "../apiConfig";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${BASE_URL}/auth/login`, credentials);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${BASE_URL}/auth/signup`, data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return { login, signup, loading, error };
};
