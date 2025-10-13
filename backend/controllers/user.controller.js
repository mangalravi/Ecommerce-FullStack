import { asyncHandler } from "../utiles/asyncHandeler.js"
import { ApiError } from "../utiles/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import twilio from "twilio"
dotenv.config({
  path: "./.env",
})
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials are missing in .env")
}

const client = twilio(accountSid, authToken)
console.log("Twilio client initialized successfully")

const genrateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(userId)
    if (!user) {
      throw new ApiError(404, "User not found")
    }
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(
      500,
      "Server Error while genreting access and refresh tokens"
    )
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body
  console.log("req.body:", req.body)
  console.log("password:", password)
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Feild are required")
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  })
  if (existedUser) {
    throw new ApiError(409, "Email or username already exists")
  }

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user")
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body
  if (!email && !username) {
    throw new ApiError(400, "Email or username are required")
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  })
  if (!user) {
    throw new ApiError(401, "User not found")
  }
  const isPasswordValid = await user.isPasswordCorrect(password)
  const { accessToken, refreshToken } = await genrateAccessAndRefreshTokens(
    user._id
  )
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  const options = {
    httpOnly: true,
    secure: true,
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  )
  const options = {
    httpOnly: true,
    secure: true,
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token")
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken._id)
    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired")
    }
    const options = {
      httpOnly: true,
      secure: true,
    }
    const { accessToken, newRefreshToken } =
      await genrateAccessAndRefreshTokens(user._id)
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      )
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token")
  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new password are required")
  }

  const user = await User.findById(req.user?._id).select("+password")
  if (!user) {
    throw new ApiError(404, "User not found")
  }
  console.log("user from password", user)

  const isPasswordValid = await user.isPasswordCorrect(oldPassword)
  console.log("Old Password from req:", oldPassword)
  console.log("Stored Hash in DB:", user.password)
  console.log("Password match:", isPasswordValid)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid old password")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id)

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  if (!user.refreshToken) {
    return res.status(400).json({ message: "Refresh token missing" })
  }

  res.json({ user })
})

const getUserCartItems = asyncHandler(async (req, res) => {
  const userId = req.user?._id
  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not found in token" })
  }
  const user = await User.findById(req.user?._id)
    .select("-products")
    .populate("cartItems.product")
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  // console.log("user from cart", user)
  res.status(200).json({
    success: true,
    message: "User Cart Items fetched successfully",
    cartItems: user.cartItems,
  })
})

// Add or update cart item
export const addOrUpdateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?._id
  // console.log("req.body", req.body)
  // console.log("req.user", req.user)
  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not found in token" })
  }

  const { product, quanity } = req.body
  // console.log("req.body", req.body)

  if (!product || quanity == null) {
    return res
      .status(400)
      .json({ message: "ProductId and quanity are required" })
  }

  const user = await User.findById(userId)
  // console.log("user", user)

  if (!user) return res.status(404).json({ message: "User not found" })

  const existingItemIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === product
  )

  if (existingItemIndex !== -1) {
    // Update quanity or remove
    if (quanity <= 0) {
      user.cartItems.splice(existingItemIndex, 1)
    } else {
      user.cartItems[existingItemIndex].quanity = quanity
    }
  } else if (quanity > 0) {
    // Add new item
    user.cartItems.push({ product: product, quanity })
  }

  await user.save()
  await user.populate("cartItems.product")

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cartItems: user.cartItems,
  })
})

// Remove cart item
export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?._id
  const { productId } = req.body
  console.log("userID", userId)
  console.log("userID _id", productId)
  console.log("req.body", req.body)

  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ message: "User not found" })

  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== productId
  )

  await user.save()
  await user.populate("cartItems.product")

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    cartItems: user.cartItems,
  })
})

// Clear all cart items
export const clearCartItems = asyncHandler(async (req, res) => {
  const userId = req.user?._id
  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ message: "User not found" })

  user.cartItems = [] 
  await user.save()

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cartItems: user.cartItems,
  })
})

// const getAllUser = asyncHandler(async (req, res) => {
//   const AllUser = await User.find()
//   if (!AllUser || AllUser.length === 0) {
//     return res.status(404).json({ message: "User not found" })
//   }
//   const usersMissingToken = AllUser.filter((u) => !u.refreshToken)
//   if (usersMissingToken.length > 0) {
//     return res
//       .status(400)
//       .json({ message: "Some users are missing refresh tokens" })
//   }
//   res.json({ AllUser })
// })

const updateAccountDetail = asyncHandler(async (req, res) => {
  console.log("rea.body", req.body)
  // console.log("rea.body full req", req)

  const { fullName, email, username, phoneNumber } = req.body
  if (!fullName || !email || !username || !phoneNumber) {
    throw new ApiError(400, "All Feilds are Required")
  }
  const updateData = {
    fullName: fullName,
    email: email,
    username: username,
    phoneNumber: phoneNumber,
  }
  // if (phoneNumber) updateData.phoneNumber = phoneNumber;
  const user = await User.findByIdAndUpdate(
    req.body._id,
    {
      $set: updateData,
    },
    { new: true }
  ).select("-password -refreshToken")
  if (!user) {
    throw new ApiError(404, "User not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated Successfully"))
})

// // // for email verification

// 1️⃣ Request password change
const requestPasswordChange = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) throw new ApiError(400, "Email is required")

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(404, "User not found")

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex")

  // Hash token before saving
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000 // 15 min expiry
  await user.save({ validateBeforeSave: false })

  // Send email with plain resetToken (not hashed)
  const resetUrl = `${process.env.CORS_ORIGINS}/change-password/${resetToken}`

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    text: `Click this link to reset your password: ${resetUrl}`,
  })

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset email sent successfully"))
})

// // 2️⃣ Verify token
const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) throw new ApiError(400, "Invalid or expired token")

  res
    .status(200)
    .json(new ApiResponse(200, { email: user.email }, "Token is valid"))
})

// 1️⃣ Request password reset → send email
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) throw new ApiError(400, "Email is required")

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(404, "User not found")

  const resetToken = crypto.randomBytes(32).toString("hex")
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000 // 15 min
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${process.env.CLIENT_URL}/change-password/${resetToken}`
  const message = `Click the link to reset your password: ${resetUrl}`

  await sendEmail({ to: user.email, subject: "Password Reset", text: message })

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Check your email for password reset link"))
})

// 2️⃣ Reset password via token
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params
  const { newPassword } = req.body
  console.log("token", token)
  console.log("newPassword", newPassword)

  if (!newPassword) throw new ApiError(400, "New password is required")

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  })

  if (!user) throw new ApiError(400, "Token is invalid or expired")

  user.password = newPassword
  user.resetPasswordToken = undefined
  user.resetPasswordExpiry = undefined
  await user.save()

  res.status(200).json(new ApiResponse(200, {}, "Password reset successful"))
})

//for otp

// 1️⃣ Request OTP
export const sendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, user_id } = req.body

  if (!phoneNumber || !user_id) {
    return res
      .status(400)
      .json({ message: "Phone number and user_id are required" })
  }

  // Find existing user
  const user = await User.findById(user_id)
  if (!user) return res.status(404).json({ message: "User not found" })

  // Update phone number if different
  if (user.phoneNumber !== phoneNumber) user.phoneNumber = phoneNumber

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 min

  user.otp = otp
  user.otpExpiry = otpExpiry
  await user.save()

  try {
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}. It expires in 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber, // dynamic phone number
    })

    res.status(200).json({
      message: "OTP sent successfully",
      sid: message.sid,
    })
  } catch (err) {
    console.error("Twilio Error:", err)
    res.status(500).json({ message: "Failed to send OTP" })
  }
})

// 2️⃣ Verify OTP
export const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body

  if (!phoneNumber || !otp)
    return res.status(400).json({ message: "Phone number and OTP required" })

  const user = await User.findOne({ phoneNumber })
  if (!user) return res.status(404).json({ message: "User not found" })

  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" })
  if (user.otpExpiry < new Date())
    return res.status(400).json({ message: "OTP expired" })

  // OTP verified
  user.otp = null
  user.otpExpiry = null
  await user.save()

  res.status(200).json({ message: "OTP verified successfully" })
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUserCartItems,
  updateAccountDetail,
  requestPasswordChange,
  verifyResetToken,
  resetPassword,
  requestPasswordReset,
}
