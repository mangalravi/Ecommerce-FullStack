import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Navbar from "./components/Navbar";
import { setUser } from "./store/slices/UserSlice";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const expiry = localStorage.getItem("tokenExpiry");

      if (token && expiry) {
        const now = new Date().getTime();
        if (now > parseInt(expiry)) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("tokenExpiry");

          dispatch(setUser(null));

          alert("Session expired! Please login again.");
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    };

    checkTokenExpiry();

    const interval = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return (
    <div className="App overflow-x-hidden">
      <Navbar />
      <div
        style={{
          marginTop:
            location.pathname === "/change-password"
              ? "3rem"
              : location.pathname === "/product"
              ? "0"
              : "2rem",
        }}
        className={`containerCustom mx-auto ${
          location.pathname === "/product" ? "px-0" : "px-4"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default App;
