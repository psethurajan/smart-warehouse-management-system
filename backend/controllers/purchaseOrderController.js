const PurchaseOrder = require("../models/PurchaseOrder");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate("supplier", "companyName")
      .populate("items.product", "name sku")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto-generates a simple order number like PO-0001
const generateOrderNumber = async () => {
  const count = await PurchaseOrder.countDocuments();
  return `PO-${String(count + 1).padStart(4, "0")}`;
};

const createPurchaseOrder = async (req, res) => {
  try {
    const { supplier, items, expectedDelivery } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await PurchaseOrder.create({
      orderNumber: await generateOrderNumber(),
      supplier,
      items,
      totalAmount,
      expectedDelivery,
      createdBy: req.user._id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @route PUT /api/purchase-orders/:id/status
// Moves an order through the workflow: Pending -> Approved/Rejected -> Received
// When marked "Received", stock is automatically added and logged as a transaction.
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Purchase order not found" });

    if (status === "Received" && order.status !== "Received") {
      // Add received quantity to stock for every product in the order
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const previousStock = product.currentStock;
          product.currentStock += item.quantity;
          await product.save();

          await Transaction.create({
            product: product._id,
            type: "Stock In",
            quantity: item.quantity,
            previousStock,
            newStock: product.currentStock,
            reason: `Received from Purchase Order ${order.orderNumber}`,
            performedBy: req.user._id,
          });
        }
      }
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getPurchaseOrders, createPurchaseOrder, updateOrderStatus };
