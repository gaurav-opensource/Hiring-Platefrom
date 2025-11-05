import { Link, useNavigate } from "react-router-dom";

const HrNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/hr/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/jobs" className="text-gray-700 hover:text-green-600 text-sm font-medium transition">
            Home
          </Link>
          <Link to="/hr/dashboard" className="text-gray-700 hover:text-green-600 text-sm font-medium transition">
            Dashboard
          </Link>
          <Link to="/hr/create" className="text-gray-700 hover:text-green-600 text-sm font-medium transition">
            Create Jobs
          </Link>
          
        </div>

        
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center text-2xl font-bold">
          HR<sup className="text-xs">®</sup>
          <span className="text-green-600 ml-1">Panel</span>
        </div>

        <div className="flex items-center space-x-4">
           <Link to="/hr/profile" className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition duration-200">
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


export default HrNavbar;