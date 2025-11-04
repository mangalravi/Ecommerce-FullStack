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
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCartItemsData());
  }, [dispatch]);

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

  const totalCost = CartFinalData.reduce(
    (total, item) => Math.round(total + item.price * item.quanity),
    0
  );

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

  const MakeANewOrder = async () => {
    try {
      const response = await api.post("/order/create-product", CartFinalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      navigate("/checkout");
    } catch (error) {
      setError(error.response?.data?.message || "Product Not Created");
    }
  };

  if (isLoading)
    return (
      <h2 className="text-center mt-10 text-2xl font-semibold">Loading...</h2>
    );
  if (isError)
    return (
      <h3 className="text-center mt-10 text-red-500 text-xl">{isError}</h3>
    );

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto">
      {CartFinalData.length === 0 ? (
        <div className="text-center mt-20">
          <h3 className="text-2xl mb-4 font-semibold">
            No Items in Cart. Please add some products.
          </h3>
          <Link
            to="/product"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">
            Cart Products - Total Cost:{" "}
            <span className="text-green-600">₹{totalCost}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CartFinalData.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden bg-white flex flex-col"
              >
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-lg font-semibold text-gray-800 hover:text-green-600 mb-2"
                  >
                    <h3 className="font-bold text-xl min-h-[70px]">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="flex justify-between items-center mb-1">
                    <span className="font-bold">Price:</span> ₹
                    {Math.round(product.price)}
                  </p>
                  <p className="flex justify-between items-center mb-1">
                    <span className="font-bold">Category:</span>{" "}
                    {product.category}
                  </p>
                  <p className="flex justify-between items-center mb-1">
                    <span className="font-bold">Rating:</span> {product.rating}
                  </p>
                  <p className="flex justify-between items-center mb-1">
                    <span className="font-bold">Stock:</span> {product.stock}
                  </p>
                  <p className="flex justify-between items-center mb-3">
                    <span className="font-bold">Brand:</span> {product.brand}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center w-full">
                      <button
                        onClick={() =>
                          handleIncrease(product._id, product.quanity)
                        }
                        className="px-3 py-1 bg-[#e6a71f] rounded hover:bg-[#e6a71d] transition"
                      >
                        +
                      </button>
                      <span className="font-semibold">{product.quanity}</span>
                      <button
                        onClick={() =>
                          handleDecrease(product._id, product.quanity)
                        }
                        disabled={product.quanity === 1}
                        className={`px-3 py-1 border rounded-md mr-2 bg-[#e6a71f] ${
                          product.quanity === 1
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-[#e6a71d]"
                        }`}
                      >
                        -
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="bg-red-500 hover:bg-red-600 font-medium mb-3 text-white px-3 py-1 rounded-md text-sm"
                  >
                    🗑️ Remove
                  </button>
                  <div className="mt-auto font-semibold text-gray-800">
                    Total: ₹{Math.round(product.quanity * product.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Button */}
          <div className="text-center mt-8">
            <button
              onClick={MakeANewOrder}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition"
            >
              Check Out
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default CartUI;
