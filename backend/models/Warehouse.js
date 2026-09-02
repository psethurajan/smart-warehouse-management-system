const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number, // total unit capacity of the warehouse
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", warehouseSchema);
