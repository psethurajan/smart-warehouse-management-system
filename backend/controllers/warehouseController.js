const Warehouse = require("../models/Warehouse");
const Product = require("../models/Product");

const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ name: 1 });

    // Attach how much stock is currently used in each warehouse
    // so the frontend can show a simple utilization percentage
    const withUsage = await Promise.all(
      warehouses.map(async (wh) => {
        const products = await Product.find({ warehouse: wh._id });
        const usedUnits = products.reduce((sum, p) => sum + p.currentStock, 0);
        return {
          ...wh.toObject(),
          usedUnits,
          utilization: wh.capacity > 0 ? Math.round((usedUnits / wh.capacity) * 100) : 0,
        };
      })
    );

    res.json(withUsage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
    res.json(warehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
    res.json({ message: "Warehouse deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse };
