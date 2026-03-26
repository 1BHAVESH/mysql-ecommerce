const express = require("express");
const router = express.Router();

const { createProduct, getProducts, updateProduct, getProductById, deleteProductById, uploadMultipleProducts, uploadMultipleImages } = require("../controllers/productController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// 🔥 Create Product (Protected)
router.post("/", authMiddleware, createProduct);
router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProductById)
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProductById)
router.post("/upload-multiple-products", authMiddleware, uploadMultipleProducts)
router.post("/upload-multiple-images/:id", authMiddleware, uploadMultipleImages)



module.exports = router;