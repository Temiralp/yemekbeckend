const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

// Hata ayıklama için bağlantı kontrolü
pool.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL bağlantı hatası:", err);
    } else {
        console.log("MySQL bağlantısı başarılı!");
        connection.release(); // Bağlantıyı geri bırak
    }
});

module.exports = pool;
