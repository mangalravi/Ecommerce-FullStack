import { createSlice } from "@reduxjs/toolkit";

const wishListSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    ADD_TO_WISHLIST: (state, action) => {
      return state.map((product) =>
        product.id === action.payload.id
          ? { ...product, quanity: product.quanity + 1 }
          : product
      );
    },
    REMOVE_FROM_WISHLIST: (state, action) => {
      return state.map((product) =>
        product.id === action.payload.id
          ? { ...product, quanity: product.quanity - 1 }
          : product
      );
    },
  },
});
// console.log("wishListSlice", wishListSlice);

export const { addToWishlist, removeFromWishlist } = wishListSlice.actions;
export const WishListReducer = wishListSlice.reducer;
