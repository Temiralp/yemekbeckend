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
const restaurantHoursRouter = require("./routes/restaurantHoursRoute");
const sliderRouter = require("./routes/sliderRoute");
const testRoutes = require("./routes/testRoutes");
const locationRouter = require("./routes/locationRoute");

const app = express();

// CORS ayarları

app.use(
  cors({
    origin: [
      "http://ec2-3-91-81-174.compute-1.amazonaws.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// JSON ayrıştırma
app.use(express.json());

// Statik dosyalar
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/locations", locationRouter);
// Rotalar
app.use("/auth", authRoutes);
app.use("/api/addresses", addressRoute); // Burada da değişiklik yaptım
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/staff", staffRouter);
app.use("/api/sliders", sliderRouter);
app.use("/api/test", testRoutes);
app.use("/api/sliders", sliderRouter);

// Çalışma saatleri rotası
app.use("/api/restaurant-hours", restaurantHoursRouter);

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
