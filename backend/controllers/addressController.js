const db = require("../config/db");

exports.addAddress = async (req, res) => {
  const { user_id, user_type, title, city, district, neighborhood, street, address_detail, is_default, guest_id } = req.body;

  if (!title || !city || !district || !neighborhood || !street) {
    return res.status(400).json({ error: "Zorunlu alanlar eksik." });
  }

  if (!user_type || !["registered", "guest"].includes(user_type)) {
    return res.status(400).json({ error: "Geçersiz kullanıcı tipi. 'registered' veya 'guest' olmalı." });
  }

  if (user_type === "registered" && !user_id) {
    return res.status(400).json({ error: "Kayıtlı kullanıcı için user_id zorunludur." });
  }
  if (user_type === "guest" && !guest_id) {
    return res.status(400).json({ error: "Misafir kullanıcı için guest_id zorunludur." });
  }

  try {
    if (is_default) {
      const updateQuery = user_type === "registered"
        ? "UPDATE addresses SET is_default = 0 WHERE user_id = ?"
        : "UPDATE addresses SET is_default = 0 WHERE guest_id = ?";
      const updateId = user_type === "registered" ? user_id : guest_id;

      db.query(updateQuery, [updateId], (err) => {
        if (err) {
          console.error("Varsayılan adres güncelleme hatası:", err);
          return res.status(500).json({ error: "Varsayılan adres güncellenemedi." });
        }
      });
    }

    db.query(
      "INSERT INTO addresses (user_id, user_type, title, city, district, neighborhood, street, address_detail, is_default, guest_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_type === "registered" ? user_id : null,
        user_type,
        title,
        city,
        district,
        neighborhood,
        street,
        address_detail || null,
        is_default || 0,
        user_type === "guest" ? guest_id : null,
      ],
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
  const { user_id, user_type, guest_id } = req.query;

  if (!user_type || !["registered", "guest"].includes(user_type)) {
    return res.status(400).json({ error: "Geçersiz kullanıcı tipi. 'registered' veya 'guest' olmalı." });
  }

  if (user_type === "registered" && !user_id) {
    return res.status(400).json({ error: "Kayıtlı kullanıcı için user_id zorunludur." });
  }
  if (user_type === "guest" && !guest_id) {
    return res.status(400).json({ error: "Misafir kullanıcı için guest_id zorunludur." });
  }

  try {
    const query = user_type === "registered"
      ? "SELECT * FROM addresses WHERE user_id = ?"
      : "SELECT * FROM addresses WHERE guest_id = ?";
    const queryId = user_type === "registered" ? user_id : guest_id;

    db.query(query, [queryId], (err, result) => {
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

  if (!id || !user_type) {
    return res.status(400).json({ error: "Adres ID'si ve kullanıcı tipi zorunludur." });
  }

  if (!["registered", "guest"].includes(user_type)) {
    return res.status(400).json({ error: "Geçersiz kullanıcı tipi. 'registered' veya 'guest' olmalı." });
  }

  if (user_type === "registered" && !user_id) {
    return res.status(400).json({ error: "Kayıtlı kullanıcı için user_id zorunludur." });
  }
  if (user_type === "guest" && !guest_id) {
    return res.status(400).json({ error: "Misafir kullanıcı için guest_id zorunludur." });
  }

  try {
    if (is_default) {
      const updateQuery = user_type === "registered"
        ? "UPDATE addresses SET is_default = 0 WHERE user_id = ?"
        : "UPDATE addresses SET is_default = 0 WHERE guest_id = ?";
      const updateId = user_type === "registered" ? user_id : guest_id;

      db.query(updateQuery, [updateId], (err) => {
        if (err) {
          console.error("Varsayılan adres güncelleme hatası:", err);
          return res.status(500).json({ error: "Varsayılan adres güncellenemedi." });
        }
      });
    }

    const query = user_type === "registered"
      ? "UPDATE addresses SET user_type = ?, title = ?, city = ?, district = ?, neighborhood = ?, street = ?, address_detail = ?, is_default = ?, guest_id = ? WHERE id = ? AND user_id = ?"
      : "UPDATE addresses SET user_type = ?, title = ?, city = ?, district = ?, neighborhood = ?, street = ?, address_detail = ?, is_default = ?, guest_id = ? WHERE id = ? AND guest_id = ?";

    const values = [
      user_type,
      title,
      city,
      district,
      neighborhood,
      street,
      address_detail || null,
      is_default || 0,
      user_type === "guest" ? guest_id : null,
      id,
      user_type === "registered" ? user_id : guest_id,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Adres güncelleme hatası:", err);
        return res.status(500).json({ error: "Adres güncellenemedi." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Adres bulunamadı veya kullanıcıya ait değil." });
      }

      res.json({ message: "Adres başarıyla güncellendi." });
    });
  } catch (err) {
    console.error("Adres güncelleme genel hatası:", err);
    res.status(500).json({ error: "Adres güncelleme işlemi sırasında hata oluştu." });
  }
};

exports.deleteAddress = async (req, res) => {
  const { id } = req.params;
  const { user_id, user_type, guest_id } = req.query;

  if (!id || !user_type) {
    return res.status(400).json({ error: "Adres ID'si ve kullanıcı tipi zorunludur." });
  }

  if (!["registered", "guest"].includes(user_type)) {
    return res.status(400).json({ error: "Geçersiz kullanıcı tipi. 'registered' veya 'guest' olmalı." });
  }

  if (user_type === "registered" && !user_id) {
    return res.status(400).json({ error: "Kayıtlı kullanıcı için user_id zorunludur." });
  }
  if (user_type === "guest" && !guest_id) {
    return res.status(400).json({ error: "Misafir kullanıcı için guest_id zorunludur." });
  }

  try {
    const query = user_type === "registered"
      ? "DELETE FROM addresses WHERE id = ? AND user_id = ?"
      : "DELETE FROM addresses WHERE id = ? AND guest_id = ?";

    const queryId = user_type === "registered" ? user_id : guest_id;

    db.query(query, [id, queryId], (err, result) => {
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