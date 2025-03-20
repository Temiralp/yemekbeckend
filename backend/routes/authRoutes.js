const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/guest-login", authController.guestLogin);

router.post("/verify-code", authController.verifyCode);

router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Kullanıcı profili", user: req.user });
});

module.exports = router;
