import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decreaseCartItem, increseCartItem } from "./store/slices/CartSlice";

const HomeDetailPage = () => {
  const { id } = useParams();

  const Products = useSelector((state) => state.Products.list);
  const CartItems = useSelector((state) => state.cartItems.list);
  const dispatch = useDispatch();
  console.log(CartItems);

  const cartItem = CartItems.find((ele) => ele.Pid === Number(id));
  const ProductItem = cartItem
    ? Products.find((ele) => ele.id === cartItem.Pid)
    : null;
  console.log(cartItem);

  if (!ProductItem) return <div>Product not found!</div>;

  return (
    <div key={id} style={{ position: "relative", display: "flex" }}>
      <div
        style={{ display: "flex", justifyContent: "start", minWidth: "400px" }}
      >
        <img
          src={ProductItem.images[2]}
          alt="s"
          width="200"
          style={{ objectFit: "contain" }}
        />
        <div style={{ position: "absolute", display: "flex", bottom: "-2rem" }}>
          {ProductItem.images.map((img, index) => (
            <div key={index}>
              <img src={img} alt="s" width="70" height="70" />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "self-start",
        }}
      >
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
          <button onClick={() => dispatch(increseCartItem(ProductItem.id))}>
            +
          </button>
          {cartItem.quanity}
          <button onClick={() => dispatch(decreaseCartItem(ProductItem.id))}>
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeDetailPage;
