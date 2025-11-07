import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserData } from "../store/slices/ProductSlice";
import api from "../api/api";
import "./UpdateAccount.css";
import { useNavigate } from "react-router-dom";
import { updateAccountDetail } from "../store/slices/UserSlice";
import InputField from "../components/InputFeild";
import Button from "../components/Button";

const UpdateAccount = () => {
  const user = useSelector(getCurrentUserData);
  const dispatch = useDispatch();
  // console.log("user from update", user);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    phoneNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const phnnumberArray = user.phoneNumber?.split("").splice(0, 3);
  const phnnumber = phnnumberArray?.join("");
  let newPhoneNumber = user.phoneNumber;

  if (phnnumber === "+91") {
    newPhoneNumber = user.phoneNumber.slice(3);
  }
  const Navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        _id: user._id,
        fullName: user.fullName || "",
        email: user.email || "",
        username: user.username || "",
        phoneNumber: newPhoneNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.username) {
      setError("Full Name and Email are required");
      setSuccess("");
      return;
    }

    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Enter a valid 10-digit phone number");
      setSuccess("");
      return;
    }

    try {
      const res = await api.patch(
        `/users/update-account/${user._id}`,
        formData
      );
      // console.log("res", res.data.message);

      if (res.status === 200) {
        setSuccess("Account updated successfully");

        dispatch(updateAccountDetail(res.data.message));
        localStorage.setItem("user", JSON.stringify(res.data.message));

        setError("");
        setTimeout(() => {
          Navigate("/profile");
        }, 1500);
      } else {
        setError("Failed to update account");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center mt-[30px] h-[calc(100vh_-_4.5rem)]">
      <div className="update-account-card">
        <h2 className="text-[1.25rem] font-[600]">Update Account Details</h2>
        <form onSubmit={handleSubmit} className="update-form">
          <InputField
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            label=" Full Name"
          />
          <InputField
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            label="Email"
          />

          <InputField
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your User Name"
            required
            label="User Name"
          />
          {user.phoneNumber !== undefined && (
            <InputField
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              label="Phone Number"
            />
          )}

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <Button type="submit" className="purpulebtn">
            Update Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccount;
