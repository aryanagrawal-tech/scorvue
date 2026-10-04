import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // REGISTER
  // =========================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      alert("Please use a valid Gmail address");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://scorvue.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // OTP successfully sent
      alert("OTP successfully sent to your Gmail");

      setShowOTP(true);
      setOtp("");

    } catch (error) {
      console.error("Register error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://scorvue.onrender.com/api/auth/verify-register-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Only correct OTP reaches here
      alert("Registration successful!");

      setShowOTP(false);
      setOtp("");

      navigate("/login");

    } catch (error) {
      console.error("OTP verification error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SECTION */}
      <div className="auth-info">

        <div className="brand">
          <div className="brand-icon">S</div>

          <span>
            SCOR<span className="brand-highlight">VUE</span>
          </span>
        </div>

        <div className="info-content">

          <p className="small-heading">
            START YOUR JOURNEY
          </p>

          <h1>
            Build.
            <br />
            Improve.
            <br />
            <span>Succeed.</span>
          </h1>

          <p className="info-text">
            Create your SCORVUE account and start preparing
            for your interviews, coding challenges and career.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Practice AI Mock Interviews</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Improve Your Coding Skills</span>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Analyze Your Resume</span>
            </div>

          </div>

        </div>

        <p className="copyright">
          © 2026 SCORVUE
        </p>

      </div>

      {/* RIGHT SECTION */}
      <div className="auth-form-section">

        <div className="auth-form-card">

          {/* MOBILE LOGO */}
          <div className="mobile-brand">

            <div className="brand-icon">
              S
            </div>

            <span>
              SCOR<span className="brand-highlight">VUE</span>
            </span>

          </div>

          {/* HEADING */}
          <div className="form-heading">

            <p className="welcome-text">
              CREATE ACCOUNT
            </p>

            <h2>
              Join SCORVUE
            </h2>

            <p>
              Create your account and begin your career preparation.
            </p>

          </div>

          {/* REGISTER FORM */}
          <form onSubmit={handleRegister}>

            {/* USERNAME */}
            <div className="input-group">

              <label>
                Username
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ◉
                </span>

                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                />

              </div>

            </div>

            {/* EMAIL */}
            <div className="input-group">

              <label>
                Gmail Address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ◆
                </span>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">

              <label>
                Confirm Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ◆
                </span>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

              </div>

            </div>

            {/* BUTTON */}
            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Create Account"}
              {!loading && <span>→</span>}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* LOGIN LINK */}
          <p className="register-text">

            Already have an account?

            <Link to="/login">
              {" "}Login
            </Link>

          </p>

        </div>

      </div>

      {/* OTP MODAL */}
      {showOTP && (

        <div className="otp-overlay">

          <div className="otp-card">

            <button
              className="otp-close"
              onClick={() => setShowOTP(false)}
            >
              ×
            </button>

            <div className="otp-circle">
              ✉
            </div>

            <p className="otp-label">
              EMAIL VERIFICATION
            </p>

            <h2>
              Verify your email
            </h2>

            <p className="otp-description">
              We've sent a 6-digit verification code to:
            </p>

            <p
              style={{
                color: "#7180ff",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "20px"
              }}
            >
              {email}
            </p>

            <form onSubmit={handleOTP}>

              <input
                className="otp-input"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />

              <button
                className="login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
                {!loading && <span>→</span>}
              </button>

            </form>

            <p className="otp-footer">

              Didn't receive the code?

              <button type="button">
                Resend OTP
              </button>

            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default Register;