import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [
    {
      title: String,
      price: Number,
      quantity: Number,
      image: String,
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
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Order", orderSchema)
