const Product = require("../models/Product");
const PurchaseOrder = require("../models/PurchaseOrder");
const Supplier = require("../models/Supplier");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

// @route GET /api/dashboard/stats
// Collects the numbers used by the stat cards + charts on the dashboard
const getStats = async (req, res) => {
  try {
    const products = await Product.find();

    const totalProducts = products.length;
    const totalStockValue = products.reduce(
      (sum, p) => sum + p.currentStock * p.sellingPrice,
      0
    );
    const lowStockCount = products.filter((p) => p.currentStock <= p.reorderLevel).length;
    const outOfStockCount = products.filter((p) => p.currentStock === 0).length;

    const pendingOrders = await PurchaseOrder.countDocuments({ status: "Pending" });
    const totalSuppliers = await Supplier.countDocuments();

    // Stock movement over the last 6 months (grouped by month)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await Transaction.find({ createdAt: { $gte: sixMonthsAgo } });

    const monthlyMovement = {};
    transactions.forEach((t) => {
      const month = t.createdAt.toLocaleString("default", { month: "short" });
      if (!monthlyMovement[month]) {
        monthlyMovement[month] = { month, stockIn: 0, stockOut: 0 };
      }
      if (t.type === "Stock In") monthlyMovement[month].stockIn += t.quantity;
      if (t.type === "Stock Out") monthlyMovement[month].stockOut += t.quantity;
    });

    // Product count per category (for pie/bar chart)
    const categories = await Category.find();
    const categoryDistribution = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return { name: cat.name, value: count };
      })
    );

    res.json({
      totalProducts,
      totalStockValue,
      lowStockCount,
      outOfStockCount,
      pendingOrders,
      totalSuppliers,
      monthlyMovement: Object.values(monthlyMovement),
      categoryDistribution,
      lowStockProducts: products
        .filter((p) => p.currentStock <= p.reorderLevel)
        .map((p) => ({
          name: p.name,
          sku: p.sku,
          currentStock: p.currentStock,
          reorderLevel: p.reorderLevel,
        })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
