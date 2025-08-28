import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // 👇 LocalStorage se token le lo
        const token = localStorage.getItem("token");
        console.log(token)

        const data  = await axios.get(
          "http://localhost:5000/api/job/getjobs",
          {
            headers: {
               Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Applied Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs applied yet.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.jobId} className="border p-4 rounded mb-3 shadow">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-700">
              {job.company} - {job.location}
            </p>
            <p className="text-sm">{job.description}</p>

            <div className="mt-2">
              <h4 className="font-medium">Application Progress:</h4>
              <ul className="flex gap-3 mt-1">
                {job.allStages.map((stage, idx) => (
                  <li
                    key={idx}
                    className={`px-3 py-1 rounded ${
                      stage === job.currentStage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {stage}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentDashboard;
