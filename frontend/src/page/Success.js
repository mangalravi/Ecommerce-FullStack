import { Link } from "react-router-dom";
import "./Success.css";
import { useSelector } from "react-redux";
import { getAllCartItems } from "../store/slices/CartSlice";
import { getAllProducts } from "../store/slices/ProductSlice";

const Success = () => {
  const cartItems = useSelector(getAllCartItems);
  const allProduct = useSelector(getAllProducts);

  const finalCartItems = cartItems.map((cartItem) => {
    const product = allProduct.find((product) => product._id === cartItem.Pid);
    return product ? { ...product, quantity: cartItem.quantity } : null;
  });
  const grandTotal = finalCartItems
    ? finalCartItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      )
    : 0;
  return (
    <div className="success-page">
      <div className="success-container">
        <span className="success-icon"></span>
        <h1>Order accepted👍</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        {finalCartItems && finalCartItems.length > 0 && (
          <div className="order-summary">
            <h3>Order Summary</h3>
            <hr />
            {finalCartItems.map((product) => (
              <div key={product._id} className="summary-item">
                <div className="summary-left">
                  <img src={product.images[0]} alt={product.id} width="50" />
                  <span>{product.title}</span>
                </div>
                <span>₹{Math.floor(product.quantity * product.price)}</span>
              </div>
            ))}
            <hr />
            <div className="summary-total">
              <span>Grand Total:</span>
              <span>₹{Math.floor(grandTotal)}</span>
            </div>
          </div>
        )}
        <Link to="/product" className="continue-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Success;
