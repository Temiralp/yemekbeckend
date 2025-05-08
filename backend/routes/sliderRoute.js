const express = require("express");
const router = express.Router();
const sliderController = require("../controllers/sliderController");
const authenticateAdmin = require("../middleware/authAdmin"); 

// Herkese açık rotalar
router.get("/", sliderController.getAllSliders);

// Sadece admin erişebilir
router.get("/admin", authenticateAdmin, sliderController.getAllSliders); 
router.get("/:id", authenticateAdmin, sliderController.getSliderById);
router.post("/", authenticateAdmin, sliderController.createSlider);
router.put("/:id", authenticateAdmin, sliderController.updateSlider);
router.delete("/:id", authenticateAdmin, sliderController.deleteSlider);

module.exports = router;