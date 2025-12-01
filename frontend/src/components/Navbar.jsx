import { Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi"; // Mobile menu icon

export default function Navbar() {
  const primaryColor = "purple-600";
  const hoverBgColor = "purple-50";
  const hoverTextColor = "purple-700";

  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
      
      {/* Left Side: Logo (CSS Styling) */}
      <div className="flex items-center space-x-2">
        <div className={`w-6 h-6 rounded-full bg-${primaryColor} flex items-center justify-center`}>
          <span className="text-white text-sm font-bold">W</span>
        </div>
        <span className="text-xl font-bold text-gray-800">WorkFinder</span> 
      </div>

      {/* Middle Menu */}
      <ul className="hidden md:flex space-x-8 text-gray-600">
        <li>
          <Link to="/" className={`hover:text-${primaryColor}`}>Home</Link>
        </li>
        <li>
          <Link to="/" className={`hover:text-${primaryColor}`}>About</Link>
        </li>
        <li>
          <Link to="/" className={`hover:text-${primaryColor}`}>Services</Link>
        </li>
        <li>
          <Link to="/" className={`hover:text-${primaryColor}`}>Categories</Link>
        </li>
        <li>
          <Link to="/" className={`hover:text-${primaryColor}`}>Contact</Link>
        </li>
      </ul>

      {/* Right Side Buttons and Mobile Menu Icon */}
      <div className="flex items-center space-x-4">
        
        {/* Login Button */}
        <Link
          to="/login"
          className={`hidden md:block border border-${primaryColor} text-${primaryColor} px-4 py-2 rounded-lg hover:bg-${hoverBgColor} transition`}
        >
          Login
        </Link>
        
        {/* Signup Button */}
        <Link
          to="/signup"
          className={`hidden md:block bg-${primaryColor} text-white px-4 py-2 rounded-lg hover:bg-${hoverTextColor} transition`}
        >
          Signup
        </Link>
        
        {/* Mobile Menu Button (Hamburger) */}
        <button className="md:hidden text-gray-600 hover:text-purple-600 p-1">
          <HiMenu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}