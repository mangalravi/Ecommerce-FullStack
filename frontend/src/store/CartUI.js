import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItemsData,
  addOrUpdateCartItemAPI,
  removeCartItemAPI,
  getAllCartItems,
  isCartError,
  isCartLoading,
} from "./slices/CartSlice";
import { getAllProducts } from "./slices/ProductSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

const CartUI = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const cartData = useSelector(getAllCartItems);
  const productData = useSelector(getAllProducts);
  const isError = useSelector(isCartError);
  const isLoading = useSelector(isCartLoading);
  const nevigate = useNavigate();

  // Fetch cart items on component mount
  useEffect(() => {
    dispatch(fetchCartItemsData());
  }, [dispatch]);

  // Map cart data with product details
  const CartFinalData = cartData
    .map((cartItem) => {
      const product =
        productData.find(
          (product) =>
            String(product._id) === String(cartItem.Pid) ||
            product._id === cartItem.Pid
        ) || {};

      return { ...product, quanity: cartItem.quantity };
    })
    .filter((item) => item._id);
  // console.log("CartFinalData", CartFinalData);

  const totalCost = CartFinalData.reduce(
    (total, item) => Math.round(total + item.price * item.quanity),
    0
  );

  const cartbtntop = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
    gap: "1rem",
    alignItems: "center",
  };

  const handleIncrease = (productId, currentQty) => {
    dispatch(addOrUpdateCartItemAPI({ productId, quantity: currentQty + 1 }));
  };

  const handleDecrease = (productId, currentQty) => {
    if (currentQty > 1) {
      dispatch(addOrUpdateCartItemAPI({ productId, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeCartItemAPI(productId));
  };

  if (isLoading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (isError)
    return <h3 style={{ color: "red", textAlign: "center" }}>{isError}</h3>;
  const MakeANewOrder = async () => {
    try {
      console.log("CartFinalData", CartFinalData);

      const response = await api.post("/order/create-product", CartFinalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("response", response.data);
      nevigate("/checkout");
    } catch (error) {
      setError(error.response?.data?.message || "Product Not Created");
    }
  };
  return (
    <>
      {CartFinalData.length === 0 ? (
        <>
          <h3>No Items in cart Please add...</h3>
          <Link to="/product" className="continue-btn">
            Continue Shopping
          </Link>
        </>
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
                key={product._id}
                style={{
                  border: "1px solid #c2c2c2",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <Link to={`/product/${product.slug}`}>
                  <img src={product.thumbnail} alt={product.name} width="100" />
                </Link>
                <Link
                  to={`/product/${product.slug}`}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <h3>{product.title}</h3>
                </Link>
                <p>Price: ₹{product.price}</p>
                <p>Category: {product.category}</p>
                <p>Rating: {product.rating}</p>
                <p>Stock: {product.stock}</p>
                <p>Brand: {product.brand}</p>

                <div>
                  <div style={cartbtntop}>
                    <button
                      onClick={() =>
                        handleIncrease(product._id, product.quanity)
                      }
                    >
                      +
                    </button>
                    {product.quanity}
                    <button
                      onClick={() =>
                        handleDecrease(product._id, product.quanity)
                      }
                      disabled={product.quanity === 1}
                    >
                      -
                    </button>
                  </div>

                  <div style={cartbtntop}>
                    <button
                      style={{
                        maxWidth: "150px",
                        width: "113px",
                        background: "#ff4040",
                      }}
                      onClick={() => handleRemove(product._id)}
                    >
                      🗑️
                    </button>
                    <span>
                      Total : ₹{Math.round(product.quanity * product.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button style={{ maxWidth: "150px" }}>
            <Link
              // to="/checkout"
              onClick={MakeANewOrder}
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Check Out
            </Link>
          </button>
        </>
      )}
    </>
  );
};

export default CartUI;
