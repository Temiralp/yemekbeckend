const jwt = require("jsonwebtoken");
const config = require("../config/config");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header eksik." });
  }
  
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token bulunamadı." });
  }
  
  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token doğrulama hatası:", err);
      
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ 
          error: "Oturumun süresi doldu", 
          code: "TOKEN_EXPIRED" 
        });
      }
      
      return res.status(403).json({ 
        error: "Geçersiz token", 
        code: "INVALID_TOKEN" 
      });
    }

    // Kullanıcı bilgilerini req.user'a ekle
    req.user = {
      id: decoded.id,
      type: decoded.type,
      isGuest: decoded.type === "guest"
    };
    
    console.log("Token doğrulandı, kullanıcı:", req.user);
    next();
  });
};

module.exports = authenticateToken;