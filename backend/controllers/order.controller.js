import Order from "../models/order.model.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utiles/ApiResponse.js"

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId).populate("cartItems.product")
    if (!user || user.cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" })
    }
    console.log("user from order", user)
    console.log("user,", user.cartItems)
    const orderItems = user.cartItems.map((item) => ({
      productId: item.product._id,
      name: item.product.title,
      price: item.product.price,
      quantity: item.quanity,
      slug : item.product.slug,
    }))
    console.log("Creating order with items:", orderItems)

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const order = await Order.create({
      userId: user._id,
      cartItems: orderItems,
      address: req.body.address,
      totalAmount,
      paymentStatus: "Pending",
      deliverdStatus: "Pending",
    })
    console.log("Order created successfully:", order.cartItems)

    // Clear cart after order
    user.cartItems = []
    await user.save()

    res
      .status(201)
      .json(new ApiResponse(201, "Order placed successfully", order))
  } catch (error) {
    next(error)
  }
}

const getAllOrders = async (_, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullName email")
      .populate("cartItems.productId", "title price thumbnail slug")
    console.log("order", orders)
    return res.json(new ApiResponse(200, "Orders fetched successfully", orders))
  } catch (error) {
    next(error)
  }
}

export { getAllOrders, createOrder }
