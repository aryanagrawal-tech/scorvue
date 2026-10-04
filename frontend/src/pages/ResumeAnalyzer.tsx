import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/resume.css";

function ResumeAnalyzer() {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    score: number;
    suggestions: string[];
  } | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const analyzeResume = () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    const fileName = file.name.toLowerCase();

    const keywords = [
      "python",
      "java",
      "sql",
      "react",
      "javascript",
      "git",
    ];

    const foundKeywords = keywords.filter((keyword) =>
      fileName.includes(keyword)
    );

    const score = Math.min(
      100,
      40 + foundKeywords.length * 10
    );

    const suggestions = [
      "Add relevant technical skills.",
      "Include your academic or personal projects.",
      "Add GitHub and LinkedIn links.",
      "Use clear and concise project descriptions.",
    ];

    setResult({
      score,
      suggestions,
    });

    localStorage.setItem(
      "resumeCompleted",
      "true"
    );
  };

  return (
    <div className="resume-page">

      <div className="resume-header">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <div>
          <p className="resume-label">
            SCORVUE
          </p>

          <h1>
            Resume Analyzer
          </h1>
        </div>

      </div>

      <div className="resume-card">

        <div className="resume-icon">
          📄
        </div>

        <h2>
          Analyze Your Resume
        </h2>

        <p>
          Upload your resume in PDF format to
          receive a simple score and suggestions.
        </p>

        <label className="upload-box">

          <span>
            📤
          </span>

          <strong>
            {file
              ? file.name
              : "Choose your resume"}
          </strong>

          <small>
            PDF files only
          </small>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />

        </label>

        <button
          className="analyze-btn"
          onClick={analyzeResume}
        >
          Analyze Resume →
        </button>

      </div>

      {result && (
        <div className="resume-result">

          <p className="result-label">
            ANALYSIS COMPLETED
          </p>

          <h2>
            Resume Score
          </h2>

          <div className="resume-score">
            {result.score}%
          </div>

          <h3>
            Suggestions
          </h3>

          <ul>
            {result.suggestions.map(
              (suggestion, index) => (
                <li key={index}>
                  {suggestion}
                </li>
              )
            )}
          </ul>

        </div>
      )}

    </div>
  );
}

export default ResumeAnalyzer;