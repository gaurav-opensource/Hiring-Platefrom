import { useState, useEffect } from "react";
import axios from "axios";

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
        alert("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchHrJobs();
  }, []);

  const handleJobSelect = (job) => setSelectedJob(job);

  const renderStageComponent = () => {
    if (!selectedJob) return null;

    const stageObj = stages.find((s) => s.key === selectedJob.stage);
    if (!stageObj) return <p>Unknown Stage</p>;

    const StageComponent = stageObj.component;
    return <StageComponent job={selectedJob} />;
  };

  const renderStageTracker = () => {
    if (!selectedJob) return null;

    const currentIndex = stages.findIndex((s) => s.key === selectedJob.stage);

    return (
      <div className="relative flex items-center justify-between my-6 px-6">
        {/* Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -z-10" />

        {stages.map((stage, index) => {
          let status = "pending";
          if (index < currentIndex) status = "completed";
          else if (index === currentIndex) status = "current";

          const color =
            status === "completed"
              ? "bg-green-500 text-white"
              : status === "current"
              ? "bg-blue-600 text-white ring-4 ring-blue-200"
              : "bg-gray-300 text-gray-600";

          return (
            <div key={stage.key} className="flex flex-col items-center w-full">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold shadow ${color}`}
              >
                {index + 1}
              </div>
              <p className="text-xs mt-2 text-gray-700 text-center w-20">
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading HR Dashboard...
      </div>
    );

  return (
    <div className="flex h-screen pt-20 bg-gradient-to-br from-[#f5f8ff] to-[#e9efff]">

      {/* SIDEBAR */}
      <div className="w-72 bg-white/80 backdrop-blur-xl border-r shadow-lg p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Jobs</h2>

        {hrData.length === 0 ? (
          <p className="text-gray-500">No jobs available</p>
        ) : (
          hrData.map((job) => (
            <div
              key={job._id}
              onClick={() => handleJobSelect(job)}
              className={`p-4 mb-3 rounded-xl cursor-pointer transition border ${
                selectedJob?._id === job._id
                  ? "bg-blue-100 border-blue-400 shadow-md"
                  : "bg-white hover:bg-gray-100 border-gray-200"
              }`}
            >
              <h3 className="text-gray-800 font-medium">{job.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{job.company}</p>
            </div>
          ))
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">
        {selectedJob ? (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedJob.title}
              </h2>
              <p className="text-gray-600 mt-1">
                Stage:{" "}
                <span className="font-semibold text-blue-600">
                  {selectedJob.stage.toUpperCase()}
                </span>
              </p>
            </div>

            {/* Stage Tracker */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border p-6">
              {renderStageTracker()}
            </div>

            {/* Stage Work Panel */}
            <div className="mt-6 bg-white/80 backdrop-blur-xl shadow-lg border p-6 rounded-xl">
              {renderStageComponent()}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 text-lg mt-20">
            ← Select a job from the sidebar to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
