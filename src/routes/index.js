const express = require("express");
const userRoutes = require("./userRoute");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");

const router = express.Router();

// Route mounting
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
