import { useEffect, useState } from "react";
import axios from "axios";
import CreateQuestion from "../HRCreateQuestion"; 

const BASE_URL = "http://localhost:5000/api";

const CodingTest = ({ job, onStageUpdate }) => {
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [email, setEmail] = useState("");
  const [emailDescription, setEmailDescription] = useState("");
   const [startTime, setStartTime] = useState(""); // NEW
  const [endTime, setEndTime] = useState("");     // NEW
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!job) return;
    fetchQuestions();
  }, [job]);

  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/questions/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data || []);
    } catch (err) {
      console.error("Error fetching questions:", err);
      alert("Failed to fetch questions");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAddQuestion = () => {
    setShowCreateQuestion(true);
  };

  const handleQuestionCreated = () => {
    setShowCreateQuestion(false);
    fetchQuestions();
  };

  const handleSendEmail = async () => {
    if (!email || !emailDescription) {
      alert("Please fill in email and description.");
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${BASE_URL}/job/${job._id}/send-test-email`,
        { email, description: emailDescription,startTime, 
          endTime  },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Email sent successfully!");
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Failed to send email.");
    } finally {
      setProcessing(false);
    }
  };

  const handleFinalizeTest = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${BASE_URL}/job/${job._id}/stageChange`,
        {stage: "evaluation"},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Test finalized and stage updated!");
      if (onStageUpdate) {
        onStageUpdate();
      }
    } catch (err) {
      console.error("Error finalizing test:", err);
      alert("Failed to finalize test.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Coding Test</h3>

      {/* Questions Section */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Questions</h4>
        {loadingQuestions ? (
          <p>⏳ Loading questions...</p>
        ) : questions.length === 0 ? (
          <>
            <p>No questions added yet.</p>
            <button
              onClick={handleAddQuestion}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Question
            </button>
          </>
        ) : (
          <>
            <ul className="space-y-2 mb-4 max-h-64 overflow-auto">
              {questions.map((q, index) => (
                <li key={q._id} className="p-2 border rounded bg-gray-50">
                  <p><strong>Q{index + 1}:</strong> {q.text}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add More Questions
            </button>
          </>
        )}
      </div>

      {/* Create Question Form */}
      {showCreateQuestion && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <CreateQuestion jobId={job._id} onQuestionCreated={handleQuestionCreated} />
        </div>
      )}

      {/* Send Email Section */}
      {job.testSection && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Send Test Link</h4>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Write test description"
            value={emailDescription}
            onChange={(e) => setEmailDescription(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
            <label className="block font-medium">Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 mb-2 w-full"
          />

          <label className="block font-medium">End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleSendEmail}
            disabled={processing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {processing ? "Sending..." : "Send Email"}
          </button>
        </div>
      )}

      {/* Finalize Test Button */}
      <div className="mt-6">
        <button
          onClick={handleFinalizeTest}
          disabled={processing}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {processing ? "Finalizing..." : "Finalize Test"}
        </button>
      </div>
    </div>
  );
};

export default CodingTest;
