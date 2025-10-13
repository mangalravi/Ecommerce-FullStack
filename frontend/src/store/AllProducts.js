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

const AllProducts = () => {
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const AllProducts = useSelector(getAllProducts) || [];
  const isLoading = useSelector(isProductsLoading);
  const isError = useSelector(isProductsError);
  const CartItems = useSelector(getAllCartItems);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartItemsData());
  }, [dispatch]);

  const getCartItem = (productId) => {
    return CartItems.find((item) => String(item.Pid) === String(productId));
  };

  const finalProductAllData = AllProducts.map((product) => {
    const cartItem = getCartItem(product._id);
    return { ...product, quantity: cartItem ? cartItem.quantity : 0 };
  });

  const displayedProducts = finalProductAllData.filter((product) => {
    const withinPrice = product.price >= minPrice && product.price <= maxPrice;
    let matchesFilter = true;
    if (filterType === "category" && filterValue) {
      matchesFilter = product.category === filterValue;
    } else if (filterType === "brand" && filterValue) {
      matchesFilter = product.brand === filterValue;
    }

    return withinPrice && matchesFilter;
  });

  const uniquecategory = [
    ...new Set(AllProducts.map((product) => product.category).filter(Boolean)),
  ];
  const uniqueBrand = [
    ...new Set(AllProducts.map((product) => product.brand).filter(Boolean)),
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

  return isLoading ? (
    <h2 style={{ textAlign: "center" }}>Loading...</h2>
  ) : isError ? (
    <h3 style={{ color: "red", textAlign: "center" }}>{isError}</h3>
  ) : (
    <>
      <h2>All Products</h2>
      <div className="price-filter">
        <label>Min Price: ₹{minPrice}</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <label>Max Price: ₹{maxPrice}</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <select
        onChange={(e) => {
          setFilterType(e.target.value);
          setFilterValue("");
        }}
        value={filterType}
      >
        <option value="">---Select Filter Type---</option>
        <option value="category">Filter by Category</option>
        <option value="brand">Filter by Brand</option>
      </select>
      {filterType === "category" ? (
        <select
          onChange={(e) => setFilterValue(e.target.value)}
          value={filterValue}
        >
          <option value="">---Select Category---</option>
          {uniquecategory.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      ) : filterType === "brand" ? (
        <select
          onChange={(e) => setFilterValue(e.target.value)}
          value={filterValue}
        >
          <option value="">---Select Brand---</option>
          {uniqueBrand.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {displayedProducts.map((product) => {
          const quantity = product.quantity || 0;
          return (
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
              <p>Price: ₹{Math.round(product.price)}</p>
              <p>Category: {product.category}</p>
              <p>Rating: {product.rating}</p>
              <p>Stock: {product.stock}</p>
              <p>Brand: {product.brand}</p>

              {quantity === 0 ? (
                <button onClick={() => handleAddToCart(product._id)}>
                  Add to Cart
                </button>
              ) : (
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button onClick={() => handleIncrease(product._id, quantity)}>
                    +
                  </button>
                  <span style={{ margin: "0 8px" }}>{quantity}</span>
                  <button
                    onClick={() => handleDecrease(product._id, quantity)}
                    disabled={quantity === 0}
                  >
                    -
                  </button>
                </div>
              )}
              {quantity > 0 && (
                <span>₹{Math.round(quantity * product.price)}</span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllProducts;
