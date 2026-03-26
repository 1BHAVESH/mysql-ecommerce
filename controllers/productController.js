const db = require("../config/db");

// CREATE PRODUCT
exports.createProduct = (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category_id,
      sub_category_id,
      images,
      tags,
    } = req.body;

    const user_id = req.user.id;

    // validation
    if (!name || !price || !category_id || !sub_category_id) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // CALL SP
    db.query(
      "CALL createProduct(?, ?, ?, ?, ?, ?)",
      [name, description || null, price, category_id, sub_category_id, user_id],
      (err, result) => {
        if (err) {
          console.log("SP Error:", err);
          return res.status(500).json({ message: err.sqlMessage });
        }

        const status = result[1][0].res;

        // USER NOT FOUND
        if (status === 2) {
          return res.status(404).json({ message: "User not found" });
        }

        if (status === 3) {
          return res.status(404).json({ message: "Category not found" });
        }

        if (status === 4) {
          return res.status(404).json({ message: "SubCategory not found" });
        }

        if (status === 1) {
          const prod_id = result[0][0].id;

          //  Insert Images
          const insertImages = () => {
            return new Promise((resolve, reject) => {
              if (Array.isArray(images) && images.length > 0) {
                const values = images.map((img) => [
                  prod_id,
                  img.image_link,
                ]);

                db.query(
                  `INSERT INTO product_image (product_id, image_link) VALUES ?`,
                  [values],
                  (err) => {
                    if (err) return reject(err);
                    resolve();
                  }
                );
              } else {
                resolve();
              }
            });
          };

          //  Insert Tags
          const insertTags = () => {
            return new Promise((resolve, reject) => {
              if (Array.isArray(tags) && tags.length > 0) {
                const values = tags.map((tag) => [
                  tag.tag_name,
                  prod_id,
                ]);

                db.query(
                  `INSERT INTO tags (tag_name, prod_id) VALUES ?`,
                  [values],
                  (err) => {
                    if (err) return reject(err);
                    resolve();
                  }
                );
              } else {
                resolve();
              }
            });
          };

          //  Execute both
          Promise.all([insertImages(), insertTags()])
            .then(() => {
              return res
                .status(201)
                .json({ message: "Product created successfully" });
            })
            .catch((err2) => {
              console.log("Insert Error:", err2);
              return res.status(500).json({ message: err2.sqlMessage });
            });
        }
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

      const products = result[0]; //  IMPORTANT

      return res.status(200).json({
        message: "Products fetched successfully ",
        data: products,
      });
    });
  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getProductById = (req, res) => {
  try {
    const { id: productId } = req.params;

    db.query("CALL getProductById(?)", [productId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      const product = result[0];

      console.log(product);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, category_id, sub_category_id } = req.body;

    const multipleImags = req.body.images;

    console.log("Step 1:", { id, ...req.body });

    //  validation
    if (!name || !price || !category_id || !sub_category_id) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    //  CALL SP
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

        const response = result[0][0];

        //  Duplicate
        if (response.message === "EXISTS") {
          return res.status(400).json({
            message: "Product already exists ",
          });
        }

        //  Not Found
        if (response.message === "NOT_FOUND") {
          return res.status(404).json({
            message: "Product not found ",
          });
        }

        //  Category not found
        if (response.message === "CATEGORY_NOT_FOUND") {
          return res.status(404).json({
            message: "Category not found ",
          });
        }

        //  SubCategory not found
        if (response.message === "SUBCATEGORY_NOT_FOUND") {
          return res.status(404).json({
            message: "SubCategory not found ",
          });
        }

        //  Success
        return res.status(200).json({
          message: "Product updated successfully ",
        });
      },
    );
  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteProductById = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(500).json({ message: "id not found" });
    }

    db.query("CALL delete_product_by_id(?)", [id], (err, result) => {
      const response = result[0][0];

      console.log(response);

      if (response.message === "deleted") {
        return res.status(200).json({
          message: "Product deleted successfully ",
        });
      }
      if (response.message === "product not found") {
        return res.status(404).json({
          message: "Product not found",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.uploadMultipleProducts = async (req, res) => {
  try {
    const user_id = req.user.id;
    const multipleProducts = req.body;

    if (!Array.isArray(multipleProducts) || multipleProducts.length === 0) {
      return res.status(400).json({
        message: "Products array required",
      });
    }

    const values = multipleProducts.map((product) => [
      product.name,
      product.description,
      product.price,
      product.category_id,
      product.sub_category_id,
      user_id,
    ]);

    console.log(values);

    db.query(
      `INSERT INTO products 
      (name, description, price, category_id, sub_category_id, user_id) 
      VALUES ?`,
      [values],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: err.sqlMessage });
        }

        console.log("result", result);

        return res.status(201).json({
          message: "All products created successfully",
          insertedRows: result.affectedRows,
        });
      },
    );
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.uploadMultipleImages = async (req, res) => {
  try {
    const { id: p_id } = req.params;
    const multipleImags = req.body;

    if (!Array.isArray(multipleImags) || multipleImags.length === 0) {
      return res.status(400).json({
        message: "Products array required",
      });
    }

    const values = multipleImags.map((image) => [p_id, image.image_link]);

    console.log(values);

    db.query(
      `INSERT INTO product_image 
      (product_id, image_link) 
      VALUES ?`,
      [values],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: err.sqlMessage });
        }

        console.log("result", result);

        return res.status(201).json({
          message: "All image inserted successfully",
          insertedRows: result.affectedRows,
        });
      },
    );
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// exports.uploadMultipleProducts = async (req, res) => {
//   try {
//     const user_id = req.user.id;
//     const multipleProducts = req.body;

//     if (!Array.isArray(multipleProducts) || multipleProducts.length === 0) {
//       return res.status(400).json({
//         message: "Products array required",
//       });
//     }

//     for (let i = 0; i < multipleProducts.length; i++) {
//       const { name, description, price, category_id, sub_category_id } =
//         multipleProducts[i];

//       if (!name || !price || !category_id || !sub_category_id) {
//         return res.status(400).json({
//           message: `Missing fields at index ${i}`,
//         });
//       }

//       const result = await new Promise((resolve, reject) => {
//         db.query(
//           "CALL createProduct(?, ?, ?, ?, ?, ?)",
//           [name, description || null, price, category_id, sub_category_id, user_id],
//           (err, result) => {
//             if (err) return reject(err);
//             resolve(result);
//           }
//         );
//       });

//       const response = result[0][0];

//       if (result[1][0] === 2) {
//         return res.status(404).json({
//           message: `User not found at index ${i}`,
//         });
//       }

//       if (response.res === 3) {
//         return res.status(404).json({
//           message: `Category not found at index ${i}`,
//         });
//       }

//       if (response.res === 4) {
//         return res.status(404).json({
//           message: `SubCategory not found at index ${i}`,
//         });
//       }
//     }

//     //  sab successful hone ke baad ek hi response
//     return res.status(201).json({
//       message: "All products created successfully",
//     });

//   } catch (error) {
//     console.log("Error:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };
