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
    let { title, productLabels, price, discountedPrice, description, category } = req.body;
    const missingFields = [];

    // Validate required fields
    if (!title) missingFields.push("title");
    if (price === undefined) missingFields.push("price");
    if (!description) missingFields.push("description");
    if (!category) missingFields.push("category");
    // Images are optional now
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "At least one product image is required",
      });
    }

    // If there are missing required fields, send error response
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missing: missingFields,
      });
    }

    let slug = slugify(title, { lower: true });

    // Upload images to Cloudinary
    const uploadedImages = [];
    const uploadFromBuffer = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'luxura-products',  // Cloudinary folder
            resource_type: 'image',   
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result); 
          }
        );
        stream.end(fileBuffer); 
      });
    };

    for (const file of req.files) {
      try {
        const result = await uploadFromBuffer(file.buffer);
        console.log(result);
        uploadedImages.push(result.secure_url);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({
          error: "Failed to upload image to Cloudinary",
          details: error.message,
        });
      }
    }

    console.log(req.body, ' ', slug)
    // Create new product
    const newProduct = new Product({
      title,
      slug,
      productLabels: productLabels.split(',') || null,  // Convert CSV to array
      price,
      discountedPrice: discountedPrice || null,  // Optional field
      description,
      category,
      images: uploadedImages,  // Uploaded images from Cloudinary
    });

    console.log(newProduct);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
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
