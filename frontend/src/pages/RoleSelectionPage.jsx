import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

 const RoleSelectionPage = () =>{

  const navigate = useNavigate();

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-extrabold mb-10 text-gray-800"
      >
        Who are you?
      </motion.h1>

      <div className="flex gap-10">
        {/* Student Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          onClick={() => navigate("/student/signup")}
          className="px-8 py-4 bg-blue-500 text-white rounded-2xl shadow-lg hover:bg-blue-600 font-medium"
        >
          🎓 I am a Student
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          onClick={() => navigate("/hr/signup")}
          className="px-8 py-4 bg-green-500 text-white rounded-2xl shadow-lg hover:bg-green-600 font-medium"
        >
          💼 I am an HR
        </motion.button>
      </div>
    </div>
  );
}

export default RoleSelectionPage;