import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/api";
import InputField from "../components/InputFeild";
import Button from "../components/Button";
import "./auth.css";
import loginBanner from "../images/pana.svg";
import OuterTopHeader from "../components/OuterTopHeader";
import OuterBottomHeader from "../components/OuterBottomHeader";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const navigate = useNavigate();

  // ✅ Yup validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, "Full Name must be at least 2 characters")
      .required("Full Name is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setServerError("");
      setServerSuccess("");
      try {
        const response = await api.post("/users/register", values);
        setServerSuccess(response.data.data || "Signup successful!");
        resetForm();
        setTimeout(() => navigate("/login"), 1500);
      } catch (err) {
        setServerError(err.response?.data?.message || "Signup failed");
      }
    },
  });

  return (
    <>
      <OuterTopHeader />
      <div className="px-[50px] mb-[2.25rem]">
        <OuterBottomHeader />
        <div className="flex">
          {/* Left Banner */}
          <div className="w-7/12 flex items-center justify-center">
            <img
              src={loginBanner}
              alt="signup-banner"
              className="w-full h-full max-w-[360px] max-h-[380px]"
            />
          </div>

          {/* Signup Form */}
          <div className="w-5/12 flex items-center justify-center">
            <div className="auth-box shadow-md rounded-[20px] px-10 py-16 w-full max-w-[450px]">
              <h2 className="auth-title text-[#E91B1A] text-2xl mb-[2rem] font-bold text-center">
                Sign Up
              </h2>

              <form onSubmit={formik.handleSubmit}>
                {/* Full Name */}
                <div className="mb-[1rem]">
                  <InputField
                    label="Full Name"
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your full name"
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.fullName}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div className="mb-[1rem]">
                  <InputField
                    label="Username"
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Choose a username"
                  />
                  {formik.touched.username && formik.errors.username && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
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

                {/* Password */}
                <div className="relative mb-[1rem]">
                  <InputField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
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

                {/* Server Messages */}
                {serverError && (
                  <p className="text-red-500 mt-2">{serverError}</p>
                )}
                {serverSuccess && (
                  <p className="text-green-500 mt-2">{serverSuccess}</p>
                )}

                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={formik.isSubmitting}
                >
                  Sign Up
                </Button>
              </form>

              <p className="auth-footer text-center mt-4">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
