import { useEffect, useState } from "react";
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
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <p className="text-xl text-blue-700 font-semibold animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!hrData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <p className="text-xl text-red-600 font-semibold">No HR data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex justify-center items-center p-6">
      <motion.div
        className="max-w-md w-full bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/40 hover:shadow-blue-300 transition duration-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div
            className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            {hrData.name?.charAt(0).toUpperCase()}
          </motion.div>
          <h2 className="text-3xl font-extrabold mt-4 text-indigo-700">
            {hrData.name}
          </h2>
          <p className="text-gray-600">{hrData.position}</p>
        </div>

        <div className="space-y-3 text-gray-800">
          <p>
            <strong className="text-indigo-600">Email:</strong> {hrData.email}
          </p>
          <p>
            <strong className="text-indigo-600">Contact:</strong>{" "}
            {hrData.contact}
          </p>
          <p>
            <strong className="text-indigo-600">Company:</strong>{" "}
            {hrData.companyName}
          </p>
          <p>
            <strong className="text-indigo-600">Position:</strong>{" "}
            {hrData.position}
          </p>
        </div>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300">
            Edit Profile
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HrProfilePage;
