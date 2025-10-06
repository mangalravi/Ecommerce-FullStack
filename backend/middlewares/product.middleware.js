import Product from "../models/product.model.js"
import { ApiError } from "../utiles/ApiError.js"

export const loadProduct = async (req, _, next) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) throw new ApiError(404, "Product not found")

    req.product = product
    next()
  } catch (error) {
    next(error)
  }
}
