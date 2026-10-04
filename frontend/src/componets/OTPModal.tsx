import React from "react";

interface OTPModalProps {
  otp: string;
  setOtp: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  loading: boolean;
}

function OTPModal({
  otp,
  setOtp,
  onSubmit,
  onClose,
  loading,
}: OTPModalProps) {
  return (
    <div className="otp-overlay">

      <div className="otp-card">

        {/* Close Button */}
        <button
          className="otp-close"
          type="button"
          onClick={onClose}
        >
          ×
        </button>

        {/* OTP Icon */}
        <div className="otp-circle">
          ✉
        </div>

        {/* Heading */}
        <p className="otp-label">
          TWO-STEP VERIFICATION
        </p>

        <h2>
          Verify your login
        </h2>

        <p className="otp-description">
          We've sent a 6-digit verification code
          to your registered Gmail address.
        </p>

        {/* OTP Input */}
        <form onSubmit={onSubmit}>

          <input
            className="otp-input"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            autoFocus
          />

          {/* Verify Button */}
          <button
            className="login-btn"
            type="submit"
            disabled={loading || otp.length !== 6}
          >
            {loading
              ? "Verifying..."
              : "Verify & Continue"}

            {!loading && (
              <span>→</span>
            )}
          </button>

        </form>

        {/* Footer */}
        <p className="otp-footer">
          Enter the OTP sent to your Gmail
        </p>

      </div>

    </div>
  );
}

export default OTPModal;