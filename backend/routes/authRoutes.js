const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db"); // Bu satırı ekleyin

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/guest-login", authController.guestLogin);

router.post("/verify-code", authController.verifyCode);

router.get("/users", authController.getAllUsers);

router.post("/logout", authMiddleware, authController.logout);

router.get("/profile", authMiddleware, (req, res) => {
    try {
        // Kullanıcı bilgilerini çek
        const query = "SELECT id, full_name, phone, email FROM users WHERE id = ?";
        
        db.query(query, [req.user.id], (err, results) => {
            if (err) {
                console.error("Profil sorgu hatası:", err);
                return res.status(500).json({ error: "Profil bilgileri alınamadı" });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "Kullanıcı bulunamadı" });
            }

            // İlk kullanıcı kaydını gönder
            const kullanici = results[0];
            
            res.json({
                id: kullanici.id,
                full_name: kullanici.full_name,
                phone: kullanici.phone,
                email: kullanici.email
            });
        });
    } catch (error) {
        console.error("Profil endpoint hatası:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
});

module.exports = router;
