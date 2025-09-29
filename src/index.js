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
import Home from "./Home";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<CartUI />} />
        <Route path="/product" element={<AllProducts />} />
        <Route path="/wishlist" element={<WishListUI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
