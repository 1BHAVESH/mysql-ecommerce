const express = require("express");
const router = express.Router();

const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { authMiddleware } = require("../middlewares/authMiddleware");

//  Create Category (Protected)
router.post("/", authMiddleware, createCategory);
router.get("/get-categories", authMiddleware, getCategories);
router.get("/:id", authMiddleware, getCategoryById);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);


module.exports = router;