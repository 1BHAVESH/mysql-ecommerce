const db = require("../config/db");


exports.createCategory = (req, res) => {
  try {
    const { name } = req.body;

    //  token se user_id
    const user_id = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    db.query(
      "CALL createCategory(?, ?)",
      [name, user_id],
      (err, result) => {
        if (err) return res.status(500).json(err);

        const response = result[0][0];

        if (response.message === "EXISTS") {
          return res.status(400).json({
            message: "Category already exists ",
          });
        }

        return res.status(201).json({
          message: "Category created successfully ",
        });
      }
    );

  } catch (error) {
      console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

exports.getCategories = (req, res) => {
  try {
    db.query("CALL getCategories()", (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      const categories = result[0]; //  important

      return res.status(200).json({
        message: "Categories fetched successfully ",
        data: categories
      });
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = (req, res) => {
  try {
    const { id } = req.params;

    db.query("CALL getCategoryById(?)", [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      const category = result[0];

      if (category.length === 0) {
        return res.status(404).json({
          message: "Category not found "
        });
      }

      return res.status(200).json({
        message: "Category fetched successfully ",
        data: category[0]
      });
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    console.log("Step 1:", { id, name });

    // 🔹 validation
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    //  CALL SP
    db.query(
      "CALL updateCategory(?, ?)",
      [id, name],
      (err, result) => {
        console.log("Step 2: SP called");

        if (err) {
          console.log("Error:", err);
          return res.status(500).json(err);
        }

        console.log("Step 3: Result:", result);

        const response = result[0][0]; //  IMPORTANT

        //  Duplicate
        if (response.message === "EXISTS") {
          return res.status(400).json({
            message: "Category already exists ",
          });
        }

        //  Not Found
        if (response.message === "NOT_FOUND") {
          return res.status(404).json({
            message: "Category not found ",
          });
        }

        //  Success
        return res.status(200).json({
          message: "Category updated successfully ",
        });
      }
    );

  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = (req, res) => {
  try {
    const { id } = req.params;

    console.log("Step 1: Delete ID:", id);

    // 🔥 CALL SP
    db.query("CALL deleteCategory(?)", [id], (err, result) => {
      console.log("Step 2: SP called");

      if (err) {
        console.log("Error:", err);
        return res.status(500).json(err);
      }

      console.log("Step 3: Result:", result);

      const response = result[0][0]; // 🔥 IMPORTANT

      // ❌ Not Found
      if (response.message === "NOT_FOUND") {
        return res.status(404).json({
          message: "Category not found ❌",
        });
      }

      // ✅ Success
      return res.status(200).json({
        message: "Category deleted successfully ✅",
      });
    });

  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};


