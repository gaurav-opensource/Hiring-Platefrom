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
import ApplyForJob from "./pages/student/ApplyForJob";
import StudentDashboard from "./pages/student/StudentDashboard";
import TestPage from "./pages/student/TestCodeEditorPage";



// Hr Pages
import HrProfilePage from "./pages/Hr/HrProfilePage";
import PostJobs from "./pages/student/PostJobs";
import HrSignupPage from "./pages/Hr/HrSignupPage";
import CreateJobs from "./pages/Hr/CreateJobs";
import HRCreateQuestion from "./pages/Hr/HRCreateQuestion";
import HRJobDashboardStepper from "./pages/Hr/Hrdashboard";
import StudentEditProfile from "./pages/student/EditProfilePage";





function App() {
  return (
    <Routes>
      {/* Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Public route */}
        <Route path="/signup" element={<RoleSelectionPage />} />
        <Route path="/hr/signup" element={<HrSignupPage />} />
        <Route path="/student/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/students/:jobId/:userId" element={<TextCodeEditorPage />} />

    
      <Route element={<PublicLayout />}>
        {/* student route  */}
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/apply/:jobId" element={<ApplyForJob/>} />
        <Route path="/student/dashboard" element={<StudentDashboard/>} />
         <Route path="/edit-profile" element={<StudentEditProfile />} />

        {/* Hr route} */}
        <Route path="/hr/profile" element={<HrProfilePage />} />
        <Route path="/hr/create" element={<CreateJobs />} />
        <Route path="/hr/createquestion" element={<HRCreateQuestion/>} />
        <Route path="/test/:jobId/:studentId/:token" element={<TestPage />} />
         <Route path="/hr/dashboard" element={<HRJobDashboardStepper/>} />
        <Route path="/" element={<div style={{padding:20}}>Open /hr/create or /hr/assign</div>} />
        
        
       
        {/* Unique route} */}
        <Route path="/jobs" element={<PostJobs />} />

      </Route>
    </Routes>
  );
}

export default App;
