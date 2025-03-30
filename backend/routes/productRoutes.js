const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/authMiddleware"); // Normal kullanıcı authentication
const authenticateAdmin = require("../middleware/authAdmin"); // Admin authentication

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

// Rota sıralaması çok önemli - önce özel rotalar, sonra parametre içeren rotalar

// Normal kullanıcıların erişebileceği sepet işlemleri - Bunlar özel rotalar olduğu için önce tanımlanmalı
router.get("/cart", authenticateToken, productController.getCart);
router.post("/cart", authenticateToken, productController.addToCart);
router.delete("/cart/:id", authenticateToken, productController.removeFromCart);

// Ürün CRUD işlemleri
router.post("/", authenticateAdmin, productController.createProduct);
router.put("/:id", authenticateAdmin, productController.updateProduct);
router.delete("/:id", authenticateAdmin, productController.deleteProduct);
router.get("/", productController.getAllProducts);

// Bu rota en sonda olmalı, çünkü /:id deseni diğer tüm rotaları yakalayabilir
router.get("/:id", optionalAuth, productController.getProductById);
router.put("/cart/:id", authenticateToken, productController.updateCartItem);
module.exports = router;