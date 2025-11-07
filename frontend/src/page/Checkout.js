import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCartItems,
  removeAllCartItems,
  removeCartItemAPI,
} from "../store/slices/CartSlice";
import {
  getAllProducts,
  getCurrentUserData,
} from "../store/slices/ProductSlice";
import "./checkout.css";
import api from "../api/api";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import InputField from "../components/InputFeild";
import Button from "../components/Button";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    streetAddress: "",
    city: "",
    zipCode: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const otpRefs = useRef([]);
  const cartData = useSelector(getAllCartItems);
  // console.log("cartitem from checkout",cartData);

  const productData = useSelector(getAllProducts);
  //  console.log("productData from checkout",productData);
  const user = useSelector(getCurrentUserData);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedData = localStorage.getItem("mobileAndAddress");
    if (savedData) {
      try {
        const parseData = JSON.parse(savedData);
        setFormData(parseData);
        if (parseData.phoneNumber) setIsPhoneVerified(true);
        setSuccess(true);
      } catch (error) {
        console.log("something went wrong ", error);
      }
    }
  }, []);
  useEffect(() => {
    return () => {
      const clearCart = async () => {
        try {
          await dispatch(removeAllCartItems()).unwrap();
          console.log("Cart cleared from DB");
        } catch (err) {
          console.error("Failed to clear cart on leaving page", err);
        }
      };
      clearCart();
    };
  }, [dispatch]);

  const handleSaveDetail = () => {
    if (formData) {
      localStorage.setItem("mobileAndAddress", JSON.stringify(formData));
      setSuccess(true);
    }
  };
  const CartFinalData = cartData
    .map((cartItem) => {
      const product = productData.find((p) => p._id === cartItem.Pid);
      return product ? { ...product, quantity: cartItem.quantity } : null;
    })
    .filter(Boolean);
  console.log("CartFinalData from checkout", CartFinalData);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // OTP input change with auto-focus
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < otp.length - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  // Backspace handling
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Send OTP
  const sendOtp = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Enter a valid 10-digit mobile number");
      setSuccess("");
      return;
    }

    try {
      const res = await api.post("/users/send-otp", {
        phoneNumber: "+91" + formData.phoneNumber,
        user_id: user._id,
      });

      if (res.status === 200) {
        setSuccess("OTP sent to your phone");
        setError("");
        setIsOtpSent(true);
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong while sending OTP";
      setError(msg);
      setSuccess("");
    }
  };

  const verifyOtp = async () => {
    if (otp.some((digit) => digit === "")) {
      setError("Enter all OTP digits");
      setSuccess("");
      return;
    }

    const otpValue = otp.join("");

    try {
      const res = await api.post("/users/verify-otp", {
        phoneNumber: "+91" + formData.phoneNumber,
        otp: otpValue,
      });
      console.log("res", res);

      if (res.status === 200) {
        setIsPhoneVerified(true);
        setIsOtpSent(false);
        setError("");
        setSuccess("Phone number verified successfully");
      } else {
        setError(res.data.message || "Invalid OTP");
        setSuccess("");
      }
    } catch (err) {
      setError("Something went wrong while verifying OTP");
      console.error(err);
    }
  };

  // Save billing details
  const handleSubmit = (e) => {
    e.preventDefault();
    const { phoneNumber, streetAddress, city, zipCode } = formData;

    if (!phoneNumber || !isPhoneVerified) {
      setError("Phone number must be verified");
      setSuccess("");
      return;
    }
    if (!streetAddress || !city || !zipCode) {
      setError("All fields are mandatory");
      setSuccess("");
      return;
    }

    const zipRegex = /^[0-9]{6}$/;
    if (!zipRegex.test(zipCode)) {
      setError("Enter a valid 6-digit ZIP code");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("All details saved successfully");
  };

  // Place Order
  const handlePlaceOrder = async () => {
    if (!success) {
      setError("Please save your billing details first");
      return;
    }

    if (paymentMethod === "cod") {
      navigate("/success-page");
      dispatch(removeAllCartItems());
    }
    try {
      const amount = CartFinalData.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      // Create Razorpay order from backend
      const res = await api.post("/payment/create-order", {
        amount,
        cartItems: CartFinalData,
        userId: user._id,
        address: formData,
      });

      const { orderId, key, amount: orderAmount, currency } = res.data;

      const options = {
        key,
        amount: orderAmount,
        currency,
        name: "DailyFit Meals",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          const verifyRes = await api.post("/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            alert("Payment successful! Order placed.");
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          phoneNumber: formData.phoneNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      setError("Error while placing order");
    }
  };

  return (
    <div className="mt-[100px] mx-[100px]">
      <h2 className="checkout-title">Checkout</h2>
      <div className="checkout-grid">
        <div className="checkout-form">
          <h3>Billing Details</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" value={user.fullName} disabled />
            <input type="email" value={user.email} disabled />

            <div className="phone-otp-wrapper">
              <input
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={10}
              />
              {isPhoneVerified && <span>✅</span>}
              {!isPhoneVerified && !isOtpSent && (
                <Button className="purpulebtn max-h-[40px]" onClick={sendOtp}>
                  Send OTP
                </Button>
              )}
            </div>

            {isOtpSent && (
              <div className="otp-container">
                <p>Enter OTP</p>
                <div className="otp-inputs">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                  <Button onClick={sendOtp}>Resend OTP</Button>
                  <Button onClick={verifyOtp}>Verify OTP</Button>
                </div>
              </div>
            )}

            <input
              type="text"
              placeholder="Street Address"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Zip Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
            />

            {error && <p className="error text-red-600 mt-2">{error}</p>}
            {success && <p className="success">{success}</p>}

            <Button
              type="submit"
              className="save-details-btn"
              onClick={handleSaveDetail}
            >
              Save Details
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {CartFinalData.map((product) => {
            const subtotal = Math.floor(product.quantity * product.price);
            // console.log("subtotal", subtotal);

            return (
              <div key={product._id} className="summary-item">
                <div className="summary-left">
                  <img src={product.images[0]} alt={product.id} width="50" />
                  <span>{product.title}</span>
                </div>
                <span>₹ {subtotal}</span>
              </div>
            );
          })}

          <hr />
          <p className="py-3 text-end">
            <b> Grand Total : </b> ₹
            {CartFinalData.reduce(
              (total, product) =>
                Math.floor(total + product.quantity * product.price),
              0
            )}
          </p>
          <hr />

          <div className="payment-method my-[1.25rem] ">
            <h4>Payment Method</h4>
            <div className="payment-options">
              <label className="text-[0.875rem] my-[0.5rem]">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="me-1"
                />
                Credit / Debit Card
              </label>

              <label className="text-[0.875rem] my-[0.5rem]">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="me-1"
                />
                PayPal
              </label>
              <label className="text-[0.875rem] my-[0.5rem]">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="me-1"
                />
                Cash on Delivery
              </label>
            </div>
          </div>
          {!paymentMethod === "cod" && (
            <p className="error text-red-600 mt-2">{error}</p>
          )}
          <Button
            type="button"
            className="purpulebtn"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
