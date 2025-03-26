const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateAdmin = require("../middleware/authMiddleware");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    req.user = null; 
    return next();
  }

  authenticateAdmin(req, res, (err) => {
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
router.post("/add-to-cart", authenticateAdmin, productController.addToCart);
router.get("/cart", authenticateAdmin, productController.getCart);
router.delete("/cart/:id", authenticateAdmin, productController.removeFromCart);

module.exports = router;