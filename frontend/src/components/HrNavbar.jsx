import { Link, useNavigate } from "react-router-dom";

export default function HrNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/hr/login");
  };

  return (
    <nav className="bg-green-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <Link to="/jobs" className="text-xl font-bold">HR Panel</Link>
      <div className="flex gap-6">
        <Link to="/hr/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/hr/create" className="hover:underline">Create Jobs</Link>
        <Link to="/hr/profile" className="hover:underline">Profile</Link>
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
