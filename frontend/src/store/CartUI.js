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
import Button from "../components/Button";

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
    <div className="px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto mt-[80px]">
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

          <div className="flex flex-col gap-6 ">
            {CartFinalData.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg shadow-sm py-[1.5rem] px-[1.25rem] gap-[1.5rem] flex "
              >
                <div>
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-[112px] h-[112px] object-contain mb-4"
                    />
                  </Link>
                  <div className="flex flex-col gap-[1rem]">
                    <div className="flex items-center">
                      <Button
                        onClick={() =>
                          handleIncrease(product._id, product.quanity)
                        }
                        className="px-3 py-2 purpulebtn rounded hover:bg-[#e6a71d] transition"
                      >
                        +
                      </Button>
                      <span className="font-semibold mx-4">
                        {product.quanity}
                      </span>
                      <Button
                        onClick={() =>
                          handleDecrease(product._id, product.quanity)
                        }
                        disabled={product.quanity === 1}
                        className={`px-3 py-2 border rounded-md mr-2 purpulebtn ${
                          product.quanity === 1
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-[#e6a71d]"
                        }`}
                      >
                        -
                      </Button>
                    </div>
                    <Button onClick={() => handleRemove(product._id)}>
                      🗑️ Remove
                    </Button>
                  </div>
                </div>

                <div className="px-[20px] py-[1.5rem] flex flex-col flex-1">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center w-full">
                        <Link
                          to={`/product/${product.slug}`}
                          className="text-lg font-semibold text-gray-800 hover:text-green-600 mb-2"
                        >
                          <h3 className="font-bold text-xl mb-5 text-[#bb0100]">
                            {product.title}
                          </h3>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-1">
                    <p className="flex justify-between items-center mb-1 w-1/2">
                      <span className="font-bold">Price:</span> ₹
                      {Math.round(product.price)}
                    </p>
                    <p className="flex justify-between items-center mb-1 w-[45%] ms-[50px]">
                      <span className="font-bold">Category:</span>{" "}
                      {product.category}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="flex justify-between items-center mb-1 w-1/2">
                      <span className="font-bold">Rating:</span>{" "}
                      {product.rating}
                    </p>
                    <p className="flex justify-between items-center mb-1 w-[45%] ms-[50px]">
                      <span className="font-bold">Stock:</span> {product.stock}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="flex justify-between items-center mb-3  w-1/2">
                      <span className="font-bold">Brand:</span> {product.brand}
                    </p>
                    <div className=" font-semibold text-gray-800">
                      <b>Total : </b> ₹
                      {Math.round(product.quanity * product.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Button */}
          <div className="flex mt-8 justify-end">
            <Button
              onClick={MakeANewOrder}
              className="bg-[#16c44b] max-w-[100px] hover:bg-[#16c44b]"
            >
              Check Out
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default CartUI;
