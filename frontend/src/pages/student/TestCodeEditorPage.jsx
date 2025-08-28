import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react"; // LeetCode style editor

const API = "http://localhost:5000/api";

const TextCodeEditorPage = () => {
  const { jobId, studentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${API}/questions/${jobId}`);
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [jobId]);

  const handleChange = (qId, code) => {
    setAnswers((prev) => ({ ...prev, [qId]: code }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API}/submissions`, {
        studentId,
        jobId,
        submissions: Object.keys(answers).map((qId) => ({
          questionId: qId,
          code: answers[qId],
        })),
      });
      alert("✅ Test submitted successfully!");
      console.log("Submission result:", res.data);
    } catch (err) {
      console.error("Error submitting test:", err);
    }
  };

  if (loading) return <p className="p-6">Loading questions...</p>;
  if (questions.length === 0) return <p className="p-6">No questions found.</p>;

  const currentQ = questions[currentIndex];

  return (
    <div className="flex h-screen">
      {/* LEFT PANEL - Question */}
      <div className="w-1/2 border-r overflow-y-auto p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">{currentQ.title}</h1>
        <p className="whitespace-pre-line text-gray-800 mb-6">
          {currentQ.description}
        </p>

        {currentQ.testCases && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Examples:</h2>
            {currentQ.testCases.map((tc, idx) => (
              <div
                key={idx}
                className="bg-gray-100 p-2 rounded mb-2 text-sm font-mono"
              >
                <p>
                  <strong>Input:</strong> {tc.input}
                </p>
                <p>
                  <strong>Output:</strong> {tc.output}
                </p>
              </div>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-500">Marks: {currentQ.marks}</p>
      </div>

      {/* RIGHT PANEL - Monaco Editor */}
      <div className="w-1/2 flex flex-col">
        <div className="flex-1 p-4">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={answers[currentQ._id] || currentQ.starterCode || ""}
            onChange={(val) => handleChange(currentQ._id, val)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
          />
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between p-4 border-t bg-gray-100">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className={`px-4 py-2 rounded ${
              currentIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextCodeEditorPage;
