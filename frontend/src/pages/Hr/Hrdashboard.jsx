import React, { useState, useEffect } from "react";
import axios from "axios";

// Stage Components
import ResumeScreening from "./stages/ResumeScreening";
import ProfileReview from "./stages/ProfileReview";
import CodingTest from "./stages/CodingTest";
import TestEvaluation from "./stages/TestEvaluation";
import Interview from "./stages/Interview";

const BASE_URL = "http://localhost:5000/api"; // backend URL

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
  const [currentStage, setCurrentStage] = useState(0);

  // ✅ Fetch jobs from backend
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

  const renderStageComponent = () => {
    const StageComponent = stages[currentStage].component;
    return <StageComponent job={selectedJob} />;
  };

  if (loading) return <p className="text-center mt-10">⏳ Loading jobs...</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Jobs</h2>
        {hrData.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          hrData.map((job) => (
            <div
              key={job._id}
              onClick={() => {
                setSelectedJob(job);
                setCurrentStage(0);
              }}
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
              {selectedJob.title} – Hiring Workflow
            </h2>

            {/* Stage Tracker */}
            <div className="flex mb-6">
              {stages.map((stage, index) => (
                <div
                  key={stage.key}
                  className={`flex-1 text-center py-2 px-3 border rounded mx-1 cursor-pointer ${
                    index === currentStage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setCurrentStage(index)}
                >
                  {stage.label}
                </div>
              ))}
            </div>

            {/* Stage Work Area */}
            <div className="border rounded p-6 bg-gray-50">
              {renderStageComponent()}
            </div>
          </>
        ) : (
          <p className="text-gray-500">⬅️ Select a job to start.</p>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
