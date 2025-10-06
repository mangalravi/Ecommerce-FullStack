import { useState } from "react";
import api from "../api/api";
import "./auth.css";

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your registered email.");
      return;
    }

    try {
      const res = await api.post("/users/request-password-change", { email });
      setSuccess("Check your email for the confirmation link.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send email.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Send Confirmation Link</button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmEmail;
