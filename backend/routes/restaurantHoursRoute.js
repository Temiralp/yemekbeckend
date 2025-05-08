const express = require("express");
const router = express.Router();
const restaurantHoursController = require("../controllers/restaurantHoursController");
const authenticateToken = require("../middleware/authMiddleware");
const authenticateAdmin = require("../middleware/authAdmin");

// Herkes erişebilir - Çalışma saatlerini görüntüle
router.get("/", restaurantHoursController.getAllWorkingHours);

// Herkes erişebilir - Restoranın şu anda açık olup olmadığını kontrol et
router.get("/check", restaurantHoursController.checkRestaurantOpen);

// Sadece admin erişebilir - Çalışma saatlerini güncelle
router.put("/:id", authenticateAdmin, restaurantHoursController.updateWorkingHours);

module.exports = router;