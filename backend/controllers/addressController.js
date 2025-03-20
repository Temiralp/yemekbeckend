const db = require("../config/db");

exports.addAddress = async (req, res) => {
  const { user_id, user_type, title, city, district, neighborhood, street, address_detail, is_default, guest_id } = req.body;

  if (!user_id || !title || !city || !district || !neighborhood || !street) {
    return res.status(400).json({ error: "Zorunlu alanlar eksik." });
  }

  try {
    if (is_default) {
      db.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [user_id], (err) => {
        if (err) {
          console.error("Varsayılan adres güncelleme hatası:", err);
          return res.status(500).json({ error: "Varsayılan adres güncellenemedi." });
        }
      });
    }

    db.query(
      "INSERT INTO addresses (user_id, user_type, title, city, district, neighborhood, street, address_detail, is_default, guest_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, user_type || "registered", title, city, district, neighborhood, street, address_detail, is_default || 0, guest_id || null],
      (err, result) => {
        if (err) {
          console.error("Adres ekleme hatası:", err);
          return res.status(500).json({ error: "Adres eklenemedi." });
        }

        res.status(201).json({ message: "Adres başarıyla eklendi.", address_id: result.insertId });
      }
    );
  } catch (err) {
    console.error("Adres ekleme genel hatası:", err);
    res.status(500).json({ error: "Adres ekleme işlemi sırasında hata oluştu." });
  }
};

exports.getAddresses = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Kullanıcı ID'si zorunludur." });
  }

  try {
    db.query("SELECT * FROM addresses WHERE user_id = ?", [user_id], (err, result) => {
      if (err) {
        console.error("Adres listeleme hatası:", err);
        return res.status(500).json({ error: "Adresler listelenemedi." });
      }

      res.json({ addresses: result });
    });
  } catch (err) {
    console.error("Adres listeleme genel hatası:", err);
    res.status(500).json({ error: "Adres listeleme işlemi sırasında hata oluştu." });
  }
};

exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  const { user_id, user_type, title, city, district, neighborhood, street, address_detail, is_default, guest_id } = req.body;

  if (!id || !user_id) {
    return res.status(400).json({ error: "Adres ID'si ve kullanıcı ID'si zorunludur." });
  }

  try {
    if (is_default) {
      db.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [user_id], (err) => {
        if (err) {
          console.error("Varsayılan adres güncelleme hatası:", err);
          return res.status(500).json({ error: "Varsayılan adres güncellenemedi." });
        }
      });
    }

    db.query(
      "UPDATE addresses SET user_type = ?, title = ?, city = ?, district = ?, neighborhood = ?, street = ?, address_detail = ?, is_default = ?, guest_id = ? WHERE id = ? AND user_id = ?",
      [user_type || "registered", title, city, district, neighborhood, street, address_detail, is_default || 0, guest_id || null, id, user_id],
      (err, result) => {
        if (err) {
          console.error("Adres güncelleme hatası:", err);
          return res.status(500).json({ error: "Adres güncellenemedi." });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Adres bulunamadı veya kullanıcıya ait değil." });
        }

        res.json({ message: "Adres başarıyla güncellendi." });
      }
    );
  } catch (err) {
    console.error("Adres güncelleme genel hatası:", err);
    res.status(500).json({ error: "Adres güncelleme işlemi sırasında hata oluştu." });
  }
};

exports.deleteAddress = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;

  if (!id || !user_id) {
    return res.status(400).json({ error: "Adres ID'si ve kullanıcı ID'si zorunludur." });
  }

  try {
    db.query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [id, user_id], (err, result) => {
      if (err) {
        console.error("Adres silme hatası:", err);
        return res.status(500).json({ error: "Adres silinemedi." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Adres bulunamadı veya kullanıcıya ait değil." });
      }

      res.json({ message: "Adres başarıyla silindi." });
    });
  } catch (err) {
    console.error("Adres silme genel hatası:", err);
    res.status(500).json({ error: "Adres silme işlemi sırasında hata oluştu." });
  }
};