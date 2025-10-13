import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react"; // <-- correct import
import { addOrUpdateCartItemAPI, getAllCartItems, fetchCartItemsData, removeCartItemAPI } from "./store/slices/CartSlice";
import { getAllProducts } from "./store/slices/ProductSlice";

const HomeDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const Products = useSelector(getAllProducts);
  const CartItems = useSelector(getAllCartItems);

  // Fetch cart items on mount
  useEffect(() => {
    dispatch(fetchCartItemsData());
  }, [dispatch]);

  const cartItem = CartItems.find((ele) => String(ele.Pid) === String(id));
  const ProductItem = Products.find((ele) => String(ele._id) === String(id)) || {};

  if (!ProductItem) return <div>Product not found!</div>;

  const handleIncrease = () => {
    const quantity = cartItem ? cartItem.quantity + 1 : 1;
    dispatch(addOrUpdateCartItemAPI({ productId: ProductItem._id, quantity }));
  };

  const handleDecrease = () => {
    if (cartItem && cartItem.quantity > 1) {
      dispatch(addOrUpdateCartItemAPI({ productId: ProductItem._id, quantity: cartItem.quantity - 1 }));
    }
  };

  return (
    <div key={id} style={{ position: "relative", display: "flex" }}>
      <div style={{ display: "flex", justifyContent: "start", minWidth: "400px" }}>
        <img
          src={ProductItem.images[2]}
          alt="product"
          width="200"
          style={{ objectFit: "contain" }}
        />
        <div style={{ position: "absolute", display: "flex", bottom: "-2rem" }}>
          {ProductItem.images.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`img-${index}`} width="70" height="70" />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "self-start" }}>
        <h2 style={{ marginBottom: 0 }}>
          {ProductItem.title}
          <span
            style={{
              background: "green",
              padding: "0.25rem",
              fontSize: "0.875rem",
              borderRadius: "0.25rem",
              marginLeft: "0.5rem",
              color: "#fff",
            }}
          >
            {ProductItem.availabilityStatus}
          </span>
        </h2>
        <p>{ProductItem.description}</p>
        <p>Price : ₹{ProductItem.price}</p>
        <p>Rating : {ProductItem.rating} / 5</p>
        <p>Stock : {ProductItem.stock}</p>
        <p>Sku : {ProductItem.sku}</p>
        <p>Warranty : {ProductItem.warrantyInformation}</p>

        <div style={{ display: "flex" }}>
          <button onClick={handleIncrease}>+</button>
          {cartItem?.quantity || 0}
          <button onClick={handleDecrease} disabled={!cartItem || cartItem.quantity === 1}>-</button>
        </div>
      </div>
    </div>
  );
};

export default HomeDetailPage;
