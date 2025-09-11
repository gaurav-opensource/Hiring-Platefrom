import { Link, useNavigate } from "react-router-dom";

export default function StudentNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/student/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        {/* Left navigation links */}
        <div className="hidden md:flex items-center space-x-6">
           <Link to="/jobs" className="text-gray-700 hover:text-purple-600 text-sm font-medium transition">
            Home
          </Link>
          <Link to="/student/dashboard" className="text-gray-700 hover:text-purple-600 text-sm font-medium transition">
            Dashboard
          </Link>
          
        
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center text-2xl font-bold">
          Best<sup className="text-xs">®</sup>
          <span className="text-teal-500 ml-1">Hiring</span>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/student/profile" className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition duration-200">
            Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
