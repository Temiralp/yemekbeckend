const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/authMiddleware");

// Ürün Rotaları
router.get("/products", productController.getAllProducts); // Tüm ürünleri listele
router.get("/products/:id", productController.getProductById); // Ürün detayını al
router.post("/createProducts", productController.createProduct); // Yeni ürün ekle
router.put("/updateProducts/:id", productController.updateProduct); // Ürünü güncelle
router.delete("/deleteProducts/:id", productController.deleteProduct); // Ürünü sil
router.post("/add-to-cart", productController.addToCart); // Sepete ürün ekle
router.get("/cart", productController.getCart); // Sepeti listele
router.delete("/cart/:id", productController.removeFromCart); // Sepetten ürün sil

module.exports = router;