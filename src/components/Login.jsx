import React, { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, Shield, RefreshCw } from "lucide-react";
import { loginUser } from "../utils/data";

export default function Login({ onLoginSuccess }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load remembered user
  useEffect(() => {
    const remembered = localStorage.getItem("ceo_task_remembered");
    if (remembered) {
      const parsed = JSON.parse(remembered);
      setUsernameOrEmail(parsed.usernameOrEmail);
      setPassword(parsed.password);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      const result = loginUser(usernameOrEmail, password);
      setLoading(false);

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem(
            "ceo_task_remembered",
            JSON.stringify({ usernameOrEmail, password })
          );
        } else {
          localStorage.removeItem("ceo_task_remembered");
        }
        onLoginSuccess(result.user, result.token);
      } else {
        setError(result.error);
      }
    }, 800); // Simulate API latency
  };

  const handleQuickAutofill = (role) => {
    setError("");
    if (role === "ceo") {
      setUsernameOrEmail("ceo");
      setPassword("password123");
    } else if (role === "manager") {
      setUsernameOrEmail("roshan.ops");
      setPassword("password123");
    } else if (role === "staff") {
      setUsernameOrEmail("nuwan.it");
      setPassword("password123");
    }
  };

  return (
    <div className="login-screen animate-fade">
      <div className="login-wrapper">
        <div className="glass-card login-card">
          <div className="login-header">
            <div className="brand-logo-container">
              <Shield className="brand-icon" />
              <div className="brand-text">
                DIWYA <span>SPICES</span>
              </div>
            </div>
            <p className="login-subtitle">Executive Operations Portal</p>
          </div>

          {error && (
            <div className="error-alert animate-fade">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <div className="input-with-icon">
                <Mail className="input-icon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username or email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-footer-options">
              <label className="remember-me-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Remember Me</span>
              </label>
              <a href="#forgot" className="forgot-password-link" onClick={() => alert("Please contact the corporate IT administration office to reset credentials.")}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="spinner-icon" /> Verifying Access...
                </>
              ) : (
                "Access Portal"
              )}
            </button>
          </form>

          {/* Quick Sandbox Profiles */}
          <div className="quick-access-box">
            <div className="quick-access-title">Sandbox Fast Sign-in</div>
            <div className="quick-access-buttons">
              <button
                type="button"
                className="quick-access-btn"
                onClick={() => handleQuickAutofill("ceo")}
              >
                <span>Sarah (CEO)</span>
              </button>
              <button
                type="button"
                className="quick-access-btn"
                onClick={() => handleQuickAutofill("manager")}
              >
                <span>Roshan (Manager)</span>
              </button>
              <button
                type="button"
                className="quick-access-btn"
                onClick={() => handleQuickAutofill("staff")}
              >
                <span>Nuwan (Staff)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: var(--bg-gradient);
        }

        .login-wrapper {
          width: 100%;
          max-width: 440px;
        }

        .login-card {
          padding: 40px;
          border-radius: 24px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .brand-logo-container {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .brand-icon {
          width: 32px;
          height: 32px;
          color: var(--primary);
        }

        .brand-text {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--text-primary);
        }

        .brand-text span {
          color: var(--primary);
        }

        .login-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .error-alert {
          background: var(--danger-bg);
          border: 1px solid var(--danger-border);
          color: var(--danger);
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 20px;
          text-align: center;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: var(--text-muted);
        }

        .input-with-icon .form-control {
          padding-left: 44px;
          padding-right: 44px;
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: var(--text-primary);
        }

        .form-footer-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-size: 0.85rem;
        }

        .remember-me-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }

        .remember-me-checkbox input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkbox-custom {
          height: 18px;
          width: 18px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid var(--card-border);
          border-radius: 4px;
          margin-right: 8px;
          display: inline-block;
          position: relative;
          transition: all 0.2s ease;
        }

        [data-theme='dark'] .checkbox-custom {
          background: rgba(0, 0, 0, 0.2);
        }

        .remember-me-checkbox:hover input ~ .checkbox-custom {
          border-color: var(--primary);
        }

        .remember-me-checkbox input:checked ~ .checkbox-custom {
          background: var(--primary);
          border-color: var(--primary);
        }

        .checkbox-custom::after {
          content: "";
          position: absolute;
          display: none;
          left: 6px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .remember-me-checkbox input:checked ~ .checkbox-custom::after {
          display: block;
        }

        .checkbox-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .forgot-password-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }

        .forgot-password-link:hover {
          text-decoration: underline;
        }

        .btn-block {
          width: 100%;
        }

        .spinner-icon {
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .quick-access-box {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px dashed var(--card-border);
        }

        .quick-access-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }

        .quick-access-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .quick-access-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 8px 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        [data-theme='dark'] .quick-access-btn {
          background: rgba(0, 0, 0, 0.15);
        }

        .quick-access-btn:hover {
          background: var(--primary-glow);
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
