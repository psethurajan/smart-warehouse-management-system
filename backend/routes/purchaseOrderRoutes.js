const express = require("express");
const router = express.Router();
const {
  getPurchaseOrders,
  createPurchaseOrder,
  updateOrderStatus,
} = require("../controllers/purchaseOrderController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/", protect, getPurchaseOrders);
router.post("/", protect, authorize("admin", "manager"), createPurchaseOrder);
router.put("/:id/status", protect, authorize("admin", "manager"), updateOrderStatus);

module.exports = router;
