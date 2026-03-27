const db = require("../config/db");


exports.createOrder = (req, res) => {
  try {

      const {
      p_user_id,
      p_p_id
    } = req.body;
    
    // CALL SP
    db.query(
      "CALL order_placed(?, ?)",
      [p_user_id, p_p_id],
      (err, result) => {
        if (err) {
          console.log("SP Error:", err);
          return res.status(500).json({ message: err.sqlMessage });
        }

        console.log("result == ",result)

        const status = result[0][0].res;

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

          return res.status(404).json({ message: "ok" });

         
        }
      }
    );
  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};