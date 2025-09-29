import { ProductReducer } from "./slices/ProductSlice";
import { CartReducer } from "./slices/CartSlice";
import { WishListReducer } from "./slices/WishListSlice";
import { configureStore } from "@reduxjs/toolkit";
// import { apiMiddleware } from "./middleware/api";
import { func } from "./middleware/func";

const store = configureStore({
  reducer: {
    Products: ProductReducer,
    cartItems: CartReducer,
    wishListItems: WishListReducer,
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), func],
});

export default store;
