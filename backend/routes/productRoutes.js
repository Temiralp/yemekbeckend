const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateAdmin = require("../middleware/authMiddleware");
const authenticateUser = require("../middleware/authenticateUser");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    req.user = null;
    return next();
  }

  authenticateUser(req, res, (err) => {
    if (err) {
      req.user = null;
    }
    next();
  });
};

router.get("/", productController.getAllProducts);
router.get("/:id", optionalAuth, productController.getProductById);
router.post("/", authenticateAdmin, productController.createProduct);
router.put("/:id", authenticateAdmin, productController.updateProduct);
router.delete("/:id", authenticateAdmin, productController.deleteProduct);
router.post("/add-to-cart", authenticateUser, productController.addToCart);
router.get("/cart", authenticateUser, productController.getCart);
router.delete("/cart/:id", authenticateUser, productController.removeFromCart);

module.exports = router;