import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OTPModal from "../componets/OTPModal";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  // =========================
  // LOGIN STATES
  // =========================

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [loading, setLoading] = useState(false);

  // =========================
  // FORGOT PASSWORD STATES
  // =========================

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [forgotStep, setForgotStep] = useState(2);

  const [forgotEmail, setForgotEmail] = useState("");

  const [forgotOtp, setForgotOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmNewPassword, setConfirmNewPassword] =
    useState("");

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
         "http://localhost:5000/api/auth/login",
        //"https://kjl9w4s4-5000.inc1.devtunnels.ms/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(
        "OTP successfully sent to your registered Gmail"
      );

      setOtp("");
      setShowOTP(true);

    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY LOGIN OTP
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
         "http://localhost:5000/api/auth/verify-login-otp",
        // "https://kjl9w4s4-5000.inc1.devtunnels.ms/api/auth/verify-login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Login successful

      localStorage.setItem(
        "scorvueLoggedIn",
        "true"
      );

      localStorage.setItem(
        "scorvueUsername",
        username
      );

      setShowOTP(false);
      setOtp("");

      alert("Login successful!");

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD
  // =========================

  const handleForgotPassword = async () => {
    // Username required
    if (!username) {
      alert("Please enter your username first");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
         "http://localhost:5000/api/auth/forgot-password",
        //"https://kjl9w4s4-5000.inc1.devtunnels.ms/api/auth/forgot-password",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Store registered email internally
      setForgotEmail(data.email);

      alert(
        "OTP successfully sent to your registered Gmail"
      );

      // Directly open OTP step
      setForgotOtp("");
      setForgotStep(2);
      setShowForgotPassword(true);

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY FORGOT PASSWORD OTP
  // =========================

  const handleForgotOTP = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (forgotOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
         "http://localhost:5000/api/auth/verify-forgot-password-otp",
        // "https://kjl9w4s4-5000.inc1.devtunnels.ms/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail,
            otp: forgotOtp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("OTP verified successfully");

      // Move to password reset step
      setForgotStep(3);

    } catch (error) {
      console.error(
        "Forgot password OTP error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================

  const handleResetPassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newPassword || !confirmNewPassword) {
      alert("Please enter both password fields");
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
         "http://localhost:5000/api/auth/reset-password",
        // "https://kjl9w4s4-5000.inc1.devtunnels.ms/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail,
            otp: forgotOtp,
            newPassword,
            confirmPassword: confirmNewPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(
        "Password reset successfully. Please login with your new password."
      );

      // Close forgot password popup
      setShowForgotPassword(false);

      // Reset forgot password states
      setForgotStep(2);
      setForgotEmail("");
      setForgotOtp("");
      setNewPassword("");
      setConfirmNewPassword("");

      // Clear old password
      setPassword("");

    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLOSE FORGOT PASSWORD
  // =========================

  const closeForgotPassword = () => {
    setShowForgotPassword(false);

    setForgotStep(2);
    setForgotEmail("");
    setForgotOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div className="auth-page">

      {/* =========================
          LEFT INFORMATION SECTION
      ========================= */}

      <div className="auth-info">

        <div className="brand">

          <div className="brand-icon">
            S
          </div>

          <span>
            SCOR
            <span className="brand-highlight">
              VUE
            </span>
          </span>

        </div>

        <div className="info-content">

          <p className="small-heading">
            WELCOME BACK
          </p>

          <h1>
            Prepare.
            <br />
            Practice.
            <br />
            <span>Perform.</span>
          </h1>

          <p className="info-text">
            Continue your career preparation
            journey with SCORVUE. Practice
            interviews, coding challenges and
            improve your resume.
          </p>

          <div className="feature-list">

            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <span>
                Practice AI Mock Interviews
              </span>

            </div>

            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <span>
                Improve Your Coding Skills
              </span>

            </div>

            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <span>
                Analyze Your Resume
              </span>

            </div>

          </div>

        </div>

        <p className="copyright">
          © 2026 SCORVUE
        </p>

      </div>

      {/* =========================
          RIGHT LOGIN SECTION
      ========================= */}

      <div className="auth-form-section">

        <div className="auth-form-card">

          {/* MOBILE LOGO */}

          <div className="mobile-brand">

            <div className="brand-icon">
              S
            </div>

            <span>
              SCOR
              <span className="brand-highlight">
                VUE
              </span>
            </span>

          </div>

          {/* HEADING */}

          <div className="form-heading">

            <p className="welcome-text">
              WELCOME BACK
            </p>

            <h2>
              Sign in to SCORVUE
            </h2>

            <p>
              Enter your credentials to continue
              your career preparation.
            </p>

          </div>

          {/* LOGIN FORM */}

          <form onSubmit={handleLogin}>

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
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>

            {/* FORGOT PASSWORD */}

            <div
              style={{
                textAlign: "right",
                marginTop: "-10px",
                marginBottom: "20px",
              }}
            >

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#6366f1",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN BUTTON */}

            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Please wait..."
                : "Login"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

          {/* DIVIDER */}

          <div className="divider">
            <span>OR</span>
          </div>

          {/* REGISTER LINK */}

          <p className="register-text">

            Don't have an account?

            <Link to="/register">
              Register
            </Link>

          </p>

        </div>

      </div>

      {/* =========================
          LOGIN OTP MODAL
      ========================= */}

      {showOTP && (
        <OTPModal
          otp={otp}
          setOtp={setOtp}
          onSubmit={handleOTP}
          onClose={() =>
            setShowOTP(false)
          }
          loading={loading}
        />
      )}

      {/* =========================
          FORGOT PASSWORD MODAL
      ========================= */}

      {showForgotPassword && (
        <div className="otp-overlay">

          <div className="otp-card">

            {/* CLOSE BUTTON */}

            <button
              className="otp-close"
              type="button"
              onClick={closeForgotPassword}
            >
              ×
            </button>

            {/* =========================
                OTP STEP
            ========================= */}

            {forgotStep === 2 && (
              <>
                <div className="otp-circle">
                  ✉
                </div>

                <p className="otp-label">
                  TWO-STEP VERIFICATION
                </p>

                <h2>
                  Verify OTP
                </h2>

                <p className="otp-description">
                  We've sent a 6-digit verification
                  code to your registered Gmail
                  address.
                </p>

                <form
                  onSubmit={handleForgotOTP}
                >

                  <input
                    className="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={forgotOtp}
                    onChange={(e) =>
                      setForgotOtp(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    autoFocus
                  />

                  <button
                    className="login-btn"
                    type="submit"
                    disabled={
                      loading ||
                      forgotOtp.length !== 6
                    }
                  >

                    {loading
                      ? "Verifying..."
                      : "Verify OTP"}

                    {!loading && (
                      <span>
                        →
                      </span>
                    )}

                  </button>

                </form>

                <p className="otp-footer">
                  Enter the OTP sent to your Gmail
                </p>

              </>
            )}

            {/* =========================
                RESET PASSWORD STEP
            ========================= */}

{forgotStep === 3 && (
  <>
    <div className="reset-icon">
      🔒
    </div>

    <div className="form-heading reset-heading">

      <p className="welcome-text">
        RESET PASSWORD
      </p>

      <h2>
        Create a new password
      </h2>

      <p>
        Enter a new password for your
        SCORVUE account.
      </p>

    </div>

    <form onSubmit={handleResetPassword}>

      {/* NEW PASSWORD */}

      <div className="input-group">

        <label>
          New Password
        </label>

        <div className="input-wrapper">

          <span className="input-icon">
            ◆
          </span>

          <input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
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
            placeholder="Confirm your new password"
            value={confirmNewPassword}
            onChange={(e) =>
              setConfirmNewPassword(
                e.target.value
              )
            }
          />

        </div>

      </div>


      {/* RESET BUTTON */}

      <button
        className="login-btn"
        type="submit"
        disabled={loading}
      >

        {loading
          ? "Resetting..."
          : "Reset Password"}

        {!loading && (
          <span>
            →
          </span>
        )}

      </button>

    </form>


    {/* BACK TO LOGIN */}

    <button
      type="button"
      className="back-login-btn"
      onClick={closeForgotPassword}
    >
      ← Back to Login
    </button>

  </>
)}
          </div>

        </div>
      )}

    </div>
  );
}

export default Login;