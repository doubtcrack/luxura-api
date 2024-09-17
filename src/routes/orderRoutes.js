const express = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

// GET all orders
router.get("/", getOrders);

// GET a specific order by ID
router.get("/:id", getOrderById);

// POST a new order
router.post("/", createOrder);

// PUT to update an existing order
router.put("/:id", updateOrder);

// DELETE an existing order
router.delete("/:id", deleteOrder);

module.exports = router;
