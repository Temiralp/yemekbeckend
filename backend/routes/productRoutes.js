const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", authenticateToken, productController.createProduct); 
router.put("/:id", authenticateToken, productController.updateProduct); 
router.delete("/:id", authenticateToken, productController.deleteProduct); 
router.post("/add-to-cart", authenticateToken, productController.addToCart); 
router.get("/cart", authenticateToken, productController.getCart); 
router.delete("/cart/:id", authenticateToken, productController.removeFromCart); 

module.exports = router;