const db = require("../config/db");

// Tüm aktif bölgeleri getiren metot
exports.getAllRegions = (req, res) => {
  try {
    // Bölgeleri ve ilçeleri getirecek sorgu
    const query = `
      SELECT 
          r.id AS region_id, 
          r.name AS region_name, 
          d.id AS district_id, 
          d.name AS district_name,
          n.id AS neighborhood_id,
          n.name AS neighborhood_name,
          s.id AS street_id,
          s.name AS street_name
      FROM 
          regions r
      LEFT JOIN 
          districts d ON d.region_id = r.id
      LEFT JOIN 
          neighborhoods n ON n.district_id = d.id
      LEFT JOIN 
          streets s ON s.neighborhood_id = n.id
      WHERE 
          r.is_active = TRUE 
          AND d.is_active = TRUE 
          AND n.is_active = TRUE
      ORDER BY 
          r.name, d.name, n.name, s.name
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Bölge bilgileri getirme hatası:", err);
        return res.status(500).json({ 
          error: "Bölge bilgileri alınamadı",
          details: err.message 
        });
      }

      // Sonuçları yapılandır
      const regions = {};
      results.forEach(row => {
        if (!regions[row.region_name]) {
          regions[row.region_name] = {};
        }
        if (!regions[row.region_name][row.district_name]) {
          regions[row.region_name][row.district_name] = {};
        }
        if (!regions[row.region_name][row.district_name][row.neighborhood_name]) {
          regions[row.region_name][row.district_name][row.neighborhood_name] = [];
        }
        if (row.street_name) {
          regions[row.region_name][row.district_name][row.neighborhood_name].push(row.street_name);
        }
      });

      res.status(200).json({
        status: "success",
        data: regions
      });
    });
  } catch (error) {
    console.error("Bölge bilgileri getirme hatası:", error);
    res.status(500).json({ 
      error: "Bölge bilgileri alınamadı",
      details: error.message 
    });
  }
};

exports.addAddress = async (req, res) => {
  console.log("addAddress çağrıldı, req.body:", req.body);
  console.log("addAddress çağrıldı, req.user:", req.user);
  
  // Kullanıcı JWT'den gelen bilgiler
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Yetkisiz erişim." });
  }
  
  // Body'den gelen adres bilgileri
  const { title, city, district, neighborhood, street, address_detail, is_default } = req.body;
  
  // Zorunlu alanlar
  if (!title || !city || !district || !neighborhood || !street) {
    return res.status(400).json({ error: "Zorunlu alanlar eksik. (Başlık, şehir, ilçe, mahalle, sokak)" });
  }
  
  // Kullanıcı tipine göre ID belirleme
  const user_id = user.type === "registered" ? user.id : null;
  const guest_id = user.type === "guest" ? user.id : null;
  const user_type = user.type;
  
  try {
    console.log("Adres ekleniyor:", {
      user_id, guest_id, user_type, title, city, district, neighborhood, street
    });
    
    // Eğer yeni adres varsayılan ise, diğer adreslerin varsayılan durumunu kaldır
    if (is_default) {
      const updateQuery = user_type === "registered"
        ? "UPDATE addresses SET is_default = 0 WHERE user_id = ?"
        : "UPDATE addresses SET is_default = 0 WHERE guest_id = ?";
      const updateId = user_type === "registered" ? user_id : guest_id;

      await new Promise((resolve, reject) => {
        db.query(updateQuery, [updateId], (err) => {
          if (err) {
            console.error("Varsayılan adres güncelleme hatası:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    // Yeni adresi ekle
    const insertQuery = `
      INSERT INTO addresses (
        user_id, user_type, title, city, district, neighborhood, street, 
        address_detail, is_default, guest_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      user_id,
      user_type,
      title,
      city,
      district,
      neighborhood,
      street,
      address_detail || null,
      is_default ? 1 : 0,
      guest_id
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Adres ekleme hatası:", err);
        return res.status(500).json({ error: "Adres eklenemedi: " + err.message });
      }

      res.status(201).json({ 
        message: "Adres başarıyla eklendi.", 
        address_id: result.insertId 
      });
    });
  } catch (err) {
    console.error("Adres ekleme genel hatası:", err);
    res.status(500).json({ error: "Adres ekleme işlemi sırasında hata oluştu." });
  }
};

exports.getAddresses = async (req, res) => {
  console.log("getAddresses çağrıldı, req.query:", req.query);
  console.log("getAddresses çağrıldı, req.user:", req.user);
  
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Yetkisiz erişim." });
  }
  
  const user_id = user.type === "registered" ? user.id : null;
  const guest_id = user.type === "guest" ? user.id : null;
  const user_type = user.type;
  
  console.log("Adresler sorgulanıyor:", { user_id, guest_id, user_type });

  try {
    const query = user_type === "registered"
      ? "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC"
      : "SELECT * FROM addresses WHERE guest_id = ? ORDER BY is_default DESC, id DESC";
    
    const queryId = user_type === "registered" ? user_id : guest_id;
    
    console.log("SQL sorgusu:", query);
    console.log("SQL parametre:", queryId);

    db.query(query, [queryId], (err, result) => {
      if (err) {
        console.error("Adres listeleme hatası:", err);
        return res.status(500).json({ error: "Adresler listelenemedi: " + err.message });
      }

      console.log(`${result.length} adres bulundu.`);
      res.json({ addresses: result });
    });
  } catch (err) {
    console.error("Adres listeleme genel hatası:", err);
    res.status(500).json({ error: "Adres listeleme işlemi sırasında hata oluştu." });
  }
};

exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  console.log("updateAddress çağrıldı, id:", id);
  console.log("updateAddress çağrıldı, req.body:", req.body);
  
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Yetkisiz erişim." });
  }
  
  const { title, city, district, neighborhood, street, address_detail, is_default } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: "Adres ID'si zorunludur." });
  }
  
  const user_id = user.type === "registered" ? user.id : null;
  const guest_id = user.type === "guest" ? user.id : null;
  const user_type = user.type;

  try {
    if (is_default) {
      const updateQuery = user_type === "registered"
        ? "UPDATE addresses SET is_default = 0 WHERE user_id = ?"
        : "UPDATE addresses SET is_default = 0 WHERE guest_id = ?";
      const updateId = user_type === "registered" ? user_id : guest_id;

      await new Promise((resolve, reject) => {
        db.query(updateQuery, [updateId], (err) => {
          if (err) {
            console.error("Varsayılan adres güncelleme hatası:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    const query = user_type === "registered"
      ? "UPDATE addresses SET title = ?, city = ?, district = ?, neighborhood = ?, street = ?, address_detail = ?, is_default = ? WHERE id = ? AND user_id = ?"
      : "UPDATE addresses SET title = ?, city = ?, district = ?, neighborhood = ?, street = ?, address_detail = ?, is_default = ? WHERE id = ? AND guest_id = ?";

    const values = [
      title,
      city,
      district,
      neighborhood,
      street,
      address_detail || null,
      is_default ? 1 : 0,
      id,
      user_type === "registered" ? user_id : guest_id
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Adres güncelleme hatası:", err);
        return res.status(500).json({ error: "Adres güncellenemedi: " + err.message });
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
  console.log("deleteAddress çağrıldı, id:", id);
  
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Yetkisiz erişim." });
  }
  
  if (!id) {
    return res.status(400).json({ error: "Adres ID'si zorunludur." });
  }
  
  const user_id = user.type === "registered" ? user.id : null;
  const guest_id = user.type === "guest" ? user.id : null;
  const user_type = user.type;

  try {
    const query = user_type === "registered"
      ? "DELETE FROM addresses WHERE id = ? AND user_id = ?"
      : "DELETE FROM addresses WHERE id = ? AND guest_id = ?";

    const queryId = user_type === "registered" ? user_id : guest_id;

    db.query(query, [id, queryId], (err, result) => {
      if (err) {
        console.error("Adres silme hatası:", err);
        return res.status(500).json({ error: "Adres silinemedi: " + err.message });
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

// Tüm fonksiyonları export et
module.exports = {
  getAllRegions: exports.getAllRegions,
  addAddress: exports.addAddress,
  getAddresses: exports.getAddresses,
  updateAddress: exports.updateAddress,
  deleteAddress: exports.deleteAddress
};