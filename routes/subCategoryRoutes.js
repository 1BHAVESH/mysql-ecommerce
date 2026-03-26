const express = require("express");
const router = express.Router();

const {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
} = require("../controllers/createsubcategory");

const { authMiddleware } = require("../middlewares/authMiddleware");

//  Create SubCategory (Protected)
router.post("/", authMiddleware, createSubCategory);
router.get("/", authMiddleware, getSubCategories);
router.get("/:id", authMiddleware, getSubCategoryById)
router.put("/:id", authMiddleware, updateSubCategory)
router.delete("/:id", authMiddleware, deleteSubCategory)

module.exports = router;