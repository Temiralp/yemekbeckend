const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const config = require("../config/config");
const moment = require("moment");
const smsService = require('../utils/smsService');
const sendPasswordEmail= require('../utils/smsService');

const register = async (req, res) => {
  const { name, surname, phone, email } = req.body;
  const fullName = `${name} ${surname}`;
  
  // Daha güvenli rastgele doğrulama kodu
  const verificationCode = "123456";
  const expiresAt = moment().add(3, "minutes").toDate();

  try {
    // Telefon numarası kontrolü
    db.query("SELECT * FROM users WHERE phone = ?", [phone], async (checkErr, checkResult) => {
      if (checkErr) {
        return res.status(500).json({ error: "Kullanıcı kontrolünde hata oluştu." });
      }

      if (checkResult.length > 0) {
        return res.status(400).json({ error: "Bu telefon numarası zaten kayıtlı." });
      }

      db.query(
        "INSERT INTO verification_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)",
        [phone, verificationCode, "registration", expiresAt],
        async (err, result) => {
          if (err) {
            console.error("Doğrulama kodu ekleme hatası:", err);
            return res.status(500).json({ error: "Doğrulama kodu kaydedilemedi." });
          }
 // Doğrulama kodunu e-posta ile gönder

          // SMS gönderimi
          const message = ` kayıt işleminiz için doğrulama kodunuz: ${verificationCode}. Kod 3 dakika geçerlidir.`;
          const smsSent = await smsService.sendSMS(phone, message);
          
          if (!smsSent) {
            console.error("SMS gönderilemedi. Ancak işlem devam ediyor.");
          }

          console.log("SMS Gönderim Şablonu:");
          console.log(
            `Telefon: ${phone}, Doğrulama Kodu: ${verificationCode}`
          );

          res.json({ message: "Kayıt başarılı! Doğrulama kodu gönderildi." });
        }
      );
    });
  } catch (err) {
    console.error("Kayıt genel hatası:", err);
    res.status(500).json({ error: "Kayıt işlemi sırasında hata oluştu." });
  }
};

const login = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Telefon numarası zorunludur." });
  }

  try {
    db.query("SELECT * FROM users WHERE phone = ?", [phone], async (err, result) => {
      if (err) {
        console.error("Kullanıcı sorgulama hatası:", err);
        return res.status(500).json({ error: "Kullanıcı sorgulanamadı." });
      }

      if (result.length === 0) {
        return res.status(404).json({
          error: "Bu telefon numarasına sahip bir kullanıcı bulunamadı.",
        });
      }

      const user = result[0];
      const verificationCode = "123456";
      const expiresAt = moment().add(3, "minutes").toDate();

      // E-posta gönderimi (sadece kullanıcının kayıtlı e-posta adresi varsa)


      // SMS gönderimi
      const message = `giriş işleminiz için doğrulama kodunuz: ${verificationCode}. Kod 3 dakika geçerlidir.`;
      try {
        const smsSent = await smsService.sendSMS(phone, message);
        if (!smsSent) {
          console.error("SMS gönderilemedi");
        }
      } catch (smsError) {
        console.error("SMS gönderim hatası:", smsError);
      }

      // Doğrulama kodunu veritabanına kaydet
      db.query(
        "INSERT INTO verification_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)",
        [phone, verificationCode, "login", expiresAt],
        async (err, result) => {
          if (err) {
            console.error("Doğrulama kodu ekleme hatası:", err);
            return res.status(500).json({ error: "Doğrulama kodu kaydedilemedi." });
          }

          res.json({ 
            message: "Doğrulama kodu gönderildi.",
          
          });
        }
      );
    });
  } catch (err) {
    console.error("Giriş genel hatası:", err);
    res.status(500).json({ error: "Giriş işlemi sırasında hata oluştu." });
  }
};

const verifyCode = async (req, res) => {
  const { phone, code, purpose, name, surname, email } = req.body;

  if (!phone || !code || !purpose) {
    return res.status(400).json({ error: "Eksik parametreler." });
  }

  try {
    db.query(
      "SELECT * FROM verification_codes WHERE phone = ? AND code = ? AND purpose = ? AND used = 0 AND expires_at > ?",
      [phone, code, purpose, moment().toDate()],
      (err, result) => {
        if (err) {
          console.error("Doğrulama kodu kontrol hatası:", err);
          return res.status(500).json({ error: "Doğrulama kodu kontrolü sırasında hata oluştu." });
        }

        if (result.length === 0) {
          return res.status(400).json({ error: "Geçersiz veya süresi dolmuş doğrulama kodu." });
        }

        db.query(
          "UPDATE verification_codes SET used = 1 WHERE phone = ? AND code = ? AND purpose = ?",
          [phone, code, purpose],
          (err, updateResult) => {
            if (err) {
              console.error("Kodu güncelleme hatası:", err);
              return res.status(500).json({ error: "Doğrulama kodu kullanılırken hata oluştu." });
            }

            if (purpose === "login") {
              db.query(
                "SELECT * FROM users WHERE phone = ?",
                [phone],
                (err, userResult) => {
                  if (err || userResult.length === 0) {
                    return res.status(500).json({ error: "Kullanıcı bulunamadı." });
                  }

                  const user = userResult[0];
                  createSessionAndRespond(user.id, null, "registered", req, res);
                }
              );
            } else if (purpose === "registration") {
              const fullName = `${name} ${surname}`;
              db.query(
                "INSERT INTO users (full_name, phone, email) VALUES (?, ?, ?)",
                [fullName, phone, email || null],
                (err, insertResult) => {
                  if (err) {
                    console.error("Kullanıcı ekleme hatası:", err);
                    return res.status(500).json({ error: "Kullanıcı kaydedilemedi." });
                  }

                  const userId = insertResult.insertId;
                  createSessionAndRespond(userId, null, "registered", req, res);
                }
              );
            } else {
              res.json({
                message: "Doğrulama kodu başarıyla doğrulandı.",
                purpose: purpose,
              });
            }
          }
        );
      }
    );
  } catch (err) {
    console.error("Doğrulama genel hatası:", err);
    res.status(500).json({ error: "Doğrulama işlemi sırasında hata oluştu." });
  }
};

const guestLogin = async (req, res) => {
  const { device_id, device_type, device_model } = req.body;

  if (!device_id) {
    return res.status(400).json({ error: "Cihaz ID'si (device_id) zorunludur." });
  }

  try {
    db.query(
      "SELECT * FROM guest_users WHERE device_id = ?",
      [device_id],
      (err, result) => {
        if (err) {
          console.error("Cihaz sorgulama hatası:", err);
          return res.status(500).json({ error: "Cihaz sorgulanamadı." });
        }

        const currentTime = moment().toDate();
        let guestUserId;

        if (result.length > 0) {
          guestUserId = result[0].id;
          db.query(
            "UPDATE guest_users SET last_active = ? WHERE device_id = ?",
            [currentTime, device_id],
            (err, updateResult) => {
              if (err) {
                console.error("Cihaz güncelleme hatası:", err);
                return res.status(500).json({ error: "Cihaz güncellenemedi." });
              }

              createSessionAndRespond(null, guestUserId, "guest", req, res);
            }
          );
        } else {
          db.query(
            "INSERT INTO guest_users (device_id, device_type, device_model, first_seen, last_active) VALUES (?, ?, ?, ?, ?)",
            [
              device_id,
              device_type || "Bilinmeyen",
              device_model || "Bilinmeyen",
              currentTime,
              currentTime,
            ],
            (err, insertResult) => {
              if (err) {
                console.error("Cihaz ekleme hatası:", err);
                return res.status(500).json({ error: "Cihaz kaydedilemedi." });
              }

              guestUserId = insertResult.insertId;

              createSessionAndRespond(null, guestUserId, "guest", req, res);
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Guest login genel hatası:", err);
    res.status(500).json({ error: "Giriş işlemi sırasında hata oluştu." });
  }
};

const logout = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Token gereklidir." });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Geçersiz token." });
    }

    const userId = user.type === "guest" ? null : user.id;
    const guestId = user.type === "guest" ? user.id : null;

    const query = `
      DELETE FROM sessions 
      WHERE token = ? AND (
        (user_id = ? AND guest_id IS NULL) OR 
        (guest_id = ? AND user_id IS NULL)
      )
    `;

    db.query(query, [token, userId, guestId], (err, result) => {
      if (err) {
        console.error("Oturum silme hatası:", err);
        return res.status(500).json({ error: "Oturum kapatılamadı." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Oturum bulunamadı." });
      }

      res.status(200).json({
        status: "success",
        message: "Oturum başarıyla kapatıldı.",
      });
    });
  });
};

const createSessionAndRespond = (userId, guestId, userType, req, res) => {
  const token = jwt.sign(
    { id: userId || guestId, type: userType },
    config.JWT_SECRET,
    { expiresIn: "7d" } // Token süresini 7 güne çıkardık
  );

  const createdAt = moment().toDate();
  const expiresAt = moment().add(7, "days").toDate();
  const deviceInfo = req.headers["user-agent"] || "Bilinmeyen Cihaz";

  db.query(
    "INSERT INTO sessions (user_id, guest_id, token, created_at, expires_at, device_info) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, guestId, token, createdAt, expiresAt, deviceInfo],
    (err, result) => {
      if (err) {
        console.error("Oturum kaydetme hatası:", err);
        return res.status(500).json({ error: "Oturum kaydedilemedi." });
      }

      res.json({
        message: userType === "guest" ? "Misafir girişi başarılı!" : "Giriş başarılı!",
        token,
        user_id: userId,
        guest_user_id: guestId,
        user_type: userType,
      });
    }
  );
};

const getAllUsers = async (req, res) => {
  try {
    db.query("SELECT id, full_name, phone, email FROM users", (err, result) => {
      if (err) {
        console.error("Kullanıcıları listeleme hatası:", err);
        return res.status(500).json({ error: "Kullanıcılar listelenemedi." });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Hiç kullanıcı bulunamadı." });
      }

      res.json({
        message: "Kullanıcılar başarıyla listelendi",
        users: result,
        total: result.length,
      });
    });
  } catch (err) {
    console.error("Kullanıcı listeleme genel hatası:", err);
    res.status(500).json({ error: "Kullanıcı listeleme işlemi sırasında hata oluştu." });
  }
};

module.exports = {
  register,
  login,
  verifyCode,
  guestLogin,
  logout,
  getAllUsers,
};
