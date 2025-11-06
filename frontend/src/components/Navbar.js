import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchProductsData } from "../store/slices/ProductSlice";
import { fetchCartItemsData, getAllCartItems } from "../store/slices/CartSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logoutUser } from "../store/slices/UserSlice";
import api from "../api/api";
import logo from "../images/ecom-logo.png";

const Navbar = () => {
  const cartItems = useSelector(getAllCartItems);
  const { fullName, username, email } = useSelector(
    (state) => state.user.user || {}
  );

  const TotalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <nav className="bg-[#fff] shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/product"
        className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
      >
        <img src={logo} alt="Logo" className=" w-[150px] inline-block mr-2" />
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        {/* Cart */}
        <Link
          to="/cart"
          className="relative text-gray-700 hover:text-indigo-600 font-medium"
        >
          Cart
          {TotalCartItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-[#73f7db] text-[#394252] text-xs font-bold rounded-full px-2">
              {TotalCartItems}
            </span>
          )}
        </Link>

        {/* User */}
        <button
          onClick={handleDropdown}
          className="flex items-center bg-transparent hover:bg-transparent gap-2 text-gray-700 text-indigo-600 font-medium focus:outline-none"
        >
          <AccountCircleIcon fontSize="medium" />
          <span>{fullName || "User"}</span>
        </button>

        {/* Dropdown */}
        {toggle && (
          <div className="absolute right-0 top-[50px] mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-100 flex gap-[1rem]">
              <AccountCircleIcon fontSize="large" />
              <div className="text-start">
                <p className="font-semibold">{username || fullName}</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>
            <div className="flex flex-col">
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-normal text-gray-700 bg-transparent hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Logout
              </button>
              <Link
                to="/change-password"
                className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Change Password
              </Link>
              <Link
                to="/update-account-details"
                className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Update Account
              </Link>
              <Link
                to="/order"
                className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Your Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
