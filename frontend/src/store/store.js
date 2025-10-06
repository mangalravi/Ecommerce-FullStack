import { ProductReducer } from "./slices/ProductSlice";
import { CartReducer } from "./slices/CartSlice";
import { WishListReducer } from "./slices/WishListSlice";
import { configureStore } from "@reduxjs/toolkit";
import { func } from "./middleware/func";
import { userReducer } from "./slices/UserSlice";

const store = configureStore({
  reducer: {
    Products: ProductReducer,
    cartItems: CartReducer,
    user: userReducer,
    wishListItems: WishListReducer,
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), func],
});

export default store;
