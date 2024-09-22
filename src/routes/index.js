const express = require("express");
const userRoutes = require("./userRoute");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const categoryRoutes = require("./categoryRoutes");

const router = express.Router();

// Route mounting
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);
module.exports = router;
