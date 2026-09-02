const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/warehouses", require("./routes/warehouseRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/purchase-orders", require("./routes/purchaseOrderRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.send("SWMS API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
