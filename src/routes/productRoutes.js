const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// GET all products
router.get("/", getProducts);

// GET a specific product by ID
router.get("/:id", getProductById);

// POST a new product
router.post("/", createProduct);

// PUT to update an existing product
router.put("/:id", updateProduct);

// DELETE an existing product
router.delete("/:id", deleteProduct);

module.exports = router;
