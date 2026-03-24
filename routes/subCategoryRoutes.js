const express = require("express");
const router = express.Router();

const {
  createSubCategory,
  getSubCategories
} = require("../controllers/createsubcategory");

const { authMiddleware } = require("../middlewares/authMiddleware");

//  Create SubCategory (Protected)
router.post("/", authMiddleware, createSubCategory);
router.get("/", authMiddleware, getSubCategories);

module.exports = router;