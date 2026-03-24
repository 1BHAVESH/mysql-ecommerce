const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    // 🔥 cookie se token lo
    const token = req.headers.authorization;

//     console.log(token)

    if (!token) {
      return res.status(401).json({ message: "Please Login and try again" });
    }

    // 🔐 verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ user attach
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};