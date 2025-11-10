import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchProductsData = createAsyncThunk(
  "product/fetchProductItems",
  async () => {
    try {
      const data = await api.get(`/product`);
      // console.log("response", data.data.message);
      return data.data.message;
    } catch (error) {
      throw error;
    }
  }
);
// console.log("fetchProductsData =>",fetchProductsData());

const slice = createSlice({ 
  name: "Products",
  initialState: {
    loading: false,
    error: "",
    list: [],
  },
  reducers: {
    // fetchProducts: (state) => {
    //   state.loading = true;
    // },
    // fetchProductsError: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || "Something went wrong";
    // },
    // updateAllProducts: (state, action) => {
    //   state.loading = false;
    //   state.list = action.payload;
    //   state.error = "";
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsData.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("action.payload",action.payload);

        state.list = action.payload.map((product) => ({
          ...product,
          slug: product.slug, 
        }));
        state.error = "";
      })
      .addCase(fetchProductsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});
// console.log("slice", slice);

export const getAllProducts = (state) => state.Products.list;
export const isProductsLoading = (state) => state.Products.loading;
export const isProductsError = (state) => state.Products.error;
export const getCurrentUserData = (state) => state.user.user;

export const ProductReducer = slice.reducer;
