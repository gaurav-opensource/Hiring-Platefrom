import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="WorkFinder Logo" className="w-6 h-6" />
        <span className="text-xl font-bold text-gray-800">WorkFinder</span>
      </div>

      {/* Middle Menu */}
      <ul className="hidden md:flex space-x-8 text-gray-600">
        <li>
          <Link to="/" className="hover:text-blue-600">Home</Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-blue-600">About</Link>
        </li>
        <li>
          <Link to="/services" className="hover:text-blue-600">Services</Link>
        </li>
        <li>
          <Link to="/categories" className="hover:text-blue-600">Categories</Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        </li>
      </ul>

      {/* Right Side Buttons */}
      <div className="flex space-x-4">
        
       

        {/* Student Buttons */}
        <Link
          to="/login"
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
}
