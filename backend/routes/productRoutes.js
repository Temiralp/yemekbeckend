const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/authMiddleware");
const authenticateAdmin = require("../middleware/authAdmin");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    req.user = null;
    return next();
  }

  authenticateToken(req, res, (err) => {
    if (err) {
      req.user = null;
    }
    next();
  });
};

// Normal kullanıcıların erişebileceği sepet işlemleri
router.get("/cart", authenticateToken, productController.getCart);
router.post("/cart", authenticateToken, productController.addToCart);
router.delete("/cart/:id", authenticateToken, productController.removeFromCart);

// Ürün CRUD işlemleri
router.post("/", authenticateAdmin, productController.createProduct);
router.put("/:id", authenticateAdmin, productController.updateProduct);
router.delete("/:id", authenticateAdmin, productController.deleteProduct);
router.get("/", productController.getAllProducts);

// Adminler için tüm ürünleri döndüren endpoint
router.get("/admin", authenticateAdmin, productController.getAllProductsAdmin);
// Adminler için tek ürün getiren endpoint
router.get("/admin/:id", authenticateAdmin, productController.getProductByIdAdmin);

// Parametre içeren rotalar en sonda
router.get("/:id", optionalAuth, productController.getProductById);
router.put("/cart/:id", authenticateToken, productController.updateCartItem);

module.exports = router;