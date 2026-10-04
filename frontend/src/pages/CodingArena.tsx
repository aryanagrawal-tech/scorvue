import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/coding.css";

function CodingArena() {
  const navigate = useNavigate();

  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");

  const questions = [
    {
      title: "Count Greater Elements",
      description:
        "Count how many elements in an array are greater than a given threshold.",
      example:
        "Array: [1, 5, 8, 2]\nThreshold: 4\nOutput: 2",
    },
    {
      title: "Find Maximum Number",
      description:
        "Find the largest number from an array of integers.",
      example:
        "Array: [10, 25, 7, 18]\nOutput: 25",
    },
    {
      title: "Count Even Numbers",
      description:
        "Count how many even numbers are present in an array.",
      example:
        "Array: [1, 2, 4, 7, 9]\nOutput: 2",
    },
    {
      title: "Reverse a String",
      description:
        "Write a program to reverse a given string.",
      example:
        "Input: hello\nOutput: olleh",
    },
    {
      title: "Calculate Sum",
      description:
        "Calculate the sum of all elements in an integer array.",
      example:
        "Array: [2, 4, 6, 8]\nOutput: 20",
    },
  ];

  const question = questions[selectedQuestion];

const submitCode = async () => {
  if (code.trim() === "") {
    alert("Please write your code first.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/coding/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.title,
          code: code,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    setResult(
      `${data.message} Score: ${data.score}%`
    );

    if (data.passed) {
      localStorage.setItem(
        "codingCompleted",
        "true"
      );
    }

  } catch (error) {
    console.error("Coding submission error:", error);

    alert(
      "Unable to connect to the backend server."
    );
  }
};
  return (
    <div className="coding-page">

      <div className="coding-header">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <div>
          <p className="coding-label">
            SCORVUE
          </p>

          <h1>
            Coding Arena
          </h1>
        </div>

      </div>

      <div className="coding-container">

        <div className="question-list">

          <h3>
            Questions
          </h3>

          {questions.map((item, index) => (
            <button
              key={index}
              className={
                selectedQuestion === index
                  ? "coding-question active"
                  : "coding-question"
              }
              onClick={() => {
                setSelectedQuestion(index);
                setCode("");
                setResult("");
              }}
            >
              <span>
                {index + 1}
              </span>

              {item.title}
            </button>
          ))}

        </div>

        <div className="coding-workspace">

          <div className="problem-card">

            <p className="problem-number">
              QUESTION {selectedQuestion + 1}
            </p>

            <h2>
              {question.title}
            </h2>

            <p>
              {question.description}
            </p>

            <pre>
              {question.example}
            </pre>

          </div>

          <div className="code-card">

            <label>
              Write your code
            </label>

            <textarea
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              placeholder="// Write your solution here..."
            />

            <button
              className="submit-code-btn"
              onClick={submitCode}
            >
              Submit Code →
            </button>

            {result && (
              <div className="code-result">
                ✓ {result}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default CodingArena;