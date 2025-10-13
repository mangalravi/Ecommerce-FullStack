import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import "./ProductDetail.css";
import { addOrUpdateCartItemAPI, removeCartItemAPI } from "./CartSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const allCartItems = useSelector((state) => state.cartItems.list);
  console.log("allCartItems", allCartItems);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${slug}`);
        console.log("res.data.message._id", res.data.message._id);
        const filtered = allCartItems.filter(
          (CI) => String(CI.Pid) === String(res.data.message._id)
        );
        const quantityInCart = filtered.length > 0 ? filtered[0].quantity : 0;
        console.log("filtered", filtered);

        setProduct({ ...res.data.message, quantity: quantityInCart });
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, allCartItems]);

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

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (error) return <h3 className="error">{error}</h3>;

  return (
    <div className="product-detail-container">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} />
      </div>
      <div className="product-info">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-price">Price: ₹{product.price}</p>
        <p className="product-category">Category: {product.category}</p>
        <p className="product-stock">Stock: {product.stock}</p>
        <p className="product-rating">Rating: {product.rating}</p>
        <p className="product-description">{product.description}</p>
        {console.log(product)}
        {product?.quantity === 0 || product?.quantity === undefined ? (
          <button onClick={() => handleAddToCart(product._id)}>
            Add to Cart
          </button>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => handleIncrease(product._id, product.quantity)}
            >
              +
            </button>
            <span style={{ margin: "0 8px" }}>{product.quantity}</span>
            <button
              onClick={() => handleDecrease(product._id, product.quantity)}
              disabled={product.quantity === 0}
            >
              -
            </button>
          </div>
        )}
        {product.quantity > 0 && (
          <span>₹{Math.round(product.quantity * product.price)}</span>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
