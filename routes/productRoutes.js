const express = require("express");
const router = express.Router();

const { createProduct, getProducts, updateProduct } = require("../controllers/productController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// 🔥 Create Product (Protected)
router.post("/", authMiddleware, createProduct);
router.get("/", authMiddleware, getProducts);
router.put("/:id", authMiddleware, updateProduct);


module.exports = router;