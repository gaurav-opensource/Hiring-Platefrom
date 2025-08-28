import { Link, useNavigate } from "react-router-dom";

export default function StudentNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/student/login");
  };

  return (
    <nav className="bg-purple-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <Link to="/jobs" className="text-xl font-bold">Student Panel</Link>
      <div className="flex gap-6">
        <Link to="/student/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/student/apply-job" className="hover:underline">Apply Jobs</Link>
        <Link to="/student/profile" className="hover:underline">Profile</Link>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
