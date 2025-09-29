import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import {
//   REMOVE_FROM_CART,
//   INCRESE_CART_ITEM,
//   DECREASE_CART_ITEM,
//   ADD_TO_CART,
// } from "../CartTypes";

// export const CartReducer = (state = [], action) => {
//   switch (action.type) {
//     case ADD_TO_CART:
//       const existingItem = state.find((item) => item.id === action.payload.id);
//       if (existingItem) {
//         return state.map((item) =>
//           item.id === action.payload.id
//             ? { ...item, quanity: item.quanity + 1 }
//             : item
//         );
//       }
//       return [...state, { ...action.payload, quanity: 1 }];
//     case REMOVE_FROM_CART:
//       return state.filter((product) => product.id !== action.payload);
//     case INCRESE_CART_ITEM:
//       return state.map((product) =>
//         product.id === action.payload
//           ? { ...product, quanity: product.quanity + 1 }
//           : product
//       );
//     case DECREASE_CART_ITEM:
//       return state
//         .map((product) =>
//           product.id === action.payload
//             ? { ...product, quanity: product.quanity - 1 }
//             : product
//         )
//         .filter((product) => product.quanity > 0);
//     default:
//       return state;
//   }
// };

export const fetchCartItemsData = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    try {
      const response = await fetch(`https://dummyjson.com/carts/5`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);
// console.dir(fetchCartItemsData);

const slice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    error: "",
    list: [],
  },
  reducers: {
    // fetchCartItems: (state) => {
    //   state.loading = true;
    //   state.error = "";
    // },
    // fetchCartError: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || "Something went wrong";
    // },
    // loadCartItems: (state, action) => {
    //   state.loading = false;
    //   const cartData = action.payload.products;
    //   // console.log("cartData", cartData);
    //   state.list = cartData.map((item) => ({
    //     Pid: item.id,
    //     quanity: item.quantity,
    //   }));
    // },

    addToCart: (state, action) => {
      const productId = action.payload;
      state.list.push({ Pid: productId, quanity: 1 });
    },
    removeFromCart: (state, action) => {
      state.list = state.list.filter(
        (product) => product.Pid !== action.payload
      );
    },
    increseCartItem: (state, action) => {
      const index = state.list.findIndex((item) => item.Pid === action.payload);
      if (index !== -1) {
        state.list[index].quanity += 1;
        if (state.list[index].quanity <= 0) {
          state.list.splice(index, 1);
        }
      }
    },
    decreaseCartItem: (state, action) => {
      const index = state.list.findIndex((item) => item.Pid === action.payload);
      if (index !== -1) {
        state.list[index].quanity -= 1;
        if (state.list[index].quanity <= 0) {
          state.list.splice(index, 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItemsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItemsData.fulfilled, (state, action) => {
        state.loading = false;
        // Map API response to internal cart format
        state.list = action.payload.products.map((item) => ({
          Pid: item.id,
          quanity: item.quantity,
          // name : "Ravi"
        }));
      })
      .addCase(fetchCartItemsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});
// console.log("slice" , slice);

// const { fetchCartItems, fetchCartError, loadCartItems } = slice.actions;
export const getAllCartItems = (state) => state.cartItems.list;
export const isCartLoading = (state) => state.cartItems.loading;
export const isCartError = (state) => state.cartItems.error;

//Thunk Action Creator
// export const fetchCartItemsData = () => (dispatch) => {
//   dispatch(fetchCartItems());
//   fetch(`https://dummyjson.com/carts/5`)
//     .then((res) => res.json())
//     .then((data) => {
//       dispatch(loadCartItems(data));
//     })
//     .catch(() => {
//       dispatch(fetchCartError());
//     });
// };

export const { addToCart, removeFromCart, increseCartItem, decreaseCartItem } =
  slice.actions;
// console.log("slice", slice);

export const CartReducer = slice.reducer;
