import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Fetch cart items from API
export const fetchCartItemsData = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/users/get-user-cart-items");
      return data.data.cartItems || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// console.log("fetchCartItemsData", fetchCartItemsData);

// Add or update cart item via API
export const addOrUpdateCartItemAPI = createAsyncThunk(
  "cart/addOrUpdateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/add-or-update-cart-item", {
        product: productId,
        quanity: quantity,
      });
      console.log("response.data.cartItems", response.data);
      return response.data.cartItems || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove cart item via API
export const removeCartItemAPI = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete("/users/remove-cart-items", {
        data: { productId },
      });
      return response.data.cartItems || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeAllCartItems = createAsyncThunk(
  "cart/removeAllCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/users/clear-cart");
      return response.data.cartItems;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const slice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    error: "",
    list: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart Items
      .addCase(fetchCartItemsData.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCartItemsData.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload
          .filter((item) => item?.product)
          .map((item) => ({
            Pid: item?.product?._id || item._id,
            quantity: item?.quanity ?? 1,
          }));
      })
      .addCase(fetchCartItemsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Add or Update Cart Item
      .addCase(addOrUpdateCartItemAPI.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(addOrUpdateCartItemAPI.fulfilled, (state, action) => {
        // console.log("action.payload from add an update", action.payload);
        state.loading = false;
        state.list = action.payload
          .filter((item) => item?.product)
          .map((item) => ({
            Pid: item?.product?._id || item._id,
            quantity: item?.quanity ?? 1,
          }));
      })
      .addCase(addOrUpdateCartItemAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Remove Cart Item
      .addCase(removeCartItemAPI.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(removeCartItemAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload
          .filter((item) => item?.product)
          .map((item) => ({
            Pid: item?.product?._id || item._id,
            quantity: item?.quanity ?? 1,
          }));
      })
      .addCase(removeCartItemAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      //removeAllCartItems
      .addCase(removeAllCartItems.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(removeAllCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = [];
      })
      .addCase(removeAllCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

// Selectors
export const getAllCartItems = (state) => state.cartItems.list;
export const isCartLoading = (state) => state.cartItems.loading;
export const isCartError = (state) => state.cartItems.error;

// Export reducer
export const CartReducer = slice.reducer;
