const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const authenticateAdmin = require("../middleware/authAdmin"); 

router.get("/", authenticateAdmin, couponController.getAllCoupons);
router.get("/:id", authenticateAdmin, couponController.getCouponById); 
router.post("/", authenticateAdmin, couponController.createCoupon); 
router.put("/:id", authenticateAdmin, couponController.updateCoupon);
router.delete("/:id", authenticateAdmin, couponController.deleteCoupon);

module.exports = router;