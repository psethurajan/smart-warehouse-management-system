const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      required: true,
      default: 10,
    },
    unit: {
      type: String,
      default: "pcs", // pcs, kg, box, litre etc.
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
