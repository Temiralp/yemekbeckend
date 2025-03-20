const express = require("express");
require("dotenv").config();
const db = require("./config/db");
const cors = require("cors");
const config = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const addressRoute = require("./routes/addressRoute");
const productRouter = require("./routes/productRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/addresses", addressRoute);
app.use("/api", productRouter);

app.get("/", (req, res) => {
  db.query("SELECT 'Bağlantı başarılı!' AS mesaj", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

app.listen(process.env.PORT, () => {
  console.log("🚀 Server 3000 portunda çalışıyor...");
});
