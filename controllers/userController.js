const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Step 1: Request", req.body);

    // 🔹 validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 hash password
    console.log("Step 2: Hashing...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 CALL createUser SP (single source of truth)
    db.query(
      "CALL createUser(?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        console.log("Step 3: SP called");

        if (err) {
          console.log("DB Error:", err);
          return res.status(500).json(err);
        }

        console.log("result == ", result[0][0]);

        // 🔥 result handling
        const status = result[0][0].res;
        console.log("Step 4: Status =", status);

        // ❌ Email already exists
        if (status === 2) {
          return res.status(400).json({
            message: "Email already registered ❌",
          });
        }

        // ✅ Success → inserted user
        const user = result[1][0];

        console.log("Step 5: User created", user);

        return res.status(201).json({
          message: "User registered successfully ✅",
          user,
        });
      },
    );
  } catch (error) {
    console.log("Outer Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.loginUser = (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    console.log("Step 1: Login Request");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 🔥 SP call
    db.query("CALL getUserByEmail(?)", [email], async (err, result) => {
      console.log("Step 2: SP called");

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      const users = result[0];

      if (users.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = users[0];

      console.log("Step 3: User found");

      // 🔐 password compare
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      console.log("Step 4: Password matched");

      // 🔥 JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      console.log("Step 5: Token generated");

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // production me true
        sameSite: "lax",
      });

      return res.status(200).json({
        message: "Login successful ✅",
        token,
        user,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
