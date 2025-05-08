const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const loginStaff = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-posta ve şifre zorunludur." });
  }

  const query = `
    SELECT * FROM staff 
    WHERE email = ? AND status = 'active'
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Personel sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ error: "Geçersiz e-posta veya hesap aktif değil." });
    }

    const staff = results[0];

    bcrypt.compare(password, staff.password, (err, isMatch) => {
// bcrypt.compare yerine doğrudan string karşılaştırması:
if (password !== staff.password) {
  return res.status(401).json({ error: "Geçersiz şifre." });
}


      const updateQuery = `
        UPDATE staff 
        SET last_login_date = ? 
        WHERE id = ?
      `;

      db.query(updateQuery, [moment().toDate(), staff.id], (err) => {
        if (err) {
          console.error("Son giriş tarihi güncelleme hatası:", err);
        }
      });

      const token = jwt.sign(
        { id: staff.id, role: staff.role, isStaff: true },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        status: "success",
        message: "Giriş başarılı.",
        token,
        staff: {
          id: staff.id,
          full_name: staff.full_name,
          email: staff.email,
          role: staff.role,
        },
      });
    });
  });
};
const getStaffProfile = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ error: "Authorization header eksik." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(400)
      .json({ error: "Token bulunamadı veya yanlış formatta." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    console.log("Decoded token:", decoded);

    const query = `
              SELECT id, full_name, email, role 
              FROM staff 
              WHERE id = ? AND status = 'active'
            `;

    db.query(query, [decoded.id], (err, results) => {
      if (err) {
        console.error("Personel sorgulama hatası:", err);
        return res.status(500).json({ error: "Veritabanı hatası" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Personel bulunamadı." });
      }

      const staff = results[0];
      res.status(200).json(staff);
    });
  } catch (err) {
    console.error("Token doğrulama hatası:", err.message);
    return res
      .status(401)
      .json({ error: "Geçersiz veya süresi dolmuş token." });
  }
};

module.exports = {
  loginStaff,
  getStaffProfile,
};
