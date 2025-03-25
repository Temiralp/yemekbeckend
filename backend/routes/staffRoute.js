const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const authenticateAdmin = require("../middleware/authAdmin"); // Middleware'i import et

// Personel Giriş Rotası
router.post("/login", staffController.loginStaff);

// Token ile Personel Bilgisini Getirme Rotası
router.get("/me", authenticateAdmin, staffController.getStaffProfile);

module.exports = router;