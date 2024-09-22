const Product = require("../models/mongodb/productModel");
const cloudinary = require("../utils/cloudinary");
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
    let { title, slug, productLabels, price, description } = req.body;
    const missingFields = [];

    if (!title) missingFields.push("title");
    if (!productLabels) missingFields.push("productLabels");
    if (price === undefined) missingFields.push("price");
    if (!description) missingFields.push("description");
    if (!req.files || req.files.length === 0) missingFields.push("images");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missing: missingFields,
      });
    }

    if (!slug) {
      slug = slugify(title, { lower: true });
    }
    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const file of req.files) {
      const uploadFromBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' }, // Additional options if needed
            (error, result) => {
              if (error) {
                return reject(error); // Reject on error
              }
              resolve(result); // Resolve with the result
            }
          );
          stream.end(fileBuffer); // Send the buffer to the stream
        });
      };
    
      try {
        const result = await uploadFromBuffer(file.buffer);
        console.log(result)
        uploadedImages.push(result.secure_url);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
      }
    }

    console.log('uploadedImages ', uploadedImages);
    
    const newProduct = new Product({
      title,
      slug,
      productLabels,
      price,
      description,
      images: uploadedImages,
    });

    console.log(newProduct);
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
