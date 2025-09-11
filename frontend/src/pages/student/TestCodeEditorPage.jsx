import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react"; // make sure you installed monaco-editor

// Backend + Judge0 API
const API = "http://localhost:5000/api";
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = "1b7e563300msh3a6a8fa89c5812bp17fcd1jsn302890a8dc8a";
const JUDGE0_HOST = "judge0-ce.p.rapidapi.com";

// Language options
const languages = [
  {
    name: "JavaScript",
    id: 63,
    editorLanguage: "javascript",
    starterCode:
      "// JavaScript\nfunction solve(input) {\n  // Write your code here\n}",
  },
  {
    name: "Python 3",
    id: 71,
    editorLanguage: "python",
    starterCode: "# Python 3\n# Write your code here\n",
  },
  {
    name: "Java",
    id: 62,
    editorLanguage: "java",
    starterCode:
      "public class Main {\n  public static void main(String[] args) {\n    // Write your code here\n  }\n}",
  },
  {
    name: "C++",
    id: 54,
    editorLanguage: "cpp",
    starterCode:
      "#include <iostream>\nusing namespace std;\nint main() {\n  // Write your code here\n  return 0;\n}",
  },
  {
    name: "C",
    id: 50,
    editorLanguage: "c",
    starterCode:
      "#include <stdio.h>\nint main() {\n  // Write your code here\n  return 0;\n}",
  },
];

const TextCodeEditorPage = () => {
  const { jobId, userId } = useParams();
  console.log(userId)


  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [testResults, setTestResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // ✅ Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${API}/questions/${jobId}`);
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setQuestions(data.map((q) => ({ ...q, testCases: q.testCases || [] })));
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [jobId]);

  // ✅ Set starter code for currentQ if not answered yet
  useEffect(() => {
    if (questions.length > 0) {
      const currentQId = questions[currentIndex]._id;
      if (!answers[currentQId]) {
        setAnswers((prev) => ({
          ...prev,
          [currentQId]: selectedLanguage.starterCode,
        }));
      }
    }
  }, [currentIndex, questions, selectedLanguage, answers]);

  const handleChange = (qId, code) => {
    setAnswers((prev) => ({ ...prev, [qId]: code }));
  };

  // ✅ Run Code
  const handleRunCode = async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ || !currentQ.testCases || currentQ.testCases.length === 0) {
      alert("No test cases available for this question.");
      return;
    }

    const userCode = answers[currentQ._id] || selectedLanguage.starterCode;
    setTestResults(null);
    setIsExecuting(true);

    try {
      const results = [];
      for (const testCase of currentQ.testCases) {
        const payload = {
          source_code: userCode,
          language_id: selectedLanguage.id,
          stdin: testCase.input,
        };

        const response = await axios.post(
          `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "x-rapidapi-key": JUDGE0_KEY,
              "x-rapidapi-host": JUDGE0_HOST,
            },
          }
        );

        const resData = response.data;
        const status = resData.status.description;
        const actual =
          resData.stdout?.trim() ||
          resData.stderr ||
          resData.compile_output ||
          "";
        const expected = (testCase.output || "").trim();

        results.push({
          passed: status === "Accepted" && actual === expected,
          status,
          expectedOutput: expected,
          actualOutput: actual,
          time: resData.time,
          memory: resData.memory,
          compileError: resData.compile_output,
        });
      }
      setTestResults(results);
    } catch (err) {
      console.error("Error running code with Judge0:", err);
      setTestResults([
        {
          passed: false,
          status: "Error",
          expectedOutput: "N/A",
          actualOutput: "Failed to run code. Check API key or network.",
        },
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  // ✅ Save code per question
  const handleSave = async (qId) => {
    try {
      await axios.post(`${API}/job/save`, {
        userId,
        jobId,
        questionId: qId,
        code: answers[qId],
        language: selectedLanguage.name,
      });
    } catch (err) {
      console.error("Error saving code:", err);
    }
  };

  // ✅ Final Submit
  const handleSubmit = async () => {
    try {
      const currentQ = questions[currentIndex];
      await handleSave(currentQ._id); // save last Q also
      await axios.post(`${API}/job/submit`, { userId, jobId });
      alert("✅ Test submitted successfully!");
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("❌ Error submitting test");
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

        {currentQ.testCases.length > 0 ? (
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
        ) : (
          <p>No test cases available.</p>
        )}
        <p className="text-sm text-gray-500">Marks: {currentQ.marks}</p>
      </div>

      {/* RIGHT PANEL - Monaco Editor */}
      <div className="w-1/2 flex flex-col">
        {/* Language Selector */}
        <div className="p-4 border-b bg-gray-100 flex items-center">
          <label htmlFor="language-select" className="mr-2 font-medium">
            Language:
          </label>
          <select
            id="language-select"
            value={selectedLanguage.name}
            onChange={(e) => {
              const lang = languages.find((l) => l.name === e.target.value);
              setSelectedLanguage(lang);
              setAnswers((prev) => ({
                ...prev,
                [currentQ._id]: lang.starterCode,
              }));
            }}
            className="p-2 border rounded"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-4">
          <Editor
            height="100%"
            language={selectedLanguage.editorLanguage}
            value={answers[currentQ._id] || selectedLanguage.starterCode}
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

        {/* Test Results */}
        {testResults && (
          <div className="p-4 border-t bg-gray-200 overflow-y-auto max-h-48">
            <h3 className="font-bold mb-2">Test Results:</h3>
            <ul className="list-none p-0 m-0">
              {testResults.map((result, index) => (
                <li
                  key={index}
                  className={`p-2 rounded mb-2 ${
                    result.passed ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <p className="font-mono text-sm">
                    Test Case {index + 1}:{" "}
                    {result.passed
                      ? "✅ Passed"
                      : `❌ Failed (${result.status})`}
                  </p>
                  <p className="text-xs text-gray-700">
                    Time: {result.time}s, Memory: {result.memory} KB
                  </p>
                  {result.compileError && (
                    <pre className="mt-2 p-2 bg-red-200 text-red-800 rounded whitespace-pre-wrap text-xs">
                      {result.compileError}
                    </pre>
                  )}
                  {!result.passed && !result.compileError && (
                    <div className="text-xs text-red-800 mt-1">
                      <p>Expected: {result.expectedOutput}</p>
                      <p>Your Output: {result.actualOutput}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between p-4 border-t bg-gray-100">
          <button
            disabled={currentIndex === 0 || isExecuting}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className={`px-4 py-2 rounded ${
              currentIndex === 0 || isExecuting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className={`px-4 py-2 rounded ${
                isExecuting
                  ? "bg-yellow-300"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
            >
              {isExecuting ? "Executing..." : "Run Code"}
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={async () => {
                  const currentQ = questions[currentIndex];
                  await handleSave(currentQ._id); // 🔹 save before next
                  setCurrentIndex((prev) => prev + 1);
                  setTestResults(null);
                }}
                disabled={isExecuting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isExecuting}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCodeEditorPage;
