const db = require("../config/db");

exports.createSubCategory = (req, res) => {
  try {
    const { name, category_id } = req.body;
    const user_id = req.user.id; // 🔥 from middleware

    if (!name || !category_id) {
      return res.status(400).json({ message: "All fields required" });
    }

    db.query(
      "CALL createSubCategory(?, ?, ?)",
      [name, category_id, user_id],
      (err, result) => {
        if (err) return res.status(500).json(err);

        const response = result[0][0];

        if (response.message === "EXISTS") {
          return res.status(400).json({ message: "SubCategory already exists ❌" });
        }

        if (response.message === "CATEGORY_NOT_FOUND") {
          return res.status(404).json({ message: "Category not found ❌" });
        }

        return res.status(201).json({
          message: "SubCategory created successfully ✅",
        });
      }
    );

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getSubCategories = (req, res) => {
  try {
    db.query("CALL getSubCategories()", (err, result) => {
      if (err) {
        console.log("Error:", err);
        return res.status(500).json(err);
      }

      const subCategories = result[0]; // 🔥 IMPORTANT

      return res.status(200).json({
        message: "SubCategories fetched successfully ✅",
        data: subCategories
      });
    });

  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};