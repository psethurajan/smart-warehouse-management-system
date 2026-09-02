const express = require("express");
const router = express.Router();
const { getTransactions, createTransaction } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/", protect, getTransactions);
router.post("/", protect, authorize("admin", "manager", "staff"), createTransaction);

module.exports = router;
