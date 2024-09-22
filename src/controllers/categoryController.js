// controllers/categoryController.js
const Category = require("../models/mongodb/categoryModel")
const slugify = require("slugify");

// Create a new category
exports.createCategory = async (req, res, next) => {
    const { name, featured, status, parentId } = req.body;
    let slug = slugify(name, { lower: true });
    const category = new Category({
      name,
      slug,
      featured,
      status,
      parentId
    });
  
    try {
      const newCategory = await category.save();
      res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// Get all categories with subcategories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, featured, status, parentId } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name, featured, status, parentId }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.remove();
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
};
