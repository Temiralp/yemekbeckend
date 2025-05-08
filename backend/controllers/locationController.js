const db = require("../config/db");

// BÖLGE FONKSİYONLARI
// Tüm bölgeleri getir
const getAllRegions = (req, res) => {
  db.query("SELECT * FROM regions ", (err, results) => {
    if (err) {
      console.error("Bölge sorgulama hatası:", err);
      return res.status(500).json({ error: "Bölgeler listelenemedi." });
    }
    
    res.json({
      status: "success",
      data: results
    });
  });
};

// Belirli bir bölgeyi getir
const getRegionById = (req, res) => {
  const regionId = req.params.id;
  
  db.query("SELECT * FROM regions WHERE id = ?", [regionId], (err, results) => {
    if (err) {
      console.error("Bölge sorgulama hatası:", err);
      return res.status(500).json({ error: "Bölge bilgisi alınamadı." });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Bölge bulunamadı." });
    }
    
    res.json({
      status: "success",
      data: results[0]
    });
  });
};

// Yeni bölge ekle
const addRegion = (req, res) => {
  const { name, is_active } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Bölge adı zorunludur." });
  }
  
  const isActiveValue = is_active === undefined ? 1 : is_active;
  
  db.query(
    "INSERT INTO regions (name, is_active) VALUES (?, ?)",
    [name, isActiveValue],
    (err, result) => {
      if (err) {
        console.error("Bölge ekleme hatası:", err);
        return res.status(500).json({ error: "Bölge eklenemedi." });
      }
      
      res.status(201).json({
        status: "success",
        message: "Bölge başarıyla eklendi.",
        data: { id: result.insertId, name, is_active: isActiveValue }
      });
    }
  );
};

// Bölge güncelleme
const updateRegion = (req, res) => {
  const regionId = req.params.id;
  const { name, is_active } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Bölge adı zorunludur." });
  }
  
  db.query(
    "UPDATE regions SET name = ?, is_active = ? WHERE id = ?",
    [name, is_active, regionId],
    (err, result) => {
      if (err) {
        console.error("Bölge güncelleme hatası:", err);
        return res.status(500).json({ error: "Bölge güncellenemedi." });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Bölge bulunamadı." });
      }
      
      res.json({
        status: "success",
        message: "Bölge başarıyla güncellendi."
      });
    }
  );
};

// Bölge silme
const deleteRegion = (req, res) => {
  const regionId = req.params.id;
  
  // Önce bölgeye bağlı ilçe olup olmadığını kontrol et
  db.query("SELECT * FROM districts WHERE region_id = ?", [regionId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("İlçe kontrolü hatası:", checkErr);
      return res.status(500).json({ error: "Bölge silinemedi." });
    }
    
    if (checkResult.length > 0) {
      return res.status(400).json({ 
        error: "Bu bölgeye bağlı ilçeler bulunmaktadır. Önce ilçeleri silmelisiniz." 
      });
    }
    
    // Bölgeyi sil
    db.query("DELETE FROM regions WHERE id = ?", [regionId], (err, result) => {
      if (err) {
        console.error("Bölge silme hatası:", err);
        return res.status(500).json({ error: "Bölge silinemedi." });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Bölge bulunamadı." });
      }
      
      res.json({
        status: "success",
        message: "Bölge başarıyla silindi."
      });
    });
  });
};

// İLÇE FONKSİYONLARI
// Tüm ilçeleri getir
const getAllDistricts = (req, res) => {
  db.query(
    "SELECT d.*, r.name as region_name FROM districts d " +
    "LEFT JOIN regions r ON d.region_id = r.id",
    (err, results) => {
      if (err) {
        console.error("İlçe sorgulama hatası:", err);
        return res.status(500).json({ error: "İlçeler listelenemedi." });
      }
      
      res.json({
        status: "success",
        data: results
      });
    }
  );
};

// Belirli bir ilçeyi getir
const getDistrictById = (req, res) => {
  const districtId = req.params.id;
  
  db.query(
    "SELECT d.*, r.name as region_name FROM districts d " +
    "LEFT JOIN regions r ON d.region_id = r.id " +
    "WHERE d.id = ?",
    [districtId],
    (err, results) => {
      if (err) {
        console.error("İlçe sorgulama hatası:", err);
        return res.status(500).json({ error: "İlçe bilgisi alınamadı." });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: "İlçe bulunamadı." });
      }
      
      res.json({
        status: "success",
        data: results[0]
      });
    }
  );
};

// Yeni ilçe ekle
const addDistrict = (req, res) => {
  const { name, region_id, is_active } = req.body;
  
  if (!name || !region_id) {
    return res.status(400).json({ error: "İlçe adı ve bölge ID'si zorunludur." });
  }
  
  const isActiveValue = is_active === undefined ? 1 : is_active;
  
  // Önce böyle bir region_id olup olmadığını kontrol et
  db.query("SELECT * FROM regions WHERE id = ?", [region_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Bölge kontrolü hatası:", checkErr);
      return res.status(500).json({ error: "İlçe eklenemedi." });
    }
    
    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Belirtilen bölge bulunamadı." });
    }
    
    db.query(
      "INSERT INTO districts (name, region_id, is_active) VALUES (?, ?, ?)",
      [name, region_id, isActiveValue],
      (err, result) => {
        if (err) {
          console.error("İlçe ekleme hatası:", err);
          return res.status(500).json({ error: "İlçe eklenemedi." });
        }
        
        res.status(201).json({
          status: "success",
          message: "İlçe başarıyla eklendi.",
          data: { id: result.insertId, name, region_id, is_active: isActiveValue }
        });
      }
    );
  });
};

// İlçe güncelleme
const updateDistrict = (req, res) => {
  const districtId = req.params.id;
  const { name, region_id, is_active } = req.body;
  
  if (!name || !region_id) {
    return res.status(400).json({ error: "İlçe adı ve bölge ID'si zorunludur." });
  }
  
  // Önce böyle bir region_id olup olmadığını kontrol et
  db.query("SELECT * FROM regions WHERE id = ?", [region_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Bölge kontrolü hatası:", checkErr);
      return res.status(500).json({ error: "İlçe güncellenemedi." });
    }
    
    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Belirtilen bölge bulunamadı." });
    }
    
    db.query(
      "UPDATE districts SET name = ?, region_id = ?, is_active = ? WHERE id = ?",
      [name, region_id, is_active, districtId],
      (err, result) => {
        if (err) {
          console.error("İlçe güncelleme hatası:", err);
          return res.status(500).json({ error: "İlçe güncellenemedi." });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "İlçe bulunamadı." });
        }
        
        res.json({
          status: "success",
          message: "İlçe başarıyla güncellendi."
        });
      }
    );
  });
};

// İlçe silme
const deleteDistrict = (req, res) => {
  const districtId = req.params.id;
  
  // Önce ilçeye bağlı mahalle olup olmadığını kontrol et
  db.query("SELECT * FROM neighborhoods WHERE district_id = ?", [districtId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Mahalle kontrolü hatası:", checkErr);
      return res.status(500).json({ error: "İlçe silinemedi." });
    }
    
    if (checkResult.length > 0) {
      return res.status(400).json({ 
        error: "Bu ilçeye bağlı mahalleler bulunmaktadır. Önce mahalleleri silmelisiniz." 
      });
    }
    
    // İlçeyi sil
    db.query("DELETE FROM districts WHERE id = ?", [districtId], (err, result) => {
      if (err) {
        console.error("İlçe silme hatası:", err);
        return res.status(500).json({ error: "İlçe silinemedi." });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "İlçe bulunamadı." });
      }
      
      res.json({
        status: "success",
        message: "İlçe başarıyla silindi."
      });
    });
  });
};

// MAHALLE FONKSİYONLARI
// Bölgeye göre ilçeleri getir
const getDistrictsByRegionId = (req, res) => {
  const regionId = req.params.id;
  
  db.query(
    "SELECT * FROM districts WHERE region_id = ?",
    [regionId],
    (err, results) => {
      if (err) {
        console.error("İlçe sorgulama hatası:", err);
        return res.status(500).json({ error: "İlçeler listelenemedi." });
      }
      
      res.json({
        status: "success",
        data: results
      });
    }
  );
};

// Tüm mahalleleri getir
const getAllNeighborhoods = (req, res) => {
  db.query(
    "SELECT n.*, d.name as district_name FROM neighborhoods n " +
    "LEFT JOIN districts d ON n.district_id = d.id",
    (err, results) => {
      if (err) {
        console.error("Mahalle sorgulama hatası:", err);
        return res.status(500).json({ error: "Mahalleler listelenemedi." });
      }
      
      res.json({
        status: "success",
        data: results
      });
    }
  );
};

// Belirli bir mahalleyi getir
const getNeighborhoodById = (req, res) => {
  const neighborhoodId = req.params.id;
  
  db.query(
    "SELECT n.*, d.name as district_name FROM neighborhoods n " +
    "LEFT JOIN districts d ON n.district_id = d.id " +
    "WHERE n.id = ?",
    [neighborhoodId],
    (err, results) => {
      if (err) {
        console.error("Mahalle sorgulama hatası:", err);
        return res.status(500).json({ error: "Mahalle bilgisi alınamadı." });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: "Mahalle bulunamadı." });
      }
      
      res.json({
        status: "success",
        data: results[0]
      });
    }
  );
};

// İlçeye göre mahalleleri getir
const getNeighborhoodsByDistrictId = (req, res) => {
  const districtId = req.params.id;
  
  db.query(
    "SELECT * FROM neighborhoods WHERE district_id = ?",
    [districtId],
    (err, results) => {
      if (err) {
        console.error("Mahalle sorgulama hatası:", err);
        return res.status(500).json({ error: "Mahalleler listelenemedi." });
      }
      
      res.json({
        status: "success",
        data: results
      });
    }
  );
};

// Yeni mahalle ekle
const addNeighborhood = (req, res) => {
  const { name, district_id, is_active } = req.body;
  
  if (!name || !district_id) {
    return res.status(400).json({ error: "Mahalle adı ve ilçe ID'si zorunludur." });
  }
  
  const isActiveValue = is_active === undefined ? 1 : is_active;
  
  // Önce böyle bir district_id olup olmadığını kontrol et
  db.query("SELECT * FROM districts WHERE id = ?", [district_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("İlçe kontrolü hatası:", checkErr);
      return res.status(500).json({ error: "Mahalle eklenemedi." });
    }
    
    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Belirtilen ilçe bulunamadı." });
    }
    
    db.query(
      "INSERT INTO neighborhoods (name, district_id, is_active) VALUES (?, ?, ?)",
      [name, district_id, isActiveValue],
      (err, result) => {
        if (err) {
          console.error("Mahalle ekleme hatası:", err);
          return res.status(500).json({ error: "Mahalle eklenemedi." });
        }
        
        res.status(201).json({
          status: "success",
          message: "Mahalle başarıyla eklendi.",
          data: { id: result.insertId, name, district_id, is_active: isActiveValue }
        });
      }
    );
  });
};

// Mahalle güncelleme
const updateNeighborhood = (req, res) => {
  const neighborhoodId = req.params.id;
  const { name, district_id, is_active } = req.body;
  
  if (!name || !district_id) {
    return res.status(400).json({ error: "Mahalle adı ve ilçe ID'si zorunludur." });
  }
  
  // Önce böyle bir district_id olup olmadığını kontrol et
  db.query("SELECT * FROM districts WHERE id = ?", [district_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("İlçe kontrolü hatası:", checkErr);
      return res.status(500).json({ error: "Mahalle güncellenemedi." });
    }
    
    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Belirtilen ilçe bulunamadı." });
    }
    
    db.query(
      "UPDATE neighborhoods SET name = ?, district_id = ?, is_active = ? WHERE id = ?",
      [name, district_id, is_active, neighborhoodId],
      (err, result) => {
        if (err) {
          console.error("Mahalle güncelleme hatası:", err);
          return res.status(500).json({ error: "Mahalle güncellenemedi." });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Mahalle bulunamadı." });
        }
        
        res.json({
          status: "success",
          message: "Mahalle başarıyla güncellendi."
        });
      }
    );
  });
};

// Mahalle silme
const deleteNeighborhood = (req, res) => {
  const neighborhoodId = req.params.id;
  
  // Önce mahalleye bağlı sokak olup olmadığını kontrol et
  db.query("SELECT * FROM streets WHERE neighborhood_id = ?", [neighborhoodId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Sokak kontrolü hatası:", checkErr);
      return res.status(500).json({ error: "Mahalle silinemedi." });
    }
    
    if (checkResult.length > 0) {
      return res.status(400).json({ 
        error: "Bu mahalleye bağlı sokaklar bulunmaktadır. Önce sokakları silmelisiniz." 
      });
    }
    
    // Mahalleyi sil
    db.query("DELETE FROM neighborhoods WHERE id = ?", [neighborhoodId], (err, result) => {
      if (err) {
        console.error("Mahalle silme hatası:", err);
        return res.status(500).json({ error: "Mahalle silinemedi." });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Mahalle bulunamadı." });
      }
      
      res.json({
        status: "success",
        message: "Mahalle başarıyla silindi."
      });
    });
  });
};

// SOKAK FONKSİYONLARI
// Tüm sokakları getir
const getAllStreets = (req, res) => {
  db.query(
    "SELECT s.*, n.name as neighborhood_name FROM streets s " +
    "LEFT JOIN neighborhoods n ON s.neighborhood_id = n.id",
    (err, results) => {
      if (err) {
        console.error("Sokak sorgulama hatası:", err);
        return res.status(500).json({ error: "Sokaklar listelenemedi." });
      }
      
      res.json({
        status: "success",
        data: results
      });
    }
  );
};

// Belirli bir sokağı getir
const getStreetById = (req, res) => {
  const streetId = req.params.id;
  
  db.query(
    "SELECT s.*, n.name as neighborhood_name FROM streets s " +
    "LEFT JOIN neighborhoods n ON s.neighborhood_id = n.id " +
    "WHERE s.id = ?",
    [streetId],
    (err, results) => {
      if (err) {
        console.error("Sokak sorgulama hatası:", err);
        return res.status(500).json({ error: "Sokak bilgisi alınamadı." });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: "Sokak bulunamadı." });
      }
      
      res.json({
        status: "success",
        data: results[0]
      });
    }
  );
};

// Mahalleye göre sokakları getir
const getStreetsByNeighborhoodId = (req, res) => {
  const neighborhoodId = req.params.id;
  
  db.query(
    "SELECT * FROM streets WHERE neighborhood_id = ?",
    [neighborhoodId],
    (err, results) => {
      if (err) {
        console.error("Sokak sorgulama hatası:", err);
        return res.status(500).json({ error: "Sokaklar listelenemedi." });
      }
      
      res.json({
        status: "success",
        data: results
      });
    }
  );
};

// Yeni sokak ekle
const addStreet = (req, res) => {
  const { name, neighborhood_id, is_active } = req.body;
  
  if (!name || !neighborhood_id) {
    return res.status(400).json({ error: "Sokak adı ve mahalle ID'si zorunludur." });
  }
  
  const isActiveValue = is_active === undefined ? 1 : is_active;
  
  // Önce böyle bir neighborhood_id olup olmadığını kontrol et
  db.query("SELECT * FROM neighborhoods WHERE id = ?", [neighborhood_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Mahalle kontrolü hatası:", checkErr);
      return res.status(500).json({ error: "Sokak eklenemedi." });
    }
    
    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Belirtilen mahalle bulunamadı." });
    }
    
    db.query(
      "INSERT INTO streets (name, neighborhood_id, is_active) VALUES (?, ?, ?)",
      [name, neighborhood_id, isActiveValue],
      (err, result) => {
        if (err) {
          console.error("Sokak ekleme hatası:", err);
          return res.status(500).json({ error: "Sokak eklenemedi." });
        }
        
        res.status(201).json({
          status: "success",
          message: "Sokak başarıyla eklendi.",
          data: { id: result.insertId, name, neighborhood_id, is_active: isActiveValue }
        });
      }
    );
  });
};

// Sokak güncelleme
const updateStreet = (req, res) => {
  const streetId = req.params.id;
  const { name, neighborhood_id, is_active } = req.body;
  
  if (!name || !neighborhood_id) {
    return res.status(400).json({ error: "Sokak adı ve mahalle ID'si zorunludur." });
  }
  
  // Önce böyle bir neighborhood_id olup olmadığını kontrol et
  db.query("SELECT * FROM neighborhoods WHERE id = ?", [neighborhood_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Mahalle kontrolü hatası:", checkErr);
      return res.status(500).json({ error: "Sokak güncellenemedi." });
    }
    
    if (checkResult.length === 0) {
      return res.status(404).json({ error: "Belirtilen mahalle bulunamadı." });
    }
    
    db.query(
      "UPDATE streets SET name = ?, neighborhood_id = ?, is_active = ? WHERE id = ?",
      [name, neighborhood_id, is_active, streetId],
      (err, result) => {
        if (err) {
          console.error("Sokak güncelleme hatası:", err);
          return res.status(500).json({ error: "Sokak güncellenemedi." });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Sokak bulunamadı." });
        }
        
        res.json({
          status: "success",
          message: "Sokak başarıyla güncellendi."
        });
      }
    );
  });
};

// Sokak silme
const deleteStreet = (req, res) => {
  const streetId = req.params.id;
  
  db.query("DELETE FROM streets WHERE id = ?", [streetId], (err, result) => {
    if (err) {
      console.error("Sokak silme hatası:", err);
      return res.status(500).json({ error: "Sokak silinemedi." });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sokak bulunamadı." });
    }
    
    res.json({
      status: "success",
      message: "Sokak başarıyla silindi."
    });
  });
};

module.exports = {
  // Bölge
  getAllRegions,
  getRegionById,
  addRegion,
  updateRegion,
  deleteRegion,
  
  // İlçe
  getAllDistricts,
  getDistrictById,
  getDistrictsByRegionId,
  addDistrict,
  updateDistrict,
  deleteDistrict,
  
  // Mahalle
  getAllNeighborhoods,
  getNeighborhoodById,
  getNeighborhoodsByDistrictId,
  addNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
  
  // Sokak
  getAllStreets,
  getStreetById,
  getStreetsByNeighborhoodId,
  addStreet,
  updateStreet,
  deleteStreet
};