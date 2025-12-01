import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center h-16">

        {/* LEFT - NAV LINKS */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/jobs"
            className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/student/dashboard"
            className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
          >
            Dashboard
          </Link>
        </div>

        {/* CENTER - LOGO */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center text-2xl font-bold">
          Best<sup className="text-xs">®</sup>
          <span className="text-blue-600 ml-1">Hiring</span>
        </div>

        {/* RIGHT - PROFILE + MENU */}
        <div className="flex items-center space-x-4 relative">

          {/* Profile ALWAYS visible */}
          <Link
            to="/student/profile"
            className="flex items-center bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <FaUserCircle className="text-lg mr-1" /> Profile
          </Link>

          {/* 3-dot menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <FiMoreVertical className="text-xl text-gray-700" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-xl rounded-lg w-40 py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
