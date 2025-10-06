import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.model.js"; 
import dotenv from "dotenv";
dotenv.config();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// ✅ Step 1: Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", cartItems, userId, address } = req.body;

    // Create order in Razorpay
    const options = {
      amount: amount * 100, 
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Store in DB
    const newOrder = new Order({
      userId,
      cartItems,
      address,
      totalAmount: amount,
      paymentStatus: "pending",
      razorpayOrderId: razorpayOrder.id,
    });
    await newOrder.save();

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};

// ✅ Step 2: Verify Payment Signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: "success", razorpayPaymentId: razorpay_payment_id },
        { new: true }
      );

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
