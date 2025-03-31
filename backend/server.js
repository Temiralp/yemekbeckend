const express = require("express");
require("dotenv").config();
const db = require("./config/db");
const cors = require("cors");
const config = require("./config/config");
const authRoutes = require("./routes/authRoutes");
// server.js dosyasında değiştirilecek satır
const addressRoute = require("./routes/addressRoute"); // 's' harfi kaldırıldı
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoute");
const ordersRouter = require("./routes/orderRoute");
const couponRouter = require("./routes/couponRoute");
const staffRouter = require("./routes/staffRoute");
const path = require("path");

const app = express();

// CORS ayarları
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// JSON ayrıştırma
app.use(express.json());

// Statik dosyalar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotalar
app.use("/auth", authRoutes);
app.use("/api/addresses", addressRoute); // Burada da değişiklik yaptım
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/staff", staffRouter);

// Ana sayfa
app.get("/", (req, res) => {
  db.query("SELECT 'Bağlantı başarılı!' AS mesaj", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor...`);
  console.log("MySQL bağlantısı başarılı!");
});