import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

store.dispatch(loadUserFromStorage());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
        <Route path="/change-password/:token" element={<ChangePassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<App />}>
            <Route path="/home" element={<Home />} />
            <Route path="/home/:id" element={<HomeDetailPage />} />
            <Route path="/cart" element={<CartUI />} />
            <Route path="/product" element={<AllProducts />} />
            <Route path="/wishlist" element={<WishListUI />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
