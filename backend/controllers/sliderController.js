const db = require("../config/db");
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dosya yükleme için multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/sliders/";
    
    // Klasör yoksa oluştur
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Yalnızca JPEG, JPG ve PNG dosyaları destekleniyor!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image");

// Tüm aktif sliderları getir
const getAllSliders = (req, res) => {
  const query = `
    SELECT 
      id,
      title,
      image_url,
      order_number,
      link,
      active
    FROM 
      sliders
    ORDER BY 
      order_number ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Slider sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    res.status(200).json({
      status: "success",
      data: results
    });
  });
};

// Slider detayını getir
const getSliderById = (req, res) => {
  const sliderId = req.params.id;
  
  if (!sliderId) {
    return res.status(400).json({ error: "Slider ID gereklidir" });
  }

  const query = `
    SELECT 
      id,
      title,
      image_url,
      order_number,
      link,
      active
    FROM 
      sliders
    WHERE 
      id = ?
  `;

  db.query(query, [sliderId], (err, results) => {
    if (err) {
      console.error("Slider sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Slider bulunamadı" });
    }

    res.status(200).json({
      status: "success",
      data: results[0]
    });
  });
};

// Slider oluştur
const createSlider = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Dosya yükleme hatası:", err);
      return res.status(400).json({ error: err.message || "Dosya yükleme hatası." });
    }

    const { title, link, order_number = 0, active = 1 } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Başlık zorunludur" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Resim zorunludur" });
    }

    const image_url = `/uploads/sliders/${req.file.filename}`;

    const query = `
      INSERT INTO sliders (
        title,
        image_url,
        order_number,
        link,
        active
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      title,
      image_url,
      order_number,
      link || null,
      active === "true" || active === true || active === "1" || active === 1 ? 1 : 0
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Slider ekleme hatası:", err);
        return res.status(500).json({ error: "Slider eklenemedi: " + err.message });
      }

      res.status(201).json({
        status: "success",
        message: "Slider başarıyla eklendi",
        slider_id: result.insertId
      });
    });
  });
};

// Slider güncelle
const updateSlider = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Dosya yükleme hatası:", err);
      return res.status(400).json({ error: err.message || "Dosya yükleme hatası." });
    }

    const sliderId = req.params.id;
    
    if (!sliderId) {
      return res.status(400).json({ error: "Slider ID gereklidir" });
    }

    const { title, link, order_number, active } = req.body;

    // Önce mevcut slider'ı kontrol et
    db.query("SELECT * FROM sliders WHERE id = ?", [sliderId], (err, results) => {
      if (err) {
        console.error("Slider sorgulama hatası:", err);
        return res.status(500).json({ error: "Veritabanı hatası" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Slider bulunamadı" });
      }

      const existingSlider = results[0];
      let image_url = existingSlider.image_url;

      // Eğer yeni resim yüklendiyse
      if (req.file) {
        // Eski resmi silme işlemi (optional)
        if (existingSlider.image_url && existingSlider.image_url.startsWith('/uploads/')) {
          const oldImagePath = path.join(__dirname, '..', existingSlider.image_url);
          fs.unlink(oldImagePath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error("Eski resim silinirken hata oluştu:", err);
            }
          });
        }
        
        // Yeni resim URL'ini ayarla
        image_url = `/uploads/sliders/${req.file.filename}`;
      }

      // Güncelleme sorgusu
      const query = `
        UPDATE sliders 
        SET 
          title = ?,
          image_url = ?,
          order_number = ?,
          link = ?,
          active = ?
        WHERE 
          id = ?
      `;

      const values = [
        title || existingSlider.title,
        image_url,
        order_number !== undefined ? order_number : existingSlider.order_number,
        link !== undefined ? link : existingSlider.link,
        active !== undefined ? (active === "true" || active === true || active === "1" || active === 1 ? 1 : 0) : existingSlider.active,
        sliderId
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Slider güncelleme hatası:", err);
          return res.status(500).json({ error: "Slider güncellenemedi: " + err.message });
        }

        res.status(200).json({
          status: "success",
          message: "Slider başarıyla güncellendi"
        });
      });
    });
  });
};

// Slider sil
const deleteSlider = (req, res) => {
  const sliderId = req.params.id;
  
  if (!sliderId) {
    return res.status(400).json({ error: "Slider ID gereklidir" });
  }

  // Önce mevcut slider'ı kontrol et
  db.query("SELECT * FROM sliders WHERE id = ?", [sliderId], (err, results) => {
    if (err) {
      console.error("Slider sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Slider bulunamadı" });
    }

    const existingSlider = results[0];

    // Slider'ı veritabanından sil
    db.query("DELETE FROM sliders WHERE id = ?", [sliderId], (err, result) => {
      if (err) {
        console.error("Slider silme hatası:", err);
        return res.status(500).json({ error: "Slider silinemedi: " + err.message });
      }

      // Resmi diskten sil (optional)
      if (existingSlider.image_url && existingSlider.image_url.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '..', existingSlider.image_url);
        fs.unlink(imagePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error("Resim silinirken hata oluştu:", err);
          }
        });
      }

      res.status(200).json({
        status: "success",
        message: "Slider başarıyla silindi"
      });
    });
  });
};

module.exports = {
  getAllSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider
};