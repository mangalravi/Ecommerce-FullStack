import ReactDOM from "react-dom/client";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CartUI from "./store/CartUI";
import WishListUI from "./store/WishListUI";
import AllProducts from "./store/AllProducts";
import store from "./store/store";
import Home from "./page/Home";
import HomeDetailPage from "./HomeDetailPage";
import Login from "./page/Login";
import Signup from "./page/Signup";
import { loadUserFromStorage } from "./store/slices/UserSlice";
import ChangePassword from "./page/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ConfirmEmail from "./page/ConfirmEmail";
import Checkout from "./page/Checkout";
import UpdateAccount from "./page/UpdateAccount";
import UserProfile from "./page/UserProfile";
import Success from "./page/Success";
import ProductDetail from "./store/slices/ProductDetail";
import Order from "./page/Order";

store.dispatch(loadUserFromStorage());

const root = ReactDOM.createRoot(document.getElementById("root"));
const userStr = localStorage.getItem("user");
let user = null;

try {
  user = userStr ? JSON.parse(userStr) : null;
} catch (err) {
  console.error("Failed to parse user from localStorage", err);
  user = null;
}

// Check for _id or user_id
const isUserValid = user && user._id;

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route index path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
        <Route path="/change-password/:token" element={<ChangePassword />} />

        {isUserValid === undefined && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<App />}>
            <Route path="/product" element={<AllProducts />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/home/:id" element={<HomeDetailPage />} />
            <Route path="/cart" element={<CartUI />} />
            <Route path="/wishlist" element={<WishListUI />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order" element={<Order />} />
            <Route path="/success-page" element={<Success />} />
            <Route path="/update-account-details" element={<UpdateAccount />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
