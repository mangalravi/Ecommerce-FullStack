import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseCartItem,
  getAllCartItems,
  increseCartItem,
} from "./slices/CartSlice";
import {
  getAllProducts,
  isProductsError,
  isProductsLoading,
} from "./slices/ProductSlice";

const AllProducts = () => {
  const AllProducts = useSelector(getAllProducts) || [];
  // console.log("getAllProducts", getAllProducts);

  // console.log("AllProducts", AllProducts);

  const isLoading = useSelector(isProductsLoading);
  const isError = useSelector(isProductsError);
  const CartItems = useSelector(getAllCartItems);

  const dispatch = useDispatch();

  const getCartItem = (productId) => {
    return CartItems.find((item) => item.Pid === productId);
  };

  const finalProductAllData = AllProducts.map((product) => {
    const cartItem = getCartItem(product.id);
    return { ...product, quantity: cartItem ? cartItem.quanity : 0 };
  });

  return isLoading ? (
    <h2 style={{ textAlign: "center" }}>Loading...</h2>
  ) : isError ? (
    <h3 style={{ color: "red", textAlign: "center" }}>{isError}</h3>
  ) : (
    <>
      <h2>All Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {finalProductAllData?.map((product) => {
          const cartItem = getCartItem(product.id);
          const quantity = cartItem ? cartItem.quanity : 0;

          // console.log("quantity", typeof quantity, cartItem, product.id);

          return (
            <div
              key={product.id}
              style={{
                border: "1px solid #c2c2c2",
                margin: "10px",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <img src={product.thumbnail} alt={product.name} width="100" />
              <h3>{product.name}</h3>
              <p>Price: ₹{Math.round(product.price)}</p>
              <p>Category: {product.category}</p>
              <p>Rating: {product.rating}</p>
              <p>Stock: {product.stock}</p>
              <p>Brand: {product.brand}</p>

              {quantity === 0 ? (
                <button onClick={() => dispatch(addToCart(product.id))}>
                  Add to Cart
                </button>
              ) : (
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button onClick={() => dispatch(increseCartItem(product.id))}>
                    +
                  </button>
                  <span style={{ margin: "0 8px" }}>{quantity}</span>
                  <button
                    onClick={() => dispatch(decreaseCartItem(product.id))}
                    disabled={quantity === 0}
                  >
                    -
                  </button>
                </div>
              )}
              <span>₹{Math.round(product.quantity * product.price)}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllProducts;
