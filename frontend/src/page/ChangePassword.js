import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await api.post(`/users/reset-password/${token}`, { newPassword: formData.newPassword });
      setSuccess("✅ Password reset successful. Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to reset password");
      setSuccess("");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="reset-card">
        <h2>🔒 Reset Password</h2>
        <p className="reset-subtext">Enter and confirm your new password below</p>

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="form-group password-group">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="reset-btn">
            Reset Password
          </button>
        </form>

        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
