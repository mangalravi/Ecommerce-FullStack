import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import twilio from "twilio"

const app = express()
dotenv.config({
  path: "./.env",
})

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// )
// console.log("Twilio Client SID:", process.env.TWILIO_ACCOUNT_SID)

app.use(
  cors({
    origin: process.env.CORS_ORIGINS || "http://localhost:3000",
    credentials: true,
  })
)
app.use((req, res, next) => {
  console.log("CORS headers:", res.getHeaders())
  next()
})

console.log("CORS origin:", process.env.CORS_ORIGINS)

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use((req, _, next) => {
  console.log("Incoming cookies:", req.cookies)
  console.log("Authorization header:", req.headers.authorization)
  next()
})
// API routes
import userRoute from "./routes/user.routes.js"
import productRoute from "./routes/product.routes.js"
import paymentRoute from "./routes/payment.routes.js"
import orderRoute from "./routes/order.routes.js"


//routes declaration
app.use("/api/v1/users", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/order", orderRoute)

//payment routes

app.use("/api/v1/payment", paymentRoute)

export { app }
