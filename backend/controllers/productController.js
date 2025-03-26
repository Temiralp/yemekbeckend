const db = require("../config/db");
const moment = require("moment");
const multer = require("multer");
const path = require("path");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in uploads/ directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
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
}).single("image"); // Expect a single file with field name "image"

// Ensure uploads directory exists
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const getAllProducts = (req, res) => {
  const { category_id } = req.query;

  let query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.base_price,
      p.stock,
      p.image_url,
      p.options,
      p.ingredients,
      p.is_active,
      p.created_at,
      p.updated_at,
      p.category_id,
      c.name AS category_name
    FROM 
      products p
    JOIN 
      categories c ON p.category_id = c.id
    WHERE 
      c.is_active = TRUE
  `;

  const queryParams = [];

  if (category_id) {
    query += " AND p.category_id = ?";
    queryParams.push(category_id);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Sorgu çalıştırılırken hata oluştu:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

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

const getProductById = (req, res) => {
  const productId = req.params.id;
  const isAdmin = req.user && req.user.role === "admin"; // This might not be working

  const query = `
            SELECT 
              p.id,
              p.name,
              p.description,
              p.base_price,
              p.stock,
              p.image_url,
              p.options,
              p.ingredients,
              p.is_active,
              p.created_at,
              p.updated_at,
              p.category_id,
              c.name AS category_name
            FROM 
              products p
            JOIN 
              categories c ON p.category_id = c.id
            WHERE 
              p.id = ? ${
                isAdmin ? "" : "AND p.is_active = TRUE AND c.is_active = TRUE"
              }
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
const createProduct = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Dosya yükleme hatası:", err);
      return res
        .status(400)
        .json({ error: err.message || "Dosya yükleme hatası." });
    }

    const {
      name,
      description,
      base_price,
      stock,
      options,
      ingredients,
      is_active = true,
      category_id,
    } = req.body;

    // Validation
    if (!name || !base_price || !stock || !category_id) {
      return res.status(400).json({
        error: "Ürün adı, temel fiyat, stok ve kategori ID'si zorunludur.",
      });
    }

    if (isNaN(base_price) || base_price <= 0) {
      return res
        .status(400)
        .json({ error: "Temel fiyat pozitif bir sayı olmalı." });
    }

    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ error: "Stok negatif olamaz." });
    }

    if (options) {
      try {
        const parsedOptions = JSON.parse(options);
        if (!Array.isArray(parsedOptions)) {
          return res
            .status(400)
            .json({ error: "Seçenekler bir dizi olmalıdır." });
        }
        for (const opt of parsedOptions) {
          if (
            !opt.name ||
            typeof opt.is_default !== "boolean" ||
            typeof opt.priceModifier !== "number"
          ) {
            return res.status(400).json({
              error:
                "Seçenekler {name, is_default, priceModifier} formatında olmalıdır.",
            });
          }
          if (opt.priceModifier < 0) {
            return res
              .status(400)
              .json({ error: "priceModifier negatif olamaz." });
          }
        }
        // Ensure only one option is default
        const defaultOptions = parsedOptions.filter((opt) => opt.is_default);
        if (defaultOptions.length > 1) {
          return res
            .status(400)
            .json({ error: "Yalnızca bir seçenek varsayılan olabilir." });
        }
      } catch (e) {
        return res
          .status(400)
          .json({ error: "Seçenekler geçersiz JSON formatında." });
      }
    }

    if (ingredients) {
      try {
        const parsedIngredients = JSON.parse(ingredients);
        if (!Array.isArray(parsedIngredients)) {
          return res
            .status(400)
            .json({ error: "Malzemeler bir dizi olmalıdır." });
        }
        for (const ing of parsedIngredients) {
          if (!ing.name) {
            return res.status(400).json({
              error: "Malzemeler {name} formatında olmalıdır.",
            });
          }
        }
      } catch (e) {
        return res
          .status(400)
          .json({ error: "Malzemeler geçersiz JSON formatında." });
      }
    }

    // Check if category exists and is active
    db.query(
      "SELECT * FROM categories WHERE id = ? AND is_active = TRUE",
      [category_id],
      (err, categoryResult) => {
        if (err) {
          console.error("Kategori sorgulama hatası:", err);
          return res.status(500).json({ error: "Veritabanı hatası" });
        }

        if (categoryResult.length === 0) {
          return res
            .status(400)
            .json({ error: "Geçersiz veya aktif olmayan kategori ID'si." });
        }

        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const query = `
                  INSERT INTO products (
                    name,
                    description,
                    base_price,
                    stock,
                    image_url,
                    options,
                    ingredients,
                    is_active,
                    category_id,
                    created_at,
                    updated_at
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

        const values = [
          name,
          description || null,
          Number(base_price),
          Number(stock),
          image_url,
          options || null,
          ingredients || null,
          is_active,
          category_id,
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
      }
    );
  });
};

const updateProduct = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Dosya yükleme hatası:", err);
      return res
        .status(400)
        .json({ error: err.message || "Dosya yükleme hatası." });
    }

    const productId = req.params.id;
    const {
      name,
      description,
      base_price,
      stock,
      options,
      ingredients,
      is_active,
      category_id,
    } = req.body;

    // Convert is_active string to numeric boolean
    const isActiveBoolean = is_active === "true" ? 1 : 0;
    console.log(
      "Received is_active:",
      is_active,
      "Converted to:",
      isActiveBoolean
    );

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

        const existingProduct = results[0];

        // Validation
        if (base_price && (isNaN(base_price) || base_price <= 0)) {
          return res
            .status(400)
            .json({ error: "Temel fiyat pozitif bir sayı olmalı." });
        }

        if (stock && (isNaN(stock) || stock < 0)) {
          return res.status(400).json({ error: "Stok negatif olamaz." });
        }

        if (options) {
          try {
            const parsedOptions = JSON.parse(options);
            if (!Array.isArray(parsedOptions)) {
              return res
                .status(400)
                .json({ error: "Seçenekler bir dizi olmalıdır." });
            }
            for (const opt of parsedOptions) {
              if (
                !opt.name ||
                typeof opt.is_default !== "boolean" ||
                typeof opt.priceModifier !== "number"
              ) {
                return res.status(400).json({
                  error:
                    "Seçenekler {name, is_default, priceModifier} formatında olmalıdır.",
                });
              }
              if (opt.priceModifier < 0) {
                return res
                  .status(400)
                  .json({ error: "priceModifier negatif olamaz." });
              }
            }
            const defaultOptions = parsedOptions.filter(
              (opt) => opt.is_default
            );
            if (defaultOptions.length > 1) {
              return res
                .status(400)
                .json({ error: "Yalnızca bir seçenek varsayılan olabilir." });
            }
          } catch (e) {
            return res
              .status(400)
              .json({ error: "Seçenekler geçersiz JSON formatında." });
          }
        }

        if (ingredients) {
          try {
            const parsedIngredients = JSON.parse(ingredients);
            if (!Array.isArray(parsedIngredients)) {
              return res
                .status(400)
                .json({ error: "Malzemeler bir dizi olmalıdır." });
            }
            for (const ing of parsedIngredients) {
              if (!ing.name) {
                return res.status(400).json({
                  error: "Malzemeler {name} formatında olmalıdır.",
                });
              }
            }
          } catch (e) {
            return res
              .status(400)
              .json({ error: "Malzemeler geçersiz JSON formatında." });
          }
        }

        if (category_id) {
          db.query(
            "SELECT * FROM categories WHERE id = ? AND is_active = TRUE",
            [category_id],
            (err, categoryResult) => {
              if (err) {
                console.error("Kategori sorgulama hatası:", err);
                return res.status(500).json({ error: "Veritabanı hatası" });
              }

              if (categoryResult.length === 0) {
                return res.status(400).json({
                  error: "Geçersiz veya aktif olmayan kategori ID'si.",
                });
              }

              updateProductDetails();
            }
          );
        } else {
          updateProductDetails();
        }

        function updateProductDetails() {
          const image_url = req.file
            ? `/uploads/${req.file.filename}`
            : existingProduct.image_url;

          if (req.file && existingProduct.image_url) {
            const oldImagePath = path.join(
              __dirname,
              "..",
              existingProduct.image_url
            );
            fs.unlink(oldImagePath, (err) => {
              if (err) {
                console.error("Eski resim silinirken hata oluştu:", err);
              }
            });
          }

          // Check stock and prevent setting is_active = 1 if stock = 0
          const stockValue =
            stock !== undefined ? Number(stock) : existingProduct.stock;
          if (stockValue === 0 && isActiveBoolean === 1) {
            return res.status(400).json({
              error: "Stok sıfır olduğu için ürün aktif edilemez.",
            });
          }

          const query = `
                    UPDATE products 
                    SET 
                      name = ?,
                      description = ?,
                      base_price = ?,
                      stock = ?,
                      image_url = ?,
                      options = ?,
                      ingredients = ?,
                      is_active = ?,
                      category_id = ?,
                      updated_at = ?
                    WHERE 
                      id = ?
                  `;

          const values = [
            name || existingProduct.name,
            description !== undefined
              ? description
              : existingProduct.description,
            base_price || existingProduct.base_price,
            stockValue,
            image_url,
            options || existingProduct.options,
            ingredients || existingProduct.ingredients,
            isActiveBoolean, // Use the converted numeric boolean
            category_id || existingProduct.category_id,
            moment().toDate(),
            productId,
          ];

          console.log("Updating product with values:", values);

          db.query(query, values, (err, result) => {
            if (err) {
              console.error("Ürün güncellenirken hata oluştu:", err);
              return res.status(500).json({ error: "Ürün güncellenemedi." });
            }

            // Check the final state
            db.query(
              `SELECT is_active, stock FROM products WHERE id = ?`,
              [productId],
              (err, finalResult) => {
                if (err) {
                  console.error("Son durumu kontrol ederken hata oluştu:", err);
                } else {
                  console.log(
                    `Product ID ${productId} final state - is_active: ${finalResult[0].is_active}, stock: ${finalResult[0].stock}`
                  );
                }

                res.status(200).json({
                  status: "success",
                  message: "Ürün başarıyla güncellendi.",
                });
              }
            );
          });
        }
      }
    );
  });
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
        "UPDATE products SET is_active = FALSE, updated_at = ? WHERE id = ?";
      db.query(query, [moment().toDate(), productId], (err, result) => {
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

  db.query(
    "SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ? AND p.is_active = TRUE",
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
    "SELECT c.*, p.name, p.base_price, p.options AS product_options, p.ingredients AS product_ingredients, p.image_url, p.category_id, cat.name AS category_name " +
      "FROM cart c " +
      "JOIN products p ON c.product_id = p.id " +
      "JOIN categories cat ON p.category_id = cat.id " +
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
