import { Outlet } from "react-router-dom";
import HrNavbar from "../components/HrNavbar";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";

export default function PublicLayout() {
  const role = localStorage.getItem("role");

  return (
    <div>
      {role === "hr" ? <HrNavbar /> : <StudentNavbar />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
