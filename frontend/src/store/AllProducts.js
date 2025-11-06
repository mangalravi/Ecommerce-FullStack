import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addOrUpdateCartItemAPI,
  removeCartItemAPI,
  getAllCartItems,
  fetchCartItemsData,
} from "./slices/CartSlice";
import {
  getAllProducts,
  isProductsError,
  isProductsLoading,
} from "./slices/ProductSlice";
import { Link } from "react-router-dom";
import { Slider } from "@mui/material";
import "./product.css";
import CustomSlider from "../components/Slider";
import Button from "../components/Button";

const AllProducts = () => {
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const allProducts = useSelector(getAllProducts) || [];
  const isLoading = useSelector(isProductsLoading);
  const isError = useSelector(isProductsError);
  const cartItems = useSelector(getAllCartItems);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartItemsData());
  }, [dispatch]);

  const getCartItem = (productId) =>
    cartItems.find((item) => String(item.Pid) === String(productId));

  const finalProductAllData = allProducts.map((product) => {
    const cartItem = getCartItem(product._id);
    return { ...product, quantity: cartItem ? cartItem.quantity : 0 };
  });

  const displayedProducts = finalProductAllData.filter((product) => {
    const [minPrice, maxPrice] = priceRange;
    const withinPrice = product.price >= minPrice && product.price <= maxPrice;

    let matchesFilter = true;
    if (filterType === "category" && filterValue) {
      matchesFilter = product.category === filterValue;
    } else if (filterType === "brand" && filterValue) {
      matchesFilter = product.brand === filterValue;
    }

    return withinPrice && matchesFilter;
  });

  const uniqueCategory = [
    ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
  ];
  const uniqueBrand = [
    ...new Set(allProducts.map((p) => p.brand).filter(Boolean)),
  ];

  const handleAddToCart = (productId) => {
    dispatch(addOrUpdateCartItemAPI({ productId, quantity: 1 }));
  };

  const handleIncrease = (productId, quantity) => {
    dispatch(addOrUpdateCartItemAPI({ productId, quantity: quantity + 1 }));
  };

  const handleDecrease = (productId, quantity) => {
    if (quantity > 1) {
      dispatch(addOrUpdateCartItemAPI({ productId, quantity: quantity - 1 }));
    } else {
      dispatch(removeCartItemAPI(productId));
    }
  };

  if (isLoading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (isError)
    return <h3 className="text-center mt-10 text-red-500">{isError}</h3>;

  return (
    <>
      <div className="relative">
        <CustomSlider />
        <div className="absolute top-1/2 transform -translate-y-1/2 left-[100px]">
          <h2 className="text-[#111111] text-[2.5rem] mb-[2rem] max-w-[205px] leading-[1.1]">
            Furniture 2022
          </h2>
          <p className="text-[#111111] text-[1.125rem] mb-[3rem] font-[700]">
            NEW ARRIVALS
          </p>
          <h3 className="text-[#111111] text-[70px] mb-[3rem] font-[300] max-w-[474px] leading-[1.2]">
            Spring Collection
          </h3>
          <Button variant="danger" className="w-full mt-4 max-w-[145px]">
            Shop Now
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between my-6 gap-4 mx-[100px]">
        <h2 className="text-4xl font-bold text-[#6d35f3]">
          Products You’ll Love
        </h2>

        <div className="flex flex-col md:items-center gap-4 w-full md:w-auto md:min-w-[20rem]">
          {/* Price Filter */}
          <div className="w-full md:w-60">
            <p className="text-gray-700 font-medium mb-1">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </p>
            <Slider
              value={priceRange}
              min={0}
              max={1000}
              onChange={(_, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              color="secondary"
            />
          </div>

          {/* Filter Type */}
          <div className="relative w-full md:w-48">
            <select
              className="block text-[0.85rem] w-full px-4 py-2 pr-8 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterValue("");
              }}
            >
              <option value="">---Select Filter Type---</option>
              <option value="category">Filter by Category</option>
              <option value="brand">Filter by Brand</option>
            </select>
          </div>

          {/* Dynamic Filter */}
          {filterType === "category" && (
            <div className="relative w-full md:w-48">
              <select
                className="block text-[0.85rem] w-full px-4 py-2 pr-8 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <option value="">---Select Category---</option>
                {uniqueCategory.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterType === "brand" && (
            <div className="relative w-full md:w-48">
              <select
                className="block text-[0.85rem] w-full px-4 py-2 pr-8 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <option value="">---Select Brand---</option>
                {uniqueBrand.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-[100px] ">
        {displayedProducts.map((product) => {
          const quantity = product.quantity || 0;
          return (
            <div
              key={product._id}
              className="rounded-xl px-5 py-6 customcardshadow text-start flex flex-col"
            >
              <Link
                to={`/product/${product.slug}`}
                className="flex justify-center mb-4"
              >
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full max-h-[200px] object-contain"
                />
              </Link>
              <Link
                to={`/product/${product.slug}`}
                className="text-black no-underline mb-2"
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
                <span className="font-bold">Category:</span> {product.category}
              </p>
              <p className="flex justify-between items-center mb-1">
                <span className="font-bold">Rating:</span> {product.rating}
              </p>
              <p className="flex justify-between items-center mb-1">
                <span className="font-bold">Stock:</span> {product.stock}
              </p>
              <p className="flex justify-between items-center mb-[2.25rem]">
                <span className="font-bold">Brand:</span> {product.brand}
              </p>

              {/* Add / Increase / Decrease */}
              {quantity === 0 ? (
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleIncrease(product._id, quantity)}
                    className="px-3 py-1 bg-[#e6a71f] rounded hover:bg-[#e6a71d] transition"
                  >
                    +
                  </button>
                  <span className="font-medium">{quantity}</span>
                  <button
                    onClick={() => handleDecrease(product._id, quantity)}
                    className="px-3 py-1 bg-[#e6a71f] rounded hover:bg-[#e6a71d] transition"
                  >
                    -
                  </button>

                  <span className="ml-auto font-bold">
                    ₹{Math.round(quantity * product.price)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllProducts;
