import { useState } from "react";
import api from "../api/api";
import "./auth.css";
import Button from "../components/Button";
import InputField from "../components/InputFeild";

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
          <InputField
            type="email"
            placeholder="Enter your registered email"
            value={email}
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success mb-2 mt-0 text-center fw-semibold text-[28a745]">{success}</p>}

          <Button type="submit">Send Confirmation Link</Button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmEmail;
