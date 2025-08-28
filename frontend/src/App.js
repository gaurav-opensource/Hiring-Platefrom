import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";


// Pages
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/LoginPage";


// Student Pages
import SignupPage from "./pages/student/SignupPage";
import TextCodeEditorPage from "./pages/student/TestCodeEditorPage";
import StudentProfile from "./pages/student/StudentProfile";
import ApplyPage from "./pages/student/ApplyPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import TestPage from "./pages/student/TestCodeEditorPage";



// Hr Pages
import HrProfilePage from "./pages/Hr/HrProfilePage";
import PostJobs from "./pages/student/PostJobs";
import HrSignupPage from "./pages/Hr/HrSignupPage";
import CreateJobs from "./pages/Hr/CreateJobs";
import HRCreateQuestion from "./pages/Hr/HRCreateQuestion";
import HRGenerateLink from "./pages/Hr/HRGenerateLink";
import HRJobDashboardStepper from "./pages/Hr/Hrdashboard";
import Loader from "./ui/Loader";
import Button from "./ui/Button";
import SelectStudentsPage from "./pages/Hr/SelectStudent";





function App() {
  return (
    <Routes>
      {/* Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
        <Route path="/signup" element={<RoleSelectionPage />} />
        <Route path="/hr/signup" element={<HrSignupPage />} />
        <Route path="/student/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loader" element={<Button/>} />

    
      <Route element={<PublicLayout />}>
        {/* student route  */}
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/apply/:jobId" element={<ApplyPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard/>} />


        {/* Hr route} */}
        <Route path="/hr/profile" element={<HrProfilePage />} />
        <Route path="/hr/select" element={<SelectStudentsPage />} />
        <Route path="/hr/create" element={<CreateJobs />} />
        <Route path="/hr/createquestion" element={<HRCreateQuestion/>} />
        <Route path="/hr/assign" element={<HRGenerateLink/>} />
        <Route path="/test/:jobId/:studentId/:token" element={<TestPage />} />
         <Route path="/hr/dashboard" element={<HRJobDashboardStepper/>} />
        <Route path="/" element={<div style={{padding:20}}>Open /hr/create or /hr/assign</div>} />
        
        
       
        {/* Unique route} */}
        <Route path="/jobs" element={<PostJobs />} />
        <Route path="/students/:jobId/:studentId" element={<TextCodeEditorPage />} />

      </Route>
    </Routes>
  );
}

export default App;
