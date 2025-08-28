// src/pages/HrProfilePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import BASE_URL from "../../apiConfig";

const HrProfilePage = () => {
  const [hrData, setHrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHrProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/hr/getProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHrData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch HR profile");
      } finally {
        setLoading(false);
      }
    };

    fetchHrProfile();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!hrData) {
    return <p>No HR data found</p>;
  }

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        HR Profile
      </h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {hrData.name}</p>
        <p><strong>Email:</strong> {hrData.email}</p>
        <p><strong>Contact:</strong> {hrData.contact}</p>
        <p><strong>Company:</strong> {hrData.companyName}</p>
        <p><strong>Position:</strong> {hrData.position}</p>
      </div>
    </motion.div>
  );
};

export default HrProfilePage;
