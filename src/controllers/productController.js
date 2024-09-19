const Product = require("../models/mongodb/productModel");
const slugify = require("slugify");
// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    let {
      title,
      slug,
      productLabels,
      price,
      discountedPrice,
      description,
      images,
    } = req.body;

    if (!slug) {
      slug = slugify(title, { lower: true });
    }

    const newProduct = new Product({
      title,
      slug,
      productLabels,
      price,
      discountedPrice,
      description,
      images,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      productLabels,
      price,
      discountedPrice,
      description,
      images,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug,
        productLabels,
        price,
        discountedPrice,
        description,
        images,
      },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
