import { ApiError } from "../utiles/ApiError.js"
import { asyncHandler } from "../utiles/asyncHandeler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req, _, next) => {
  console.log("req,body", req.cookies)

  // console.log("Token from header/cookie:", token)
  console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET)
  try {
    const token =
      (req.cookies?.accessToken || "").trim() ||
      req.headers["authorization"]?.replace("Bearer ", "")

    if (!token) {
      throw new ApiError(401, "Unauthenticated request")
    }
    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    console.log("decodedToken", decodedToken)

    if (!decodedToken || !decodedToken._id) {
      throw new ApiError(401, "Invalid or expired token")
    }

    // Find user by _id from token
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    )

    if (!user) {
      throw new ApiError(401, "User not found with this token")
    }

    req.user = user
    req.userId = user._id
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access token")
  }
})
