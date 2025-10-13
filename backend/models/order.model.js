import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    address: {
      phoneNumber: String,
      streetAddress: String,
      city: String,
      zipCode: String,
    },
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    deliverdStatus: {
      type: String,
      enum: ["Delivered", "Pending", "Cancelled"],
      default: "Pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true }
)

const Order = mongoose.model("Order", orderSchema)
export default Order
