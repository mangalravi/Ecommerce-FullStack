import { Router } from "express"
import { createOrder, getAllOrders } from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").get(verifyJWT, getAllOrders)
router.route("/create-product").post(verifyJWT, createOrder)

export default router
