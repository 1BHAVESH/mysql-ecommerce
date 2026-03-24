const db = require("../config/db");

// CREATE PRODUCT
exports.createProduct = (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category_id,
      sub_category_id
    } = req.body;

    // 🔥 user_id from middleware (JWT)
    const user_id = req.user.id;

    console.log("Step 1:", req.body);

    // 🔹 validation
    if (!name || !price || !category_id || !sub_category_id) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    // 🔥 CALL SP
    db.query(
      "CALL createProduct(?, ?, ?, ?, ?, ?)",
      [name, description || null, price, category_id, sub_category_id, user_id],
      (err, result) => {
        console.log("Step 2: SP called");

        if (err) {
          console.log("Error:", err);
          return res.status(500).json(err);
        }

        console.log("Step 3: Result:", result);

        const response = result[0][0]; // 🔥 IMPORTANT

        // ❌ Duplicate
        if (response.message === "EXISTS") {
          return res.status(400).json({
            message: "Product already exists ❌",
          });
        }

        // ❌ Category not found
        if (response.message === "CATEGORY_NOT_FOUND") {
          return res.status(404).json({
            message: "Category not found ❌",
          });
        }

        // ❌ SubCategory not found
        if (response.message === "SUBCATEGORY_NOT_FOUND") {
          return res.status(404).json({
            message: "SubCategory not found ❌",
          });
        }

        // ✅ Success
        return res.status(201).json({
          message: "Product created successfully ✅",
        });
      }
    );

  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};


exports.getProducts = (req, res) => {
  try {
    db.query("CALL getProducts()", (err, result) => {
      console.log("Step 1: SP called");

      if (err) {
        console.log("Error:", err);
        return res.status(500).json(err);
      }

      console.log("Step 2: Result:", result);

      const products = result[0]; // 🔥 IMPORTANT

      return res.status(200).json({
        message: "Products fetched successfully ✅",
        data: products
      });
    });

  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category_id,
      sub_category_id
    } = req.body;

    console.log("Step 1:", { id, ...req.body });

    // 🔹 validation
    if (!name || !price || !category_id || !sub_category_id) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    // 🔥 CALL SP
    db.query(
      "CALL updateProduct(?, ?, ?, ?, ?, ?)",
      [id, name, description || null, price, category_id, sub_category_id],
      (err, result) => {
        console.log("Step 2: SP called");

        if (err) {
          console.log("Error:", err);
          return res.status(500).json(err);
        }

        console.log("Step 3: Result:", result);

        const response = result[0][0]; // 🔥 IMPORTANT

        // ❌ Duplicate
        if (response.message === "EXISTS") {
          return res.status(400).json({
            message: "Product already exists ❌",
          });
        }

        // ❌ Not Found
        if (response.message === "NOT_FOUND") {
          return res.status(404).json({
            message: "Product not found ❌",
          });
        }

        // ❌ Category not found
        if (response.message === "CATEGORY_NOT_FOUND") {
          return res.status(404).json({
            message: "Category not found ❌",
          });
        }

        // ❌ SubCategory not found
        if (response.message === "SUBCATEGORY_NOT_FOUND") {
          return res.status(404).json({
            message: "SubCategory not found ❌",
          });
        }

        // ✅ Success
        return res.status(200).json({
          message: "Product updated successfully ✅",
        });
      }
    );

  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};