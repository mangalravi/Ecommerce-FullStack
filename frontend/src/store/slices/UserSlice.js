import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  cart: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    loadUserFromStorage: (state) => {
      const user = localStorage.getItem("user");
      if (user) state.user = JSON.parse(user);
    },
    logoutUser: (state) => {
      state.user = null;
      state.cart = [];
      localStorage.removeItem("user");
    },
    addToCart: (state, action) => {
      const index = state.cart.findIndex(
        (item) => item.productId === action.payload
      );
      if (index === -1)
        state.cart.push({ productId: action.payload, quantity: 1 });
      else state.cart[index].quantity += 1;
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
    },
    increaseCartItem: (state, action) => {
      const index = state.cart.findIndex(
        (item) => item.productId === action.payload
      );
      if (index !== -1) state.cart[index].quantity += 1;
    },
    decreaseCartItem: (state, action) => {
      const index = state.cart.findIndex(
        (item) => item.productId === action.payload
      );
      if (index !== -1) {
        state.cart[index].quantity -= 1;
        if (state.cart[index].quantity <= 0) state.cart.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const getUser = (state) => state.user.user;
export const getUserCart = (state) => state.user.cart;

export const {
  setUser,
  loadUserFromStorage,
  logoutUser,
  addToCart,
  removeFromCart,
  increaseCartItem,
  decreaseCartItem,
  clearCart,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
