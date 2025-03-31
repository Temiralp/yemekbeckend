const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");
const authenticateAdmin = require("../middleware/authAdmin");

router.post("/", authenticateToken, orderController.createOrder);
router.get("/", authenticateToken, orderController.getOrders);
router.get("/all", authenticateAdmin, orderController.getAllOrders);
router.put("/:order_id/status", authenticateAdmin, orderController.updateOrderStatus); 
router.put("/:order_id/cancel", authenticateToken, orderController.cancelOrder); 

module.exports = router;