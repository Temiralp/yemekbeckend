const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const userType = req.headers["x-user-type"];
  console.log("Gelen Authorization Header:", authHeader);
  console.log("Gelen X-User-Type:", userType);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Geçersiz Authorization header." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Ayrıştırılan Token:", token);

  if (!token) {
    return res.status(400).json({ error: "Token bulunamadı veya yanlış formatta." });
  }

  if (userType === "guest") {
    req.user = {
      id: token,
      user_type: "guest",
    };
    console.log("Misafir Kullanıcı:", req.user);
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, user) => {
    if (err) {
      console.error("Token doğrulama hatası:", err.message);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token süresi dolmuş." });
      }
      return res.status(403).json({ error: "Geçersiz veya süresi dolmuş token." });
    }

    console.log("Doğrulanan Kullanıcı:", user);

    // user.type yerine user.user_type kontrolü yapıyoruz, ama token'da type var
    const userTypeFromToken = user.type || user.user_type; // Hem type hem user_type desteklensin
    if (userTypeFromToken !== "registered" && userTypeFromToken !== "guest") {
      return res.status(403).json({
        error: "Bu işlem için yetkiniz yok. Yalnızca kayıtlı kullanıcılar veya misafirler erişebilir.",
      });
    }

    // req.user nesnesini güncelliyoruz, user_type olarak kaydediyoruz
    req.user = {
      ...user,
      user_type: userTypeFromToken,
    };
    console.log("Güncellenmiş req.user:", req.user);

    next();
  });
};

module.exports = authenticateUser;