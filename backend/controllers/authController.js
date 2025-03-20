const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const config = require("../config/config");
const moment = require("moment");

exports.register = async (req, res) => {
  const { name, surname, phone, email } = req.body;
  const fullName = `${name} ${surname}`;

  try {
    db.query(
      "INSERT INTO users (full_name, phone, email) VALUES (?, ?, ?)",
      [fullName, phone, email],
      (err, result) => {
        if (err) {
          console.error("Kullanıcı ekleme hatası:", err);
          return res.status(500).json({ error: "Kullanıcı kaydedilemedi.." });
        }

        res.json({ message: "Kayıt başarılı!" });
      }
    );
  } catch (err) {
    console.error("Kayıt genel hatası:", err);
    res.status(500).json({ error: "Kayıt işlemi sırasında hata oluştu." });
  }
};

exports.login = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Telefon numarası zorunludur." });
  }

  try {
    db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, result) => {
      if (err) {
        console.error("Kullanıcı sorgulama hatası:", err);
        return res.status(500).json({ error: "Kullanıcı sorgulanamadı." });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Bu telefon numarasına sahip bir kullanıcı bulunamadı." });
      }

      const verificationCode = "123456";
      const expiresAt = moment().add(3, "minutes").toDate();

      db.query(
        "INSERT INTO verification_codes (phone, code, purpose, expires_at) VALUES (?, ?, ?, ?)",
        [phone, verificationCode, "login", expiresAt],
        (err, result) => {
          if (err) {
            console.error("Doğrulama kodu ekleme hatası:", err);
            return res.status(500).json({ error: "Doğrulama kodu kaydedilemedi." });
          }

          console.log("SMS Gönderim Şablonu:");
          console.log(`Telefon: ${phone}, Doğrulama Kodu: ${verificationCode}`);

          res.json({ message: "Doğrulama kodu gönderildi." });
        }
      );
    });
  } catch (err) {
    console.error("Giriş genel hatası:", err);
    res.status(500).json({ error: "Giriş işlemi sırasında hata oluştu." });
  }
};

exports.verifyCode = async (req, res) => {
  const { phone, code } = req.body;

  try {
    db.query(
      "SELECT * FROM verification_codes WHERE phone = ? AND code = ? AND purpose = ? AND used = 0 AND expires_at > ?",
      [phone, code, "login", moment().toDate()],
      (err, result) => {
        if (err) {
          console.error("Doğrulama kodu kontrol hatası:", err);
          return res.status(500).json({ error: "Doğrulama kodu kontrolü sırasında hata oluştu." });
        }

        if (result.length === 0) {
          return res.status(400).json({ error: "Geçersiz veya süresi dolmuş doğrulama kodu." });
        }

        db.query(
          "UPDATE verification_codes SET used = 1 WHERE phone = ? AND code = ?",
          [phone, code],
          (err, result) => {
            if (err) {
              console.error("Kodu güncelleme hatası:", err);
              return res.status(500).json({ error: "Doğrulama kodu kullanılırken hata oluştu." });
            }

            db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, userResult) => {
              if (err || userResult.length === 0) {
                return res.status(500).json({ error: "Kullanıcı bulunamadı." });
              }

              const user = userResult[0];
              const token = jwt.sign({ id: user.id, phone: user.phone }, config.JWT_SECRET, { expiresIn: "1h" });

              const createdAt = moment().toDate();
              const expiresAt = moment().add(1, "hours").toDate();
              const deviceInfo = req.headers["user-agent"] || "Bilinmeyen Cihaz";

              db.query(
                "INSERT INTO sessions (user_id, token, created_at, expires_at, device_info) VALUES (?, ?, ?, ?, ?)",
                [user.id, token, createdAt, expiresAt, deviceInfo],
                (err, result) => {
                  if (err) {
                    console.error("Oturum kaydetme hatası:", err);
                    return res.status(500).json({ error: "Oturum kaydedilemedi." });
                  }

                  res.json({ message: "Giriş başarılı!", token, user_id: user.id });
                }
              );
            });
          }
        );
      }
    );
  } catch (err) {
    console.error("Doğrulama genel hatası:", err);
    res.status(500).json({ error: "Doğrulama işlemi sırasında hata oluştu." });
  }
};

// Yeni fonksiyon: Üye olmadan giriş (Guest Login)
exports.guestLogin = async (req, res) => {
  const { device_id, device_type, device_model } = req.body;

  // Gerekli alanların kontrolü
  if (!device_id) {
    return res.status(400).json({ error: "Cihaz ID'si (device_id) zorunludur." });
  }

  try {
    // Cihazın daha önce kaydedilip kaydedilmediğini kontrol et
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
          // Cihaz zaten kayıtlı, last_active tarihini güncelle
          guestUserId = result[0].id;
          db.query(
            "UPDATE guest_users SET last_active = ? WHERE device_id = ?",
            [currentTime, device_id],
            (err, updateResult) => {
              if (err) {
                console.error("Cihaz güncelleme hatası:", err);
                return res.status(500).json({ error: "Cihaz güncellenemedi." });
              }

              // Token oluştur ve sessions tablosuna kaydet
              createSessionAndRespond(guestUserId, req, res);
            }
          );
        } else {
          // Yeni cihaz, guest_users tablosuna ekle
          db.query(
            "INSERT INTO guest_users (device_id, device_type, device_model, first_seen, last_active) VALUES (?, ?, ?, ?, ?)",
            [device_id, device_type || "Bilinmeyen", device_model || "Bilinmeyen", currentTime, currentTime],
            (err, insertResult) => {
              if (err) {
                console.error("Cihaz ekleme hatası:", err);
                return res.status(500).json({ error: "Cihaz kaydedilemedi." });
              }

              guestUserId = insertResult.insertId;

              // Token oluştur ve sessions tablosuna kaydet
              createSessionAndRespond(guestUserId, req, res);
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

// Yardımcı fonksiyon: Token oluştur ve sessions tablosuna kaydet
const createSessionAndRespond = (guestUserId, req, res) => {
  const token = jwt.sign({ id: guestUserId, type: "guest" }, config.JWT_SECRET, { expiresIn: "1h" });

  const createdAt = moment().toDate();
  const expiresAt = moment().add(1, "hours").toDate();
  const deviceInfo = req.headers["user-agent"] || "Bilinmeyen Cihaz";

  db.query(
    "INSERT INTO sessions (user_id, token, created_at, expires_at, device_info) VALUES (?, ?, ?, ?, ?)",
    [guestUserId, token, createdAt, expiresAt, deviceInfo],
    (err, result) => {
      if (err) {
        console.error("Oturum kaydetme hatası:", err);
        return res.status(500).json({ error: "Oturum kaydedilemedi." });
      }

      res.json({ message: "Misafir girişi başarılı!", token, guest_user_id: guestUserId });
    }
  );
};