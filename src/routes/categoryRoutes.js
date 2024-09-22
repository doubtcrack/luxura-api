// routes/categoryRoutes.js
const express = require("express");
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// Create a category
router.post("/create", createCategory);

// Get all categories with subcategories
router.get("/all", getAllCategories);

// Update a category
router.put("/update/:id", updateCategory);

// Delete a category
router.delete("/delete/:id", deleteCategory);

module.exports = router;
