import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/slices/UserSlice";
import "./UserProfile.css";
import api from "../api/api";
import Button from "../components/Button";

const UserProfile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      dispatch(logoutUser());
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User Avatar"
          />
          <button className="edit-btn" title="Edit Profile">
            ✎
          </button>
        </div>
        <h2 className="profile-name">{user?.fullName}</h2>
        <p className="profile-role" style={{ marginTop: 0 }}>
          <b>User ID : </b> {user?._id}
        </p>
        <div className="divider"></div>
        <div className="profile-info">
          <p>
            <span className="icon">📧</span> {user?.email}
          </p>
          {user?.phone && (
            <p>
              <span className="icon">📱</span> {user.phone}
            </p>
          )}
          <p>
            <span className="icon">👤</span> {user?.username}
          </p>
        </div>

        <div className="profile-actions">
          <Button onClick={() => navigate("/product")} className="purpulebtn">
            Go To Product Page
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
