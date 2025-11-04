import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/api";
import "./auth.css";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/UserSlice";
import loginBanner from "../images/pana.svg";
import InputField from "../components/InputFeild";
import Button from "../components/Button";
import OuterTopHeader from "../components/OuterTopHeader";
import OuterBottomHeader from "../components/OuterBottomHeader";

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
            <div className="auth-box shadow-md rounded-[1.25rem] px-[2.5rem] py-[62px] w-full max-w-[450px] ">
              <h2 className="auth-title text-[#E91B1A] text-[1.5rem] mb-[77px] font-bold text-center">
                Log in
              </h2>
              <form onSubmit={handleLogin}>
                <InputField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <div className="relative mb-[9px]">
                  <InputField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    inpcls="mb-0"
                  />
                  <span
                    className="password-toggle absolute right-[1rem] top-[50%]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}{" "}
                  </span>
                </div>

                {error && <p className="error">{error}</p>}
                <p className="text-end mb-[3rem] underline text-[#585858] text-[0.75rem]">
                  <Link to="/confirm-email">Forget Password</Link>
                </p>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    onClick={handleLogin}
                    className="mb-[2.5rem] w-[73%]"
                  >
                    Continue
                  </Button>
                </div>
              </form>

              <p className="text-center text-[#4F4F4F] text-[0.875rem] mb-[1.25rem] font-normal">
                Don’t have an account?
                <Link to="/signup" className="font-medium underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
