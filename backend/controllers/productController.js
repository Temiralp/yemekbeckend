const db = require("../config/db");
const moment = require("moment");

// Tüm ürünleri listele
const getAllProducts = (req, res) => {
  const query = `
    SELECT 
      id,
      name,
      description,
      base_price,
      image_url,
      options,
      ingredients,
      is_active,
      created_at,
      updated_at
    FROM 
      products
    WHERE 
      is_active = TRUE
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Sorgu çalıştırılırken hata oluştu:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    // JSON string'lerini parse et
    const parsedResults = results.map((product) => ({
      ...product,
      options: product.options ? JSON.parse(product.options) : [],
      ingredients: product.ingredients ? JSON.parse(product.ingredients) : [],
    }));

    res.status(200).json({
      status: "success",
      data: parsedResults,
    });
  });
};

// Tek bir ürünü getir
const getProductById = (req, res) => {
  const productId = req.params.id;
  const query = `
    SELECT 
      id,
      name,
      description,
      base_price,
      image_url,
      options,
      ingredients,
      is_active,
      created_at,
      updated_at
    FROM 
      products
    WHERE 
      id = ? AND is_active = TRUE
  `;

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error("Sorgu çalıştırılırken hata oluştu:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    const product = results[0];
    product.options = product.options ? JSON.parse(product.options) : [];
    product.ingredients = product.ingredients
      ? JSON.parse(product.ingredients)
      : [];

    res.status(200).json({
      status: "success",
      data: product,
    });
  });
};

// Yeni ürün ekle
const createProduct = (req, res) => {
  const {
    name,
    description,
    base_price,
    image_url,
    options,
    ingredients,
    is_active = true,
  } = req.body;

  if (!name || !base_price) {
    return res
      .status(400)
      .json({ error: "Ürün adı ve temel fiyat zorunludur." });
  }

  if (options && !Array.isArray(options)) {
    return res.status(400).json({ error: "Seçenekler bir dizi olmalıdır." });
  }
  if (ingredients && !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Malzemeler bir dizi olmalıdır." });
  }

  if (ingredients) {
    for (const ing of ingredients) {
      if (!ing.name || typeof ing.is_default !== "boolean") {
        return res.status(400).json({
          error: "Malzemeler {name, is_default} formatında olmalıdır.",
        });
      }
    }
  }

  const query = `
    INSERT INTO products (
      name,
      description,
      base_price,
      image_url,
      options,
      ingredients,
      is_active,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    description || null,
    base_price,
    image_url || null,
    options ? JSON.stringify(options) : null,
    ingredients ? JSON.stringify(ingredients) : null,
    is_active,
    moment().toDate(),
    moment().toDate(),
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Ürün eklenirken hata oluştu:", err);
      return res.status(500).json({ error: "Ürün eklenemedi." });
    }

    res.status(201).json({
      status: "success",
      message: "Ürün başarıyla eklendi.",
      product_id: result.insertId,
    });
  });
};

const updateProduct = (req, res) => {
  const productId = req.params.id;
  const {
    name,
    description,
    base_price,
    image_url,
    options,
    ingredients,
    is_active,
  } = req.body;

  // Ürünün varlığını kontrol et
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) {
        console.error("Ürün sorgulama hatası:", err);
        return res.status(500).json({ error: "Veritabanı hatası" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Ürün bulunamadı" });
      }

      if (options && !Array.isArray(options)) {
        return res
          .status(400)
          .json({ error: "Seçenekler bir dizi olmalıdır." });
      }
      if (ingredients && !Array.isArray(ingredients)) {
        return res
          .status(400)
          .json({ error: "Malzemeler bir dizi olmalıdır." });
      }

      if (ingredients) {
        for (const ing of ingredients) {
          if (!ing.name || typeof ing.is_default !== "boolean") {
            return res.status(400).json({
              error: "Malzemeler {name, is_default} formatında olmalıdır.",
            });
          }
        }
      }

      const query = `
        UPDATE products 
        SET 
          name = ?,
          description = ?,
          base_price = ?,
          image_url = ?,
          options = ?,
          ingredients = ?,
          is_active = ?,
          updated_at = ?
        WHERE 
          id = ?
      `;

      const values = [
        name || results[0].name,
        description !== undefined ? description : results[0].description,
        base_price || results[0].base_price,
        image_url !== undefined ? image_url : results[0].image_url,
        options ? JSON.stringify(options) : results[0].options,
        ingredients ? JSON.stringify(ingredients) : results[0].ingredients,
        is_active !== undefined ? is_active : results[0].is_active,
        moment().toDate(),
        productId,
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Ürün güncellenirken hata oluştu:", err);
          return res.status(500).json({ error: "Ürün güncellenemedi." });
        }

        res.status(200).json({
          status: "success",
          message: "Ürün başarıyla güncellendi.",
        });
      });
    }
  );
};

const deleteProduct = (req, res) => {
  const productId = req.params.id;

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) {
        console.error("Ürün sorgulama hatası:", err);
        return res.status(500).json({ error: "Veritabanı hatası" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Ürün bulunamadı" });
      }

      const query =
        "DELETE FROM products WHERE id = ?"
      db.query(query, [productId], (err, result) => {
        if (err) {
          console.error("Ürün silinirken hata oluştu:", err);
          return res.status(500).json({ error: "Ürün silinemedi." });
        }

        res.status(200).json({
          status: "success",
          message: "Ürün başarıyla silindi.",
        });
      });
    }
  );
};

const addToCart = (req, res) => {
  const { product_id, quantity, option, ingredients, note } = req.body;
  const user = req.user;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: "Ürün ID'si ve miktar zorunludur." });
  }

  // Ürünün varlığını kontrol et
  db.query(
    "SELECT * FROM products WHERE id = ? AND is_active = TRUE",
    [product_id],
    (err, productResult) => {
      if (err) {
        console.error("Ürün sorgulama hatası:", err);
        return res.status(500).json({ error: "Ürün sorgulanamadı." });
      }

      if (productResult.length === 0) {
        return res.status(404).json({ error: "Ürün bulunamadı." });
      }

      const product = productResult[0];
      const productIngredients = product.ingredients
        ? JSON.parse(product.ingredients)
        : [];

      // Malzemeleri doğrula: Sadece mevcut malzemeler çıkarılabilir
      const removedIngredients = ingredients || [];
      for (const ing of removedIngredients) {
        if (!productIngredients.some((pi) => pi.name === ing.name)) {
          return res
            .status(400)
            .json({ error: `Malzeme ${ing.name} bu üründe mevcut değil.` });
        }
        if (ing.action !== "remove") {
          return res
            .status(400)
            .json({ error: "Sadece malzeme çıkarma işlemi destekleniyor." });
        }
      }

      const userId = user.isGuest ? null : user.id;
      const guestId = user.isGuest ? user.id : null;
      const userType = user.isGuest ? "guest" : "normal";

      // Sepete ekle
      db.query(
        "INSERT INTO cart (user_id, user_type, product_id, quantity, options, ingredients, note, added_at, guest_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          userType,
          product_id,
          quantity,
          option || null,
          ingredients ? JSON.stringify(ingredients) : null,
          note || null,
          moment().toDate(),
          guestId,
        ],
        (err, cartResult) => {
          if (err) {
            console.error("Sepete ekleme hatası:", err);
            return res.status(500).json({ error: "Ürün sepete eklenemedi." });
          }

          res.json({
            message: "Ürün sepete eklendi!",
            cart_id: cartResult.insertId,
          });
        }
      );
    }
  );
};

const getCart = (req, res) => {
  const user = req.user;
  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "normal";

  db.query(
    "SELECT c.*, p.name, p.base_price, p.options AS product_options, p.ingredients AS product_ingredients, p.image_url " +
      "FROM cart c " +
      "JOIN products p ON c.product_id = p.id " +
      "WHERE (c.user_id = ? AND c.user_type = ?) OR (c.guest_id = ? AND c.user_type = ?)",
    [userId, userType, guestId, userType],
    (err, cartItems) => {
      if (err) {
        console.error("Sepet sorgulama hatası:", err);
        return res.status(500).json({ error: "Sepet sorgulanamadı." });
      }

      const parsedCartItems = cartItems.map((item) => ({
        ...item,
        options: item.options,
        ingredients: item.ingredients ? JSON.parse(item.ingredients) : [],
        product_options: item.product_options
          ? JSON.parse(item.product_options)
          : [],
        product_ingredients: item.product_ingredients
          ? JSON.parse(item.product_ingredients)
          : [],
      }));

      res.json({ cart: parsedCartItems });
    }
  );
};

const removeFromCart = (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "normal";

  db.query(
    "DELETE FROM cart WHERE id = ? AND ((user_id = ? AND user_type = ?) OR (guest_id = ? AND user_type = ?))",
    [id, userId, userType, guestId, userType],
    (err, result) => {
      if (err) {
        console.error("Sepetten silme hatası:", err);
        return res.status(500).json({ error: "Ürün sepetten silinemedi." });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Sepet öğesi bulunamadı veya size ait değil." });
      }

      res.json({ message: "Ürün sepetten silindi." });
    }
  );
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addToCart,
  getCart,
  removeFromCart,
};
