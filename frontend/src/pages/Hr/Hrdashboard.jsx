import { useState, useEffect } from "react";
import axios from "axios";

// Stage Components
import ResumeScreening from "./stages/ResumeScreening";
import ProfileReview from "./stages/ProfileReview";
import CodingTest from "./stages/CodingTest";
import TestEvaluation from "./stages/TestEvaluation";
import Interview from "./stages/Interview";

import BASE_URL from "../../apiConfig";

const stages = [
  { key: "resume", label: "Resume Screening", component: ResumeScreening },
  { key: "profile", label: "Profile Review", component: ProfileReview },
  { key: "coding", label: "Coding Test", component: CodingTest },
  { key: "evaluation", label: "Test Evaluation", component: TestEvaluation },
  { key: "interview", label: "Interview", component: Interview },
];

const HRDashboard = () => {
  const [hrData, setHrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs
  useEffect(() => {
    const fetchHrJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/job/getjobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHrData(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        alert("Failed to fetch HR jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchHrJobs();
  }, []);

  // When a job is selected
  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  // Render only the current stage component based on job.stage
  const renderStageComponent = () => {
    if (!selectedJob) return null;
    const stageObj = stages.find((s) => s.key === selectedJob.stage);
    if (!stageObj) return <p>Unknown stage.</p>;
    const StageComponent = stageObj.component;
    return <StageComponent job={selectedJob} />;
  };

  
  const renderStageTracker = () => {
  if (!selectedJob) return null;
  const currentIndex = stages.findIndex((s) => s.key === selectedJob.stage);

  return (
    <div className="flex mb-6 justify-center items-center">
      {stages.map((stage, index) => {
        let status = "pending";
        if (index < currentIndex) status = "completed";
        else if (index === currentIndex) status = "current";

        return (
          <div key={stage.key} className="flex flex-col items-center flex-1">
            {/* Circle */}
            <div
              className={`w-8 h-8 rounded-full flex justify-center items-center ${
                status === "completed"
                  ? "bg-green-500 text-white"
                  : status === "current"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>

            {/* Label */}
            <div className="text-xs mt-2 text-center">
              {stage.label}
            </div>

            {/* Line */}
            {index < stages.length - 1 && (
              <div className="absolute w-full h-1 bg-gray-300 top-4 left-1/2 z-0">
                <div
                  className={`h-1 ${
                    index < currentIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

  if (loading) return <p className="text-center mt-10">⏳ Loading jobs...</p>;

  return (
    <div className="flex h-screen pt-20">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Jobs</h2>
        {hrData.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          hrData.map((job) => (
            <div
              key={job._id}
              onClick={() => handleJobSelect(job)}
              className={`p-3 mb-2 rounded cursor-pointer ${
                selectedJob?._id === job._id ? "bg-blue-200" : "bg-white"
              }`}
            >
              {job.title}
            </div>
          ))
        )}
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedJob ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              {selectedJob.title} – {selectedJob.stage.toUpperCase()}
            </h2>

            {/* Stage Tracker */}
            {renderStageTracker()}

            {/* Stage Work Area */}
            <div className="border rounded p-6 bg-gray-50">
              {renderStageComponent()}
            </div>
          </>
        ) : (
          <p className="text-gray-500">⬅️ Select a job to view its stage.</p>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
