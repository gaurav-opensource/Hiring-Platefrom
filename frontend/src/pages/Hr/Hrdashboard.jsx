import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// ✅ Steps configuration
const STEPS = [
  { key: "resumeScreen", label: "Resume Screening", api: "resume-screen" },
  { key: "selectForTest", label: "Select Top for Test", api: "select-top" },
  { key: "createQ", label: "Create Questions", api: "create-questions" },
  { key: "genLinks", label: "Generate Test Links", api: "generate-links" },
  { key: "calcScore", label: "Calculate Test Scores", api: "calculate-scores" },
  { key: "finalSelect", label: "Final Selection (Interview)", api: "final-selection" },
];

const HRJobDashboardStepper = () => {
  const [hrData, setHrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [loadingStep, setLoadingStep] = useState(false);

  // ✅ Fetch HR Jobs
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

  // ✅ Fetch applicants
  const fetchApplicants = async (jobId) => {
    try {
      setLoadingApplicants(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/job/students/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data || []);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      alert("Failed to fetch applicants");
    } finally {
      setLoadingApplicants(false);
    }
  };

  // ✅ Handle step button click
  const handleStepClick = async (step, index) => {
    if (!selectedJob) return;
    try {
      setLoadingStep(true);
      const token = localStorage.getItem("token");

      // 🔑 Step API call
      await axios.post(
        `${BASE_URL}/job/${selectedJob._id}/${step.api}`,
        {},
      );

      // 🔑 Update currentStep in backend
      const res = await axios.post(
        `${BASE_URL}/job/${selectedJob._id}/step/${index + 1}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.updatedJob) {
        setSelectedJob(res.data.updatedJob);
      } else {
        // fallback agar backend job na bheje
        setSelectedJob((prev) => ({
          ...prev,
          currentStep: index + 1,
        }));
      }
    } catch (error) {
      console.error(`Error in ${step.label}:`, error);
      alert(`Failed: ${step.label}`);
    } finally {
      setLoadingStep(false);
    }
  };

  // ✅ When job is selected → fetch updated currentStep
  const handleJobSelect = async (job) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/job/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedJob(res.data); // updated job with currentStep
      setApplicants([]);
    } catch (err) {
      console.error("Error fetching job details:", err);
      setSelectedJob(job); // fallback
    }
  };

  if (loading) return <p className="text-center">⏳ Loading jobs...</p>;

  return (
    <div className="flex p-6 gap-8 bg-gray-50 min-h-screen">
      {/* Left side: Jobs list */}
      <div className="w-1/3 pr-4 border-r">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Posted Jobs</h2>
        {hrData.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          <ul className="space-y-4">
            {hrData.map((job) => (
              <li
                key={job._id}
                onClick={() => handleJobSelect(job)}
                className={`p-4 rounded-xl shadow-md cursor-pointer transition ${
                  selectedJob?._id === job._id
                    ? "bg-blue-100 border border-blue-400"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="text-sm font-medium text-green-700 mt-1">
                  💰 {job.salaryRange?.min} - {job.salaryRange?.max}{" "}
                  {job.salaryRange?.currency}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right side: Selected job details */}
      <div className="w-2/3 bg-white rounded-xl shadow-md p-6">
        {selectedJob ? (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {selectedJob.title}
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>📍 Location:</strong> {selectedJob.location}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>💰 Salary:</strong>{" "}
              {selectedJob.salaryRange?.min} - {selectedJob.salaryRange?.max}{" "}
              {selectedJob.salaryRange?.currency}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>📝 Description:</strong> {selectedJob.description}
            </p>

            {/* ✅ Progress Tracker */}
            <div className="flex items-center mb-6">
              {STEPS.map((step, index) => {
                const jobStep = selectedJob.currentStep || 0;
                const isCompleted = index < jobStep;
                const isActive = index === jobStep;

                return (
                  <div key={step.key} className="flex items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                        isCompleted
                          ? "bg-green-600 text-white"
                          : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="w-12 h-1 bg-gray-300 mx-2"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ✅ Stepper Buttons */}
            <div className="mt-6 space-y-3">
              {STEPS.map((step, index) => {
                const jobStep = selectedJob.currentStep || 0;
                const isCompleted = index < jobStep;
                const isActive = index === jobStep;

                return (
                  <button
                    key={step.key}
                    onClick={() => handleStepClick(step, index)}
                    disabled={!isActive || loadingStep}
                    className={`px-4 py-2 w-full rounded flex items-center gap-2 ${
                      isCompleted
                        ? "bg-green-600 text-white cursor-not-allowed"
                        : isActive
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                  >
                    {isCompleted ? "✅" : isActive ? "🔵" : "🔒"}{" "}
                    {loadingStep && isActive ? "Processing..." : step.label}
                  </button>
                );
              })}

              {/* Applicants button */}
              <button
                className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition"
                onClick={() => fetchApplicants(selectedJob._id)}
              >
                View Applicants
              </button>
            </div>

            {/* ✅ Applicants List */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">Applicants</h3>
              {loadingApplicants ? (
                <p>⏳ Loading applicants...</p>
              ) : applicants.length === 0 ? (
                <p className="text-gray-500">No applicants found.</p>
              ) : (
                <ul className="space-y-3">
                  {applicants.map((student) => (
                    <li
                      key={student._id}
                      className="p-3 border rounded-lg shadow-sm bg-gray-50"
                    >
                      <p className="font-medium text-gray-800">
                        {student.userId?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        📧 {student.userId?.email}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-lg">
            👉 Select a job from the left to view its details.
          </p>
        )}
      </div>
    </div>
  );
};

export default HRJobDashboardStepper;
