const express = require("express");
const db = require("./config/db");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoute = require("./routes/orderRoute")
const cookieParser = require("cookie-parser");
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoute)

// test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
      await db.connect();
  console.log(`Server running on port ${PORT}`);
});