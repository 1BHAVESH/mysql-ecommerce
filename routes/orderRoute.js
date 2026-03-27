const express = require("express");
const router = express.Router();

const { createProduct, getProducts, updateProduct, getProductById, deleteProductById, uploadMultipleProducts, uploadMultipleImages } = require("../controllers/productController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createOrder } = require("../controllers/ordersController");

//  Create Product (Protected)

router.post("/order-create", authMiddleware, createOrder)




module.exports = router;