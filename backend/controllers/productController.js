const Product = require("../models/Product");

// @route GET /api/products?search=&category=&stockStatus=&page=&limit=
const getProducts = async (req, res) => {
  try {
    const { search, category, stockStatus, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    // Build the base query first, stock-status filtering needs the field compared
    // against reorderLevel which is per-document, so we fetch then filter.
    let products = await Product.find(query)
      .populate("category", "name")
      .populate("supplier", "companyName")
      .populate("warehouse", "name")
      .sort({ createdAt: -1 });

    if (stockStatus === "low") {
      products = products.filter((p) => p.currentStock <= p.reorderLevel);
    } else if (stockStatus === "out") {
      products = products.filter((p) => p.currentStock === 0);
    }

    const total = products.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = products.slice(startIndex, startIndex + Number(limit));

    res.json({
      products: paginated,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("supplier", "companyName")
      .populate("warehouse", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
