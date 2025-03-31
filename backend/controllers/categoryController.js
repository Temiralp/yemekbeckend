const db = require("../config/db");
const moment = require("moment");

const getAllCategories = (req, res) => {
  const query = `
    SELECT 
      id,
      name,
      description,
      is_active,
      created_at,
      updated_at
    FROM 
      categories
    WHERE 
      is_active = TRUE
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Kategori sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    res.status(200).json({
      status: "success",
      data: results,
    });
  });
};

// Tek bir kategoriyi getir
const getCategoryById = (req, res) => {
  const categoryId = req.params.id;
  const query = `
    SELECT 
      id,
      name,
      description,
      is_active,
      created_at,
      updated_at
    FROM 
      categories
    WHERE 
      id = ? AND is_active = TRUE
  `;

  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error("Kategori sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Kategori bulunamadı" });
    }

    res.status(200).json({
      status: "success",
      data: results[0],
    });
  });
};

// Yeni kategori ekle
const createCategory = (req, res) => {
  const { name, description, is_active = true } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Kategori adı zorunludur." });
  }

  const query = `
    INSERT INTO categories (name, description, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    description || null,
    is_active,
    moment().toDate(),
    moment().toDate(),
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Kategori ekleme hatası:", err);
      return res.status(500).json({ error: "Kategori eklenemedi." });
    }

    res.status(201).json({
      status: "success",
      message: "Kategori başarıyla eklendi.",
      category_id: result.insertId,
    });
  });
};

// Kategoriyi güncelle
const updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name, description, is_active } = req.body;

  db.query("SELECT * FROM categories WHERE id = ?", [categoryId], (err, results) => {
    if (err) {
      console.error("Kategori sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Kategori bulunamadı" });
    }

    const query = `
      UPDATE categories 
      SET 
        name = ?,
        description = ?,
        is_active = ?,
        updated_at = ?
      WHERE 
        id = ?
    `;

    const values = [
      name || results[0].name,
      description !== undefined ? description : results[0].description,
      is_active !== undefined ? is_active : results[0].is_active,
      moment().toDate(),
      categoryId,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Kategori güncelleme hatası:", err);
        return res.status(500).json({ error: "Kategori güncellenemedi." });
      }

      res.status(200).json({
        status: "success",
        message: "Kategori başarıyla güncellendi.",
      });
    });
  });
};

// Kategoriyi sil
const deleteCategory = (req, res) => {
  const categoryId = req.params.id;

  // Kategoriye bağlı ürün var mı kontrol et
  db.query("SELECT * FROM products WHERE category_id = ?", [categoryId], (err, productResults) => {
    if (err) {
      console.error("Ürün sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    if (productResults.length > 0) {
      return res.status(400).json({ error: "Bu kategoriye bağlı ürünler var, önce ürünleri silin veya kategoriyi değiştirin." });
    }

    db.query("SELECT * FROM categories WHERE id = ?", [categoryId], (err, results) => {
      if (err) {
        console.error("Kategori sorgulama hatası:", err);
        return res.status(500).json({ error: "Veritabanı hatası" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Kategori bulunamadı" });
      }

      const query = "UPDATE categories SET is_active = FALSE, updated_at = ? WHERE id = ?";
      db.query(query, [moment().toDate(), categoryId], (err, result) => {
        if (err) {
          console.error("Kategori silme hatası:", err);
          return res.status(500).json({ error: "Kategori silinemedi." });
        }

        res.status(200).json({
          status: "success",
          message: "Kategori başarıyla silindi.",
        });
      });
    });
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};