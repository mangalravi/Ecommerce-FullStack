import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchProductsData } from "../store/slices/ProductSlice";
import { fetchCartItemsData, getAllCartItems } from "../store/slices/CartSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logoutUser } from "../store/slices/UserSlice";
import api from "../api/api";
import "./Navbar.css";

const Navbar = () => {
  const cartItems = useSelector(getAllCartItems);
  // console.log("cartItems",cartItems);

  const { fullName, username, email } = useSelector(
    (state) => state.user.user || {}
  );

  const TotalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  //  console.log("TotalCartItems",TotalCartItems);
  const [toggle, setToggle] = useState(false);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProductsData());
    dispatch(fetchCartItemsData());
  }, [dispatch]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // console.log("dropdownRef", dropdownRef);

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleDropdown = () => setToggle((prev) => !prev);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      dispatch(logoutUser());
      setTimeout(() => Navigate("/login"), 1500);
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/product" style={{ textDecoration: "none", color: "#000" }}>
        <h4 className="navbar-logo">Company Logo</h4>
      </Link>
      <div className="navbar-right" ref={dropdownRef}>
        <p className="user-info" onClick={handleDropdown}>
          <AccountCircleIcon />
          {fullName}
        </p>

        <Link className="cart-link" to="/cart">
          Cart: {TotalCartItems}
        </Link>

        {toggle && (
          <div className="dropdown">
            <div>
              <AccountCircleIcon />
            </div>
            <div>
              <p>{username}</p>
              <p>{email}</p>
              <div className="dropdown-buttons">
                <button onClick={handleLogout}>Logout</button>
                <button>
                  <Link to="/change-password">Change Password</Link>
                </button>
                <button>
                  <Link to="/update-account-details">Update Account</Link>
                </button>
                <button>
                  <Link to="/order">Your Order</Link>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
