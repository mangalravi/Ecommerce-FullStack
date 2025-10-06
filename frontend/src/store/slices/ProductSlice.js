import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// export const ProductReducer = (state = []) => {
//   return state;
// };
export const fetchProductsData = createAsyncThunk(
  "product/fetchProductItems",
  async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products`);
      const data = await response.json();
      // console.log("data", data);

      return data;
    } catch (error) {
      throw error;
    }
  }
);
// console.log("fetchProductsData =>",fetchProductsData);

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
        state.list = action.payload.products;
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
export const getCurrentUserData = state => state.user.user

//  const { updateAllProducts, fetchProducts, fetchProductsError } =
//   slice.actions;
// export const fetchProductsData = () => (dispatch) => {
//   dispatch(fetchProducts());
//   fetch(`https://dummyjson.com/products`)
//     .then((res) => res.json())
//     .then((data) => {
//       // console.log("data",data.products);

//       dispatch(updateAllProducts(data.products));
//     })
//     .catch(() => {
//       dispatch(fetchProductsError());
//     });
// };
export const ProductReducer = slice.reducer;
