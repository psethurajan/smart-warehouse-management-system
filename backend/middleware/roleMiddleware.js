// Restricts a route to specific roles.
// Usage: router.post("/", protect, authorize("admin", "manager"), createProduct)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires role: ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { authorize };
