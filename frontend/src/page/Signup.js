import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "./auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toggle, setToggle] = useState("show");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password } = formData;
    if (!fullName || !username || !email || !password) {
      setError("All Feilds Are Required !!!");
      return;
    }
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/users/register", formData);
      console.log(response);
      setSuccess(response.data.data);

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
    setFormData({ fullName: "", username: "", email: "", password: "" });
  };
  const handleToggle = () => {
    setToggle((prev) => !prev);
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              value={formData.fullName}
              name="fullName"
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type={toggle ? "password" : "text"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <span onClick={handleToggle}>{toggle ? "show" : "hide"}</span>
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
