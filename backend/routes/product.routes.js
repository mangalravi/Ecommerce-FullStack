import { Router } from "express"
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
} from "../controllers/product.controller.js"
import { loadProduct } from "../middlewares/product.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// Public routes
router.get("/", getAllProducts)
router.get("/:slug", verifyJWT, getProductBySlug)
router.get("/:id", verifyJWT, getProductById)

// Protected routes (admin-only ideally)
router.post("/add-product", verifyJWT, addProduct)
router.put("/:id", verifyJWT, loadProduct, updateProduct)
router.delete("/:id", verifyJWT, loadProduct, deleteProduct)

export default router
