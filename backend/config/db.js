const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1881",
  database: process.env.DB_NAME || "donerci_db",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  multipleStatements: true,
});

pool.on("error", (err) => {
  console.error("Beklenmedik MySQL hatası:", err);
});

// Bağlantı kontrolü
pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL bağlantı hatası:", err);
    return;
  }

  console.log("MySQL bağlantısı başarılı!");

  // Tablo şemasını kontrol et
  connection.query("SHOW COLUMNS FROM cart", (err, results) => {
    if (err) {
      console.error("Tablo şeması kontrol hatası:", err);
    } else {
      console.log("Cart tablosu mevcut, sütunlar:", results.length);
    }
  });

  connection.release();
});

module.exports = pool;
