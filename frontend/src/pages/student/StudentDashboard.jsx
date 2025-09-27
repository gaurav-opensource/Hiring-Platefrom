import  { useEffect, useState } from "react";
import axios from "axios";
import Loader from '../../ui/Loader' 
import API from "../../apiConfig";

const stages = ['resume', 'test', 'interview', 'final', 'rejected'];

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${API}/job/my-applications-stages`,
          {
            headers: {
              Authorization: `Bearer ${token}` 
            }
          }
        );
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
      <div className="text-center mt-10 pt-20">
        No applications found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 pt-28">
      <h1 className="text-2xl font-bold mb-6 text-center">My Application Stages</h1>

      {applications.map((app) => (
        <div key={app._id} className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold">{app.jobTitle}</h2>
          <p className="text-gray-600 mb-4">{app.company}</p>

          <div className="flex justify-between items-center">
            {stages.map((stage, index) => {
              let status = 'pending';
              if (stages.indexOf(app.currentStage) > index) status = 'completed';
              else if (stages.indexOf(app.currentStage) === index) status = 'current';

              return (
                <div key={stage} className="text-center w-1/5">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-1 ${
                      status === 'completed'
                        ? 'bg-green-500'
                        : status === 'current'
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    } text-white font-bold`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm capitalize">{stage}</p>
                  <p className="text-xs text-gray-500">
                    {status === 'completed'
                      ? 'Completed'
                      : status === 'current'
                      ? 'In Progress'
                      : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboard;
