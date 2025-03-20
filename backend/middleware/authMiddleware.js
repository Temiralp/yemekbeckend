const jwt = require("jsonwebtoken");
const config = require("../config/config");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Erişim reddedildi. Token eksik." });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;

    if (decoded.type === "guest") {
      req.user.isGuest = true;
    } else {
      req.user.isGuest = false;
    }

    next();
  } catch (err) {
    res.status(403).json({ error: "Geçersiz token." });
  }
};

module.exports = authenticateToken;