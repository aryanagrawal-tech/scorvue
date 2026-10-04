import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mock-interview.css";

function MockInterview() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [started, setStarted] = useState(false);

  const [result, setResult] = useState<{
    score: number;
    feedback: string;
  } | null>(null);

  const [answers, setAnswers] = useState<string[]>(["", "", "", "", ""]);

  const questions = [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Explain Object-Oriented Programming.",
    "Why should we hire you?",
    "Where do you see yourself in the next five years?",
  ];

  const startInterview = () => {
    if (!category) {
      alert("Please select an interview category");
      return;
    }

    setStarted(true);
  };

  const updateAnswer = (index: number, value: string) => {
    const updatedAnswers = [...answers];

    updatedAnswers[index] = value;

    setAnswers(updatedAnswers);
  };
  const submitInterview = async () => {
    const unanswered = answers.some((answer) => answer.trim() === "");

    if (unanswered) {
      alert("Please answer all 5 questions");
      return;
    }

    try {
      const response = await fetch(
        "https://scorvue.onrender.com/api/interview/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category,
            questions,
            answers,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      console.log("Interview Result:", data);

      alert(
        `Interview completed!\n\nScore: ${data.score}%\n\n${data.feedback}`,
      );

      setResult({
        score: data.score,
        feedback: data.feedback,
      });

      localStorage.setItem("mockInterviewCompleted", "true");
    } catch (error) {
      console.error("Interview submission error:", error);

      alert("Unable to connect to the backend server.");
    }
  };
  return (
    <div className="interview-page">
      {/* HEADER */}

      <div className="interview-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>

        <div>
          <p className="interview-label">SCORVUE</p>

          <h1>AI Mock Interview</h1>
        </div>
      </div>

      {/* CATEGORY */}
      {result && (
        <div className="result-card">
          <div className="result-icon">✓</div>

          <p className="result-label">INTERVIEW COMPLETED</p>

          <h2>Your Interview Result</h2>

          <div className="score-circle">{result.score}%</div>

          <h3>Feedback</h3>

          <p className="result-feedback">{result.feedback}</p>

          <button
            className="start-interview-btn"
            onClick={() => {
              setResult(null);
              setStarted(false);
              setAnswers(["", "", "", "", ""]);
            }}
          >
            Practice Again
            <span>→</span>
          </button>
        </div>
      )}

      {!started && (
        <div className="interview-card">
          <div className="interview-icon">🤖</div>

          <h2>Practice Your Interview</h2>

          <p>
            Select an interview category and answer 5 questions to practice your
            interview skills.
          </p>

          <div className="category-section">
            <label>Interview Category</label>

            <div className="category-grid">
              <button
                className={
                  category === "Technical" ? "category active" : "category"
                }
                onClick={() => setCategory("Technical")}
              >
                <span>💻</span>
                <strong>Technical</strong>
                <small>Programming & IT</small>
              </button>

              <button
                className={category === "HR" ? "category active" : "category"}
                onClick={() => setCategory("HR")}
              >
                <span>👥</span>
                <strong>HR</strong>
                <small>Behavioral questions</small>
              </button>

              <button
                className={
                  category === "General" ? "category active" : "category"
                }
                onClick={() => setCategory("General")}
              >
                <span>🎯</span>
                <strong>General</strong>
                <small>Mixed questions</small>
              </button>
            </div>
          </div>

          <button className="start-interview-btn" onClick={startInterview}>
            Start Interview
            <span>→</span>
          </button>
        </div>
      )}

      {/* QUESTIONS */}

      {started && (
        <div className="questions-container">
          <div className="interview-info">
            <div>
              <span>Category</span>

              <strong>{category}</strong>
            </div>

            <div>
              <span>Questions</span>

              <strong>5</strong>
            </div>
          </div>

          {questions.map((question, index) => (
            <div className="question-card" key={index}>
              <div className="question-number">{index + 1}</div>

              <div className="question-content">
                <h3>{question}</h3>

                <textarea
                  placeholder="Write your answer here..."
                  value={answers[index]}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                />
              </div>
            </div>
          ))}

          <button className="submit-interview-btn" onClick={submitInterview}>
            Submit Interview
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default MockInterview;
