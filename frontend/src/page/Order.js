import { useEffect, useState } from "react";
import "./Order.css";
import api from "../api/api";
import { Link } from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/order", {
          headers: {
            Authorization: `Bearer ₹{localStorage.getItem("accessToken")}`,
          },
        });
        setOrders(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="order-loading">Loading orders...</div>;
  }

  return (
    <div className="order-container">
      <h2 className="order-title">My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <h3>Order ID: {order._id}</h3>
              <span
                className={`status-badge ${order.deliverdStatus.toLowerCase()}`}
              >
                {order.deliverdStatus}
              </span>
            </div>
            <div className="order-info">
              <p>
                <strong>User:</strong> {order.userId.fullName} (
                {order.userId.email})
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="order-items">
              <table>
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product</th>
                    <th>Price (₹)</th>
                    <th>Quantity</th>
                    <th>Subtotal (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log("order.cartItems", order.cartItems)}
                  {order.cartItems.map((item) => (
                    <tr key={item.productId._id}>
                      <td>
                        <Link to={`/product/${item.productId.slug}`}>
                          <img
                            src={item?.productId?.thumbnail}
                            alt={item?.productId?._id}
                            width="50"
                            height="50"
                          />
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/product/${item.productId.slug}`}
                          style={{ textDecoration: "none", color: "#000" }}
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td>{item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Order;
