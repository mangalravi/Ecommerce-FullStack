import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import InputField from "../components/InputFeild";
import Button from "../components/Button";
import "./auth.css";
import loginBanner from "../images/pana.svg";
import OuterTopHeader from "../components/OuterTopHeader";
import OuterBottomHeader from "../components/OuterBottomHeader";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { fullName, username, email, password } = formData;

    if (!fullName || !username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await api.post("/users/register", formData);
      setSuccess(response.data.data || "Signup successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }

    setFormData({ fullName: "", username: "", email: "", password: "" });
  };

  return (
    <>
      <OuterTopHeader />
      <div className="px-[50px] mb-[2.25rem]">
        <OuterBottomHeader />
        <div className="flex">
          <div className="w-7/12 flex items-center justify-center">
            <img
              src={loginBanner}
              alt="login-banner"
              className="w-full h-full max-w-[360px] max-h-[380px]"
            />
          </div>

          <div className="w-5/12 flex items-center justify-center">
            <div className="auth-box shadow-md rounded-[20px] px-10 py-16 w-full max-w-[450px]">
              <h2 className="auth-title text-[#E91B1A] text-2xl mb-[2rem] font-bold text-center">
                Sign Up
              </h2>

              <form onSubmit={handleSignup}>
                <InputField
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />

                <InputField
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                />

                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                <div className="relative mb-[9px]">
                  <InputField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    inpcls="relative"
                  />
                  <span
                    className="password-toggle absolute right-[1rem] top-[50%]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}{" "}
                  </span>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}

                <Button type="submit" className="w-full mt-4">
                  Sign Up
                </Button>
              </form>

              <p className="auth-footer text-center mt-4">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
