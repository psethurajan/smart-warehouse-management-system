// Run with: npm run seed
// This clears existing data and fills the database with sample records
// so the app looks populated when you demo it.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");
const Warehouse = require("../models/Warehouse");
const Product = require("../models/Product");
const PurchaseOrder = require("../models/PurchaseOrder");
const Transaction = require("../models/Transaction");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing old data...");
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Supplier.deleteMany(),
      Warehouse.deleteMany(),
      Product.deleteMany(),
      PurchaseOrder.deleteMany(),
      Transaction.deleteMany(),
    ]);

    console.log("Creating users...");
    const users = await User.create([
      { name: "Arun Kumar", email: "admin@swms.com", password: "admin123", role: "admin", phone: "9876543210" },
      { name: "Priya Raj", email: "manager@swms.com", password: "manager123", role: "manager", phone: "9876543211" },
      { name: "Karthik S", email: "staff@swms.com", password: "staff123", role: "staff", phone: "9876543212" },
    ]);
    const [admin, manager, staff] = users;

    console.log("Creating categories...");
    const categories = await Category.create([
      { name: "Electronics", description: "Electronic devices and accessories" },
      { name: "Groceries", description: "Daily grocery and food items" },
      { name: "Stationery", description: "Office and school stationery" },
      { name: "Furniture", description: "Home and office furniture" },
      { name: "Footwear", description: "Shoes and sandals" },
    ]);

    console.log("Creating suppliers...");
    const suppliers = await Supplier.create([
      { companyName: "Sri Lakshmi Traders", contactPerson: "Mani Shankar", email: "mani@srilakshmi.com", phone: "9998887771", address: "Chennai, TN", gstNumber: "33AASFS1234A1Z5", rating: 4 },
      { companyName: "Tamil Nadu Electronics", contactPerson: "Deepak R", email: "deepak@tnelectronics.com", phone: "9998887772", address: "Coimbatore, TN", gstNumber: "33AASFT5678B1Z2", rating: 5 },
      { companyName: "Global Stationery Co", contactPerson: "Suresh Babu", email: "suresh@globalstat.com", phone: "9998887773", address: "Madurai, TN", gstNumber: "33AASFG4321C1Z9", rating: 3 },
      { companyName: "Comfort Furniture Works", contactPerson: "Anitha M", email: "anitha@comfortfw.com", phone: "9998887774", address: "Salem, TN", gstNumber: "33AASFC8765D1Z1", rating: 4 },
    ]);

    console.log("Creating warehouses...");
    const warehouses = await Warehouse.create([
      { name: "Warehouse A - Chennai", location: "Ambattur Industrial Estate, Chennai", capacity: 5000 },
      { name: "Warehouse B - Coimbatore", location: "SIDCO Industrial Estate, Coimbatore", capacity: 3000 },
    ]);

    console.log("Creating products...");
    const products = await Product.create([
      { name: "Wireless Mouse", sku: "ELEC-001", category: categories[0]._id, supplier: suppliers[1]._id, warehouse: warehouses[0]._id, purchasePrice: 250, sellingPrice: 399, currentStock: 120, reorderLevel: 30, unit: "pcs" },
      { name: "Bluetooth Headphones", sku: "ELEC-002", category: categories[0]._id, supplier: suppliers[1]._id, warehouse: warehouses[0]._id, purchasePrice: 800, sellingPrice: 1299, currentStock: 8, reorderLevel: 15, unit: "pcs" },
      { name: "USB Type-C Cable", sku: "ELEC-003", category: categories[0]._id, supplier: suppliers[1]._id, warehouse: warehouses[0]._id, purchasePrice: 90, sellingPrice: 199, currentStock: 200, reorderLevel: 50, unit: "pcs" },
      { name: "LED Desk Lamp", sku: "ELEC-004", category: categories[0]._id, supplier: suppliers[1]._id, warehouse: warehouses[1]._id, purchasePrice: 350, sellingPrice: 599, currentStock: 4, reorderLevel: 10, unit: "pcs" },
      { name: "Basmati Rice 5kg", sku: "GROC-001", category: categories[1]._id, supplier: suppliers[0]._id, warehouse: warehouses[0]._id, purchasePrice: 420, sellingPrice: 549, currentStock: 60, reorderLevel: 20, unit: "box" },
      { name: "Sunflower Oil 1L", sku: "GROC-002", category: categories[1]._id, supplier: suppliers[0]._id, warehouse: warehouses[0]._id, purchasePrice: 130, sellingPrice: 169, currentStock: 90, reorderLevel: 25, unit: "pcs" },
      { name: "Toor Dal 1kg", sku: "GROC-003", category: categories[1]._id, supplier: suppliers[0]._id, warehouse: warehouses[1]._id, purchasePrice: 95, sellingPrice: 130, currentStock: 15, reorderLevel: 20, unit: "kg" },
      { name: "A4 Paper Ream", sku: "STAT-001", category: categories[2]._id, supplier: suppliers[2]._id, warehouse: warehouses[0]._id, purchasePrice: 210, sellingPrice: 289, currentStock: 75, reorderLevel: 20, unit: "box" },
      { name: "Gel Pens (Pack of 10)", sku: "STAT-002", category: categories[2]._id, supplier: suppliers[2]._id, warehouse: warehouses[0]._id, purchasePrice: 60, sellingPrice: 99, currentStock: 5, reorderLevel: 15, unit: "pack" },
      { name: "Spiral Notebook", sku: "STAT-003", category: categories[2]._id, supplier: suppliers[2]._id, warehouse: warehouses[1]._id, purchasePrice: 30, sellingPrice: 55, currentStock: 140, reorderLevel: 30, unit: "pcs" },
      { name: "Office Chair", sku: "FURN-001", category: categories[3]._id, supplier: suppliers[3]._id, warehouse: warehouses[1]._id, purchasePrice: 2400, sellingPrice: 3499, currentStock: 12, reorderLevel: 5, unit: "pcs" },
      { name: "Study Table", sku: "FURN-002", category: categories[3]._id, supplier: suppliers[3]._id, warehouse: warehouses[1]._id, purchasePrice: 3200, sellingPrice: 4599, currentStock: 0, reorderLevel: 5, unit: "pcs" },
      { name: "Bookshelf 5-Tier", sku: "FURN-003", category: categories[3]._id, supplier: suppliers[3]._id, warehouse: warehouses[0]._id, purchasePrice: 1800, sellingPrice: 2799, currentStock: 9, reorderLevel: 5, unit: "pcs" },
      { name: "Running Shoes", sku: "FOOT-001", category: categories[4]._id, supplier: suppliers[0]._id, warehouse: warehouses[0]._id, purchasePrice: 900, sellingPrice: 1599, currentStock: 45, reorderLevel: 15, unit: "pair" },
      { name: "Formal Sandals", sku: "FOOT-002", category: categories[4]._id, supplier: suppliers[0]._id, warehouse: warehouses[1]._id, purchasePrice: 450, sellingPrice: 799, currentStock: 3, reorderLevel: 10, unit: "pair" },
      { name: "Kids Sports Shoes", sku: "FOOT-003", category: categories[4]._id, supplier: suppliers[0]._id, warehouse: warehouses[1]._id, purchasePrice: 500, sellingPrice: 899, currentStock: 28, reorderLevel: 10, unit: "pair" },
    ]);

    console.log("Creating purchase orders...");
    const purchaseOrders = await PurchaseOrder.create([
      {
        orderNumber: "PO-0001",
        supplier: suppliers[1]._id,
        items: [
          { product: products[1]._id, quantity: 20, price: 800 },
          { product: products[3]._id, quantity: 15, price: 350 },
        ],
        totalAmount: 20 * 800 + 15 * 350,
        status: "Pending",
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdBy: manager._id,
      },
      {
        orderNumber: "PO-0002",
        supplier: suppliers[2]._id,
        items: [{ product: products[8]._id, quantity: 40, price: 60 }],
        totalAmount: 40 * 60,
        status: "Approved",
        expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdBy: manager._id,
      },
      {
        orderNumber: "PO-0003",
        supplier: suppliers[0]._id,
        items: [{ product: products[6]._id, quantity: 30, price: 95 }],
        totalAmount: 30 * 95,
        status: "Received",
        expectedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdBy: manager._id,
      },
    ]);

    console.log("Creating stock transaction history...");
    await Transaction.create([
      { product: products[0]._id, type: "Stock In", quantity: 50, previousStock: 70, newStock: 120, reason: "Initial stock", performedBy: staff._id },
      { product: products[1]._id, type: "Stock Out", quantity: 12, previousStock: 20, newStock: 8, reason: "Sold to customer", performedBy: staff._id },
      { product: products[4]._id, type: "Stock In", quantity: 30, previousStock: 30, newStock: 60, reason: "Purchase order received", performedBy: staff._id },
      { product: products[8]._id, type: "Stock Out", quantity: 10, previousStock: 15, newStock: 5, reason: "Sold to customer", performedBy: staff._id },
      { product: products[10]._id, type: "Adjustment", quantity: 12, previousStock: 14, newStock: 12, reason: "Physical count correction", performedBy: manager._id },
    ]);

    console.log("\nSeed data created successfully!");
    console.log("-----------------------------------");
    console.log("Login credentials:");
    console.log("Admin   -> admin@swms.com / admin123");
    console.log("Manager -> manager@swms.com / manager123");
    console.log("Staff   -> staff@swms.com / staff123");
    console.log("-----------------------------------");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
