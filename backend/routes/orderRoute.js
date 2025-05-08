const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");
const authAdmin = require("../middleware/authAdmin");

// ✅ Eksik tanım tamamlandı
const { getOrderDetails } = orderController;

// Rotalar
router.get('/details/:orderId', authAdmin, getOrderDetails);
router.post("/", authenticateToken, orderController.createOrder);
router.get("/", authenticateToken, orderController.getOrders);
router.get("/all", authAdmin, orderController.getAllOrders);
router.get("/:id", authAdmin, orderController.getOrderById);
router.put("/:order_id/status", authAdmin, orderController.updateOrderStatus);
router.put("/:order_id/cancel", authenticateToken, orderController.cancelOrder);
router.get("/statuses", authAdmin, orderController.getOrderStatuses); // Yeni eklenen durum listesi endpointi

module.exports = router;
