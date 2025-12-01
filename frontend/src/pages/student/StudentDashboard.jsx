import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../ui/Loader";
import API from "../../apiConfig";

const stages = ["resume", "test", "interview", "final", "rejected"];

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${API}/job/my-applications-stages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
    const interval = setInterval(fetchApplications, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center mt-20 text-lg text-gray-600">
        No applications found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7faff] via-[#edf1ff] to-[#e8edff] px-6 py-24">

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">My Application Progress</h1>
        <p className="text-gray-600 mt-2">
          Track your application status across companies.
        </p>
      </div>

      {/* Applications List */}
      <div className="max-w-5xl mx-auto space-y-10">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition"
          >
            {/* Job Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {app.jobTitle}
              </h2>
              <p className="text-gray-600 text-sm">{app.company}</p>
            </div>

            {/* Progress Timeline */}
            <div className="flex justify-between items-center relative pt-6">

              {/* Horizontal Line */}
              <div className="absolute top-8 left-0 right-0 h-[3px] bg-gray-200"></div>

              {stages.map((stage, index) => {
                let status = "pending";
                if (stages.indexOf(app.currentStage) > index) status = "completed";
                else if (stages.indexOf(app.currentStage) === index)
                  status = "current";

                const colors = {
                  completed: "bg-green-500 text-white",
                  current: "bg-blue-600 text-white animate-pulse",
                  pending: "bg-gray-300 text-gray-600",
                  rejected: "bg-red-500 text-white",
                };

                return (
                  <div key={stage} className="flex flex-col items-center w-full z-10">
                    {/* Circle */}
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-md shadow-md ${colors[status]}`}
                    >
                      {index + 1}
                    </div>

                    {/* Label */}
                    <p className="mt-2 text-sm capitalize text-gray-700">
                      {stage}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-gray-500">
                      {status === "completed"
                        ? "Completed"
                        : status === "current"
                        ? "In Progress"
                        : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
