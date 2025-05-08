const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const authenticateAdmin = require("../middleware/authAdmin");

// BÖLGE ROTALARI
router.get("/regions", locationController.getAllRegions);
router.get("/regions/:id", locationController.getRegionById);
router.post("/regions", authenticateAdmin, locationController.addRegion);
router.put("/regions/:id", authenticateAdmin, locationController.updateRegion);
router.delete("/regions/:id", authenticateAdmin, locationController.deleteRegion);

// İLÇE ROTALARI
router.get("/districts", locationController.getAllDistricts);
router.get("/districts/:id", locationController.getDistrictById);
router.get("/regions/:id/districts", locationController.getDistrictsByRegionId);
router.post("/districts", authenticateAdmin, locationController.addDistrict);
router.put("/districts/:id", authenticateAdmin, locationController.updateDistrict);
router.delete("/districts/:id", authenticateAdmin, locationController.deleteDistrict);

// MAHALLE ROTALARI
router.get("/neighborhoods", locationController.getAllNeighborhoods);
router.get("/neighborhoods/:id", locationController.getNeighborhoodById);
router.get("/districts/:id/neighborhoods", locationController.getNeighborhoodsByDistrictId);
router.post("/neighborhoods", authenticateAdmin, locationController.addNeighborhood);
router.put("/neighborhoods/:id", authenticateAdmin, locationController.updateNeighborhood);
router.delete("/neighborhoods/:id", authenticateAdmin, locationController.deleteNeighborhood);

// SOKAK ROTALARI
router.get("/streets", locationController.getAllStreets);
router.get("/streets/:id", locationController.getStreetById);
router.get("/neighborhoods/:id/streets", locationController.getStreetsByNeighborhoodId);
router.post("/streets", authenticateAdmin, locationController.addStreet);
router.put("/streets/:id", authenticateAdmin, locationController.updateStreet);
router.delete("/streets/:id", authenticateAdmin, locationController.deleteStreet);

module.exports = router;