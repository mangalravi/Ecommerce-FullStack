import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increseCartItem,
  decreaseCartItem,
  getAllCartItems,
  isCartError,
  isCartLoading,
} from "./slices/CartSlice";
import { getAllProducts } from "./slices/ProductSlice";

const CartUI = () => {
  const cartData = useSelector(getAllCartItems);
  const productData = useSelector(getAllProducts);
  const isError = useSelector(isCartError);
  const isLoading = useSelector(isCartLoading);
  const dispatch = useDispatch();
  // console.log("cartData", cartData);
  // console.log("prodductData", productData);

  const CartFinalData = cartData
    .map((cartItem) => {
      const product = productData.find(
        (product) => product.id === cartItem.Pid
      );

      return { ...product, quanity: cartItem.quanity };
    })
    .filter((item) => item.id !== undefined);

  // console.log("CartFinalData", CartFinalData);

  const totalCost = CartFinalData.reduce(
    (total, item) => Math.round(total + item.price * item.quanity),
    0
  );
  return isLoading ? (
    <h2 style={{ textAlign: "center" }}>Loading...</h2>
  ) : isError ? (
    <h3 style={{ color: "red", textAlign: "center" }}>{isError}</h3>
  ) : (
    <>
      <h2>Cart Products - Total Cost = ₹{totalCost}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {CartFinalData.map((product) => (
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
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <p>Rating: {product.rating}</p>
            <p>Stock: {product.stock}</p>
            <p>Brand: {product.brand}</p>
            {/* <p>Description: {product.description}</p> */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <button onClick={() => dispatch(increseCartItem(product.id))}>
                  +
                </button>
                {product.quanity}
                <button
                  onClick={() => dispatch(decreaseCartItem(product.id))}
                  disabled={product.quanity === 1}
                >
                  -
                </button>
                <button onClick={() => dispatch(removeFromCart(product.id))}>
                  remove item
                </button>
              </div>
              <span>₹{Math.round(product.quanity * product.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CartUI;
