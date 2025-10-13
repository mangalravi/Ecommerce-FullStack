import { ApiError } from "../utiles/ApiError.js"
import { ApiResponse } from "../utiles/ApiResponse.js"
import {Product} from "../models/product.model.js"

const addProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, stock } = req.body
    const user = req.user // comes from verifyJWT
    console.log("User Role", user)
    if (!user) {
      throw new ApiError(401, "Unauthorized - No user found")
    }

    if (!title || !description || !price || !category) {
      throw new ApiError(400, "All required fields must be provided")
    }
    if (user.role !== "admin") {
      throw new ApiError(403, "Unauthorized - Only admin can add products")
    }
    const existingProduct = await Product.findOne({ title })
    if (existingProduct) {
      throw new ApiError(409, "Product already exists")
    }
    const product = await Product.create({
      title,
      description,
      price,
      category,
      stock,
      role: user.role,
      createdBy: user._id,
      createdByName: user.username,
    })
    console.log(product)

    return res.json(new ApiResponse(201, product, "Product added successfully"))
  } catch (error) {
    next(error)
  }
}

const getAllProducts = async (_, res, next) => {
  try {
    const products = await Product.find()
    // console.log("products", products)

    return res.json(
      new ApiResponse(200, products, "Products fetched successfully")
    )
  } catch (error) {
    next(error)
  }
}

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const product = await Product.findOne({ slug })
    if (!product) throw new ApiError(404, "Product not found")
    return res.json(new ApiResponse(200, product, "Product fetched successfully"))
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id).populate(
      "createdBy",
      "username email"
    )

    if (!product) throw new ApiError(404, "Product not found")

    return res.json(
      new ApiResponse(200, product, "Product fetched successfully")
    )
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = req.user
    console.log("User Role from product controller", user)

    if (user.role !== "admin") {
      throw new ApiError(403, "Unauthorized - Only admin can update products")
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!product) throw new ApiError(404, "Product not found")

    return res.json(
      new ApiResponse(200, product, "Product updated successfully")
    )
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await Product.findByIdAndDelete(id)
    if (!product) throw new ApiError(404, "Product not found")

    return res.json(new ApiResponse(200, null, "Product deleted successfully"))
  } catch (error) {
    next(error)
  }
}

export {
  addProduct,
  getAllProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
}
