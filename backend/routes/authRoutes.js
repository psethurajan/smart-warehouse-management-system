const express = require("express");
const router = express.Router();
const { loginUser, registerUser, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/login", loginUser);

// Only admin can register new employees
router.post("/register", protect, authorize("admin"), registerUser);

router.get("/profile", protect, getProfile);

module.exports = router;
