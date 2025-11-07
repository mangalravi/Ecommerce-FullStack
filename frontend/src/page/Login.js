import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/api";
import { setUser } from "../store/slices/UserSlice";
import loginBanner from "../images/pana.svg";
import InputField from "../components/InputFeild";
import Button from "../components/Button";
import OuterTopHeader from "../components/OuterTopHeader";
import OuterBottomHeader from "../components/OuterBottomHeader";
import "./auth.css";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/product";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  // ✅ Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setServerError("");
      try {
        const response = await api.post("/users/login", values);
        const token = response.data.message.accessToken;
        const user = response.data.message.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        const expiryTime = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem("tokenExpiry", expiryTime);

        dispatch(setUser(user));
        navigate(from, { replace: true });
      } catch (err) {
        setServerError(err.response?.data?.message || "Login failed");
      }
    },
  });

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

              <form onSubmit={formik.handleSubmit}>
                {/* Email Field */}
                <div className="mb-[1rem]">
                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative mb-[1rem]">
                  <InputField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                    inpcls="mb-0"
                  />
                  <span
                    className="password-toggle absolute right-[1rem] top-[50%]"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* Server Error */}
                {serverError && (
                  <p className="text-red-500 text-sm">{serverError}</p>
                )}

                <p className="text-end mb-[3rem] underline text-[#585858] text-[0.75rem]">
                  <Link to="/confirm-email">Forget Password</Link>
                </p>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="mb-[2.5rem] w-[73%]"
                    disabled={formik.isSubmitting}
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
