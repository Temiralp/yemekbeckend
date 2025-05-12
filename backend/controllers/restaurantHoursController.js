const db = require("../config/db");
const moment = require("moment");

// Tüm çalışma saatlerini getir
const getAllWorkingHours = (req, res) => {
  const query = `
    SELECT 
      id,
      day_of_week,
      opening_time,
      closing_time,
      is_closed
    FROM 
      restaurant_working_hours
    ORDER BY 
      day_of_week
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Çalışma saatleri sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    res.status(200).json({
      status: "success",
      data: results
    });
  });
};

// Çalışma saatlerini güncelle (admin için)
const updateWorkingHours = (req, res) => {
  const { id } = req.params;
  const { opening_time, closing_time, is_closed } = req.body;

  db.query(
    "SELECT * FROM restaurant_working_hours WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Çalışma saati sorgulama hatası:", err);
        return res.status(500).json({ error: "Veritabanı hatası" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Çalışma saati bulunamadı" });
      }

      const query = `
        UPDATE restaurant_working_hours 
        SET 
          opening_time = ?,
          closing_time = ?,
          is_closed = ?,
          updated_at = ?
        WHERE 
          id = ?
      `;

      const values = [
        opening_time || results[0].opening_time,
        closing_time || results[0].closing_time,
        is_closed !== undefined ? is_closed : results[0].is_closed,
        moment().toDate(),
        id
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Çalışma saati güncelleme hatası:", err);
          return res.status(500).json({ error: "Çalışma saati güncellenemedi." });
        }

        res.status(200).json({
          status: "success",
          message: "Çalışma saati başarıyla güncellendi."
        });
      });
    }
  );
};

// Şu anki çalışma durumunu kontrol et (açık mı kapalı mı)
// Şu anki çalışma durumunu kontrol et (açık mı kapalı mı)
const checkRestaurantOpen = (req, res) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0: Pazar, 1: Pazartesi, ... 6: Cumartesi
  
  // Şu anki saati al (saat:dakika:saniye formatında)
  const currentTime = moment(currentDate).format('HH:mm:ss');
  
  // Şu anki saati dakika cinsinden hesapla
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Debug için saati loglayalım
  console.log("Kontrol edilen saat:", {
    date: currentDate,
    time: currentTime,
    day: currentDay,
    timeInMinutes: currentTimeInMinutes
  });

  const query = `
    SELECT 
      opening_time,
      closing_time,
      is_closed
    FROM 
      restaurant_working_hours
    WHERE 
      day_of_week = ?
  `;

  db.query(query, [currentDay], (err, results) => {
    if (err) {
      console.error("Çalışma saati sorgulama hatası:", err);
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        status: "error",
        message: "Bu gün için çalışma saati bilgisi bulunamadı",
        is_open: false
      });
    }

    const workingHours = results[0];
    
    // Eğer bugün kapalıysa
    if (workingHours.is_closed) {
      return res.status(200).json({
        status: "success",
        message: "Restoran bugün kapalı",
        is_open: false,
        working_hours: workingHours
      });
    }

    // Açılış ve kapanış saatlerini dakika cinsine çevir
    const openingTimeParts = workingHours.opening_time.split(':');
    const openingHour = parseInt(openingTimeParts[0]);
    const openingMinute = parseInt(openingTimeParts[1]);
    const openingTimeInMinutes = openingHour * 60 + openingMinute;

    const closingTimeParts = workingHours.closing_time.split(':');
    const closingHour = parseInt(closingTimeParts[0]);
    const closingMinute = parseInt(closingTimeParts[1]);
    const closingTimeInMinutes = closingHour * 60 + closingMinute;

    // Debug için çalışma saatlerini loglayalım
    console.log("Çalışma saatleri:", {
      opening: workingHours.opening_time,
      closing: workingHours.closing_time,
      openingMinutes: openingTimeInMinutes,
      closingMinutes: closingTimeInMinutes
    });

    // Normal saat aralığı (açılış < kapanış)
    let isOpen = false;
    
    if (openingTimeInMinutes < closingTimeInMinutes) {
      // Normal çalışma saati durumu (ör: 09:00 - 17:00)
      isOpen = currentTimeInMinutes >= openingTimeInMinutes && 
               currentTimeInMinutes <= closingTimeInMinutes;
      console.log("Normal çalışma saati kontrolü:", isOpen);
    } else {
      // Gece yarısını geçen çalışma saati durumu (ör: 22:00 - 02:00)
      isOpen = currentTimeInMinutes >= openingTimeInMinutes || 
               currentTimeInMinutes <= closingTimeInMinutes;
      console.log("Gece yarısını geçen çalışma saati kontrolü:", isOpen);
    }

    res.status(200).json({
      status: "success",
      message: isOpen ? "Restoran şu anda açık" : "Restoran şu anda kapalı",
      is_open: isOpen,
      working_hours: workingHours,
      current_time: currentTime,
      debug: {
        currentTimeInMinutes,
        openingTimeInMinutes,
        closingTimeInMinutes,
        isGeceMesaisi: openingTimeInMinutes > closingTimeInMinutes
      }
    });
  });
};

module.exports = {
  getAllWorkingHours,
  updateWorkingHours,
  checkRestaurantOpen
};
