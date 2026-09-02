const Transaction = require("../models/Transaction");
const Product = require("../models/Product");

// @route GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("product", "name sku")
      .populate("performedBy", "name role")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/transactions
// Handles Stock In / Stock Out / Adjustment and keeps Product.currentStock in sync.
// Every movement is recorded permanently in the Transaction collection (audit trail).
const createTransaction = async (req, res) => {
  try {
    const { product: productId, type, quantity, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const previousStock = product.currentStock;
    let newStock;

    if (type === "Stock In") {
      newStock = previousStock + Number(quantity);
    } else if (type === "Stock Out") {
      if (Number(quantity) > previousStock) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      newStock = previousStock - Number(quantity);
    } else if (type === "Adjustment") {
      // For adjustment, quantity is the new stock value directly
      newStock = Number(quantity);
    } else {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    product.currentStock = newStock;
    await product.save();

    const transaction = await Transaction.create({
      product: productId,
      type,
      quantity,
      previousStock,
      newStock,
      reason,
      performedBy: req.user._id,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getTransactions, createTransaction };
