import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import "./ProductDetail.css";
import { addOrUpdateCartItemAPI, removeCartItemAPI } from "./CartSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";

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
    <div className="product-detail-container mt-[120px] mx-[100px]">
      <div className="flex flex-col gap-[1rem] ">
        <div className="product-image">
          <img src={product.thumbnail} alt={product.title} />
        </div>
        {console.log(product)}
        {product?.quantity === 0 || product?.quantity === undefined ? (
          <Button
            onClick={() => handleAddToCart(product._id)}
            className="purpulebtn"
          >
            Add to Cart
          </Button>
        ) : (
          <div className="flex gap-[1rem] items-center">
            <Button
              onClick={() => handleIncrease(product._id, product.quantity)}
              className="purpulebtn"
            >
              +
            </Button>
            <span className="my-0 mx-3">{product.quantity}</span>
            <Button
              onClick={() => handleDecrease(product._id, product.quantity)}
              className="purpulebtn"
              disabled={product.quantity === 0}
            >
              -
            </Button>
          </div>
        )}
      </div>

      <div className="product-info">
        <h2 className="product-title mb-4 text-[#bb0100]">{product.title}</h2>
        <p className="product-description mb-3">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="product-price mb-3">
            <span className="font-bold">Price: </span> ₹
            {Math.round(product.price)}
          </p>
          <p className="product-category">
            <span className="font-bold">Category: </span> {product.category}
          </p>
        </div>
        <div className="flex items-center justify-between mb-3">
          <p className="product-stock">
            <span className="font-bold">Stock: </span> {product.stock}
          </p>
          <p className="product-rating">
            <span className="font-bold">Rating: </span> {product.rating}
          </p>
        </div>

        {product.quantity > 0 && (
          <span className="text-end">
            <b>Total Price : </b>₹{Math.round(product.quantity * product.price)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
