import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/api";
import "./auth.css";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/UserSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/product";
  console.log("location", location?.state?.from?.pathname);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/users/login", { email, password });
      console.log("response", response);
      const token = response.data.message.accessToken;
      const user = response.data.message.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      const expiryTime = new Date().getTime() + 60 * 60 * 1000;
      localStorage.setItem("tokenExpiry", expiryTime);
      dispatch(setUser(response.data.message.user));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group password-group">
            <label>Password:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}{" "}
              </span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p className="auth-footer">
          <Link to="/confirm-email">Forget Password</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
