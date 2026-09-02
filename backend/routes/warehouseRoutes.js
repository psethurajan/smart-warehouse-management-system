const express = require("express");
const router = express.Router();
const {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouseController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/", protect, getWarehouses);
router.post("/", protect, authorize("admin"), createWarehouse);
router.put("/:id", protect, authorize("admin"), updateWarehouse);
router.delete("/:id", protect, authorize("admin"), deleteWarehouse);

module.exports = router;
