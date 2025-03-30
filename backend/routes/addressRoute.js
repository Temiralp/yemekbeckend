const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, addressController.addAddress);
router.get("/", authenticateToken, addressController.getAddresses);
router.put("/:id", authenticateToken, addressController.updateAddress);
router.delete("/:id", authenticateToken, addressController.deleteAddress);
router.get("/regions", authenticateToken, addressController.getAllRegions);
module.exports = router;