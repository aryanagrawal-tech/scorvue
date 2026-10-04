import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const username = localStorage.getItem("scorvueUsername") || "Student";

  const mockInterviewCompleted =
  localStorage.getItem("mockInterviewCompleted") === "true";

const codingCompleted =
  localStorage.getItem("codingCompleted") === "true";

const resumeCompleted =
  localStorage.getItem("resumeCompleted") === "true";

let completedModules = 0;

if (mockInterviewCompleted) {
  completedModules++;
}

if (codingCompleted) {
  completedModules++;
}

if (resumeCompleted) {
  completedModules++;
}

const progress = Math.round(
  (completedModules / 3) * 100
);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("scorvueLoggedIn");

    localStorage.removeItem("scorvueUsername");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          SCOR<span>VUE</span>
        </div>

        <div className="navbar-right">
          <span className="welcome-user">👤 {username}</span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-container">
        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="welcome-section">
          <p className="small-heading">STUDENT DASHBOARD</p>

          <h1>Welcome back, {username}! 👋</h1>

          <p>
            Prepare for your career with SCORVUE. Practice interviews, coding
            and improve your resume.
          </p>
        </section>

        {/* =================================================
            PROFILE + PROGRESS
        ================================================= */}

        <section className="top-cards">
          {/* PROFILE */}

          <div className="profile-card">
            <div className="profile-icon">👤</div>

            <div className="profile-info">
              <h2>{username}</h2>

              <p>Student</p>

              <span className="status">● Active</span>
            </div>
          </div>

          {/* PROGRESS */}

          <div className="progress-card">
            <div className="progress-header">
              <div>
                <p>Overall Progress</p>

                <h2>{progress}%</h2>
              </div>

              <span className="progress-icon">📊</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="progress-text">
              {progress === 0
                ? "Start practicing to improve your progress."
                : `${completedModules} of 3 modules completed.`}
            </p>
          </div>
        </section>

        {/* =================================================
            FEATURES
        ================================================= */}

        <section className="features-section">
          <div className="section-heading">
            <p className="small-heading">CAREER PREPARATION</p>

            <h2>Choose your practice</h2>
          </div>

          <div className="feature-grid">
            {/* =================================================
                AI MOCK INTERVIEW
            ================================================= */}

            <div
              className="feature-card"
              onClick={() => navigate("/mock-interview")}
            >
              <div className="feature-icon">🎤</div>

              <h3>AI Mock Interview</h3>

              <p>
                Practice interview questions and receive basic AI-powered
                feedback.
              </p>

              <button>Start Interview →</button>
            </div>

            {/* =================================================
                CODING ARENA
            ================================================= */}

            <div className="feature-card" onClick={() => navigate("/coding")}>
              <div className="feature-icon">💻</div>

              <h3>Coding Arena</h3>

              <p>Solve coding problems and test your programming skills.</p>

              <button>Start Coding →</button>
            </div>

            {/* =================================================
                RESUME ANALYZER
            ================================================= */}

            <div className="feature-card" onClick={() => navigate("/resume")}>
              <div className="feature-icon">📄</div>

              <h3>Resume Analyzer</h3>

              <p>Upload your resume and get a simple score with suggestions.</p>

              <button>Analyze Resume →</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
