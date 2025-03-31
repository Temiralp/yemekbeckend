const db = require("../config/db");
const moment = require("moment");

// Transaction işlemleri için yardımcı fonksiyon
// Promise-based veritabanı sorgusu fonksiyonu
const query = (connection, sql, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Promise-based transaction yönetimi
const withTransaction = async (callback, timeoutMs = 15000) => {
  let connection;
  
  // Timeout promise'i
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Transaction timeout - işlem zaman aşımına uğradı')), timeoutMs);
  });
  
  try {
    // Bağlantı al
    connection = await new Promise((resolve, reject) => {
      db.getConnection((err, conn) => {
        if (err) reject(err);
        else resolve(conn);
      });
    });
    
    // Transaction başlat
    await new Promise((resolve, reject) => {
      connection.beginTransaction(err => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Callback'i çağır ve timeout ile race
    const result = await Promise.race([
      callback(connection, query),
      timeoutPromise
    ]);
    
    // Transaction'ı commit et
    await new Promise((resolve, reject) => {
      connection.commit(err => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    return result;
  } catch (error) {
    // Hata durumunda rollback yap
    if (connection) {
      await new Promise(resolve => {
        connection.rollback(() => resolve());
      });
    }
    throw error;
  } finally {
    // Her durumda bağlantıyı serbest bırak
    if (connection) connection.release();
  }
};

// createOrder fonksiyonunu bu yeni withTransaction kullanımına göre düzenleme
const createOrder = async (req, res) => {
  try {
    const { address_id, payment_type, note, coupon_code } = req.body;
    const user = req.user;
    console.log("CreateOrder FULL Request Body:", req.body);
    console.log("CreateOrder User:", req.user);
    console.log("Sipariş oluşturma isteği:", { body: req.body, user });

    // Kullanıcı ve yetkilendirme kontrolü
    if (!user) {
      return res.status(401).json({ error: "Yetkisiz erişim." });
    }

    // Zorunlu alan kontrolleri
    if (!address_id) {
      return res.status(400).json({ error: "Teslimat adresi zorunludur." });
    }

    if (!payment_type || !["cash", "credit_card"].includes(payment_type)) {
      return res.status(400).json({
        error: "Geçersiz ödeme tipi. 'cash' veya 'credit_card' olmalı.",
      });
    }

    // Kullanıcı bilgilerini belirle
    const userId = user.isGuest ? null : user.id;
    const guestId = user.isGuest ? user.id : null;
    const userType = user.isGuest ? "guest" : "registered";
    
    console.log("Sipariş parametreleri:", { 
      userId, 
      guestId, 
      userType, 
      address_id, 
      payment_type 
    });

    const result = await withTransaction(async (connection, query) => {
      // 1. Adres kontrolü
      const addressQuery = userType === "guest"
        ? "SELECT * FROM addresses WHERE id = ? AND guest_id = ?"
        : "SELECT * FROM addresses WHERE id = ? AND user_id = ?";
      const addressQueryId = userType === "guest" ? guestId : userId;

      const addressResult = await query(connection, addressQuery, [address_id, addressQueryId]);
      
      if (addressResult.length === 0) {
        throw new Error("Adres bulunamadı veya size ait değil.");
      }
      
      console.log("Adres doğrulandı:", addressResult[0]);

      // 2. Sepet ürünlerini getir
      const cartQuery = userType === "guest"
        ? "SELECT c.*, p.base_price, p.options AS product_options FROM cart c JOIN products p ON c.product_id = p.id WHERE c.guest_id = ? AND c.user_type = ?"
        : "SELECT c.*, p.base_price, p.options AS product_options FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ? AND c.user_type = ?";
      
      const cartItems = await query(connection, cartQuery, [userType === "guest" ? guestId : userId, userType]);
      
      if (cartItems.length === 0) {
        throw new Error("Sepetiniz boş, sipariş oluşturamazsınız.");
      }
      
      console.log(`Sepette ${cartItems.length} ürün bulundu.`);

      // 3. Toplam tutarı hesapla
      let totalAmount = 0;
      const orderItemsData = cartItems.map((item) => {
        let unitPrice = parseFloat(item.base_price);
        
        // Ürün seçeneği varsa fiyatı güncelle
        if (item.options) {
          try {
            const productOptions = item.product_options 
              ? (typeof item.product_options === 'string' 
                  ? JSON.parse(item.product_options) 
                  : item.product_options)
              : [];
              
            const selectedOption = productOptions.find(opt => opt.name === item.options);
            if (selectedOption && selectedOption.priceModifier) {
              unitPrice += parseFloat(selectedOption.priceModifier);
            }
          } catch (e) {
            console.error("Ürün seçenekleri çözümleme hatası:", e);
          }
        }

        const itemPrice = unitPrice * item.quantity;
        totalAmount += itemPrice;

        return [null, item.product_id, item.quantity, unitPrice, item.options, item.note];
      });
      
      console.log("Toplam sipariş tutarı:", totalAmount);

      // 4. Kupon kontrolü
      let discountAmount = 0;
      let appliedCouponCode = null;
      
      if (coupon_code) {
        const couponQuery = `
          SELECT * FROM coupons 
          WHERE code = ? AND active = 1 AND start_date <= NOW() AND end_date >= NOW()
        `;

        const couponResult = await query(connection, couponQuery, [coupon_code]);
        
        if (couponResult.length === 0) {
          throw new Error("Geçersiz kupon kodu.");
        }

        const coupon = couponResult[0];

        if (coupon.min_order_amount > totalAmount) {
          throw new Error(`Bu kupon için minimum sipariş tutarı ${coupon.min_order_amount} TL'dir.`);
        }

        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
          throw new Error("Kupon kullanım limiti doldu.");
        }

        if (coupon.discount_type === 'percentage') {
          discountAmount = (totalAmount * coupon.discount_amount) / 100;
        } else if (coupon.discount_type === 'fixed') {
          discountAmount = coupon.discount_amount;
        }

        totalAmount = Math.max(totalAmount - discountAmount, 0);

        // Kupon kullanım sayısını güncelle
        await query(
          connection,
          "UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ?", 
          [coupon.id]
        );
        
        appliedCouponCode = coupon.code;
      }

      // 5. Sipariş oluşturma
      const orderQuery = `
        INSERT INTO orders (
          user_id, user_type, address_id, order_time, total_amount, 
          payment_type, order_status, note, coupon_code, guest_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const orderValues = [
        userId,
        userType,
        address_id,
        moment().toDate(),
        totalAmount,
        payment_type,
        "pending",
        note || null,
        appliedCouponCode,
        guestId
      ];

      const orderResult = await query(connection, orderQuery, orderValues);
      const orderId = orderResult.insertId;

      // 6. Sipariş öğelerini ekle
      const orderItemsQuery = `
        INSERT INTO order_items (
          order_id, product_id, quantity, unit_price, options, note
        ) VALUES ?
      `;

      const finalOrderItemsData = orderItemsData.map(item => [orderId, ...item.slice(1)]);
      await query(connection, orderItemsQuery, [finalOrderItemsData]);

      // 7. Sipariş durum geçmişi oluştur
      const statusHistoryQuery = `
        INSERT INTO order_status_history 
        (order_id, old_status, new_status, changed_at, note) 
        VALUES (?, ?, ?, ?, ?)
      `;

      await query(
        connection,
        statusHistoryQuery, 
        [orderId, null, "pending", moment().toDate(), "Sipariş oluşturuldu"]
      );

      // 8. Sepeti temizle
      const clearCartQuery = userType === "guest"
        ? "DELETE FROM cart WHERE guest_id = ? AND user_type = ?"
        : "DELETE FROM cart WHERE user_id = ? AND user_type = ?";

      await query(
        connection,
        clearCartQuery, 
        [userType === "guest" ? guestId : userId, userType]
      );

      // İşlem sonucunu döndür
      return {
        order_id: orderId,
        total_amount: totalAmount,
        applied_discount: discountAmount || 0,
        coupon_code: appliedCouponCode
      };
    });

    // Transaction başarıyla tamamlandı
    res.status(201).json({
      status: "success",
      message: "Sipariş başarıyla oluşturuldu.",
      ...result
    });
  } catch (err) {
    // Genel hata yakalama
    console.error("FULL ERROR DETAILS:", err);
    return res.status(500).json({ 
      status: "error",
      fullErrorMessage: err.message,
      errorStack: err.stack
    });
  }
};

// Kullanıcının siparişlerini getir
const getOrders = (req, res) => {
  const user = req.user;
  
  console.log("getOrders çağrıldı, user:", user);
  
  if (!user) {
    return res.status(401).json({ error: "Yetkisiz erişim." });
  }
  
  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "registered";
  
  console.log("Siparişler getiriliyor:", { userId, guestId, userType });

  const ordersQuery = `
    SELECT 
      o.*,
      a.title AS address_title,
      a.city,
      a.district,
      a.neighborhood,
      a.street,
      a.address_detail,
      s.full_name AS staff_name,
      c.code AS coupon_code,
      c.discount_type,
      c.discount_amount,
      c.created_by AS coupon_created_by,
      sc.full_name AS coupon_created_by_name
    FROM 
      orders o
    JOIN 
      addresses a ON o.address_id = a.id
    LEFT JOIN 
      staff s ON o.staff_id = s.id
    LEFT JOIN 
      coupons c ON o.coupon_code = c.code
    LEFT JOIN 
      staff sc ON c.created_by = sc.id
    WHERE 
      (o.user_id = ? AND o.user_type = ?) OR (o.guest_id = ? AND o.user_type = ?)
    ORDER BY 
      o.order_time DESC
  `;

  db.query(ordersQuery, [userId, userType, guestId, userType], (err, orders) => {
    if (err) {
      console.error("Sipariş sorgulama hatası:", err.message, err.stack);
      return res.status(500).json({ error: "Siparişler bulunamadı: " + err.message });
    }
    
    console.log(`${orders.length} sipariş bulundu.`);

    if (!orders.length) {
      return res.status(200).json({ status: "success", data: [] });
    }

    const orderIds = orders.map((order) => order.id);

    // Sipariş öğelerini getir
    db.query(
      "SELECT oi.* FROM order_items oi WHERE oi.order_id IN (?)",
      [orderIds],
      (err, orderItems) => {
        if (err) {
          console.error("Sipariş öğeleri sorgulama hatası:", err.message, err.stack);
          return res.status(500).json({ error: "Siparişler bulunamadı: " + err.message });
        }

        // Sipariş durumu geçmişini getir
        db.query(
          "SELECT osh.* FROM order_status_history osh WHERE osh.order_id IN (?)",
          [orderIds],
          (err, statusHistory) => {
            if (err) {
              console.error("Durum geçmişi sorgulama hatası:", err.message, err.stack);
              return res.status(500).json({ error: "Siparişler bulunamadı: " + err.message });
            }

            // Her sipariş için öğeleri ve durum geçmişini birleştir
            const parsedResults = orders.map((order) => ({
              ...order,
              order_items: orderItems.filter((item) => item.order_id === order.id),
              status_history: statusHistory.filter((item) => item.order_id === order.id),
            }));

            res.status(200).json({
              status: "success",
              data: parsedResults,
            });
          }
        );
      }
    );
  });
};

// Tüm siparişleri getir (admin)
const getAllOrders = (req, res) => {
  const user = req.user;
  
  console.log("getAllOrders çağrıldı, user:", user);
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
  }
  
  const ordersQuery = `
    SELECT 
      o.*,
      a.title AS address_title,
      a.city,
      a.district,
      a.neighborhood,
      a.street,
      a.address_detail,
      s.full_name AS staff_name,
      su.full_name AS updated_by_name,
      c.code AS coupon_code,
      c.discount_type,
      c.discount_amount,
      c.created_by AS coupon_created_by,
      sc.full_name AS coupon_created_by_name
    FROM 
      orders o
    JOIN 
      addresses a ON o.address_id = a.id
    LEFT JOIN 
      staff s ON o.staff_id = s.id
    LEFT JOIN 
      staff su ON o.updated_by = su.id
    LEFT JOIN 
      coupons c ON o.coupon_code = c.code
    LEFT JOIN 
      staff sc ON c.created_by = sc.id
    ORDER BY 
      o.order_time DESC
  `;

  db.query(ordersQuery, (err, orders) => {
    if (err) {
      console.error("Sipariş sorgulama hatası:", err.message, err.stack);
      return res.status(500).json({ error: "Siparişler sorgulanamadı." });
    }

    if (!orders.length) {
      return res.status(200).json({ status: "success", data: [] });
    }

    const orderIds = orders.map((order) => order.id);

    db.query(
      "SELECT oi.* FROM order_items oi WHERE oi.order_id IN (?)",
      [orderIds],
      (err, orderItems) => {
        if (err) {
          console.error("Sipariş öğeleri sorgulama hatası:", err.message, err.stack);
          return res.status(500).json({ error: "Siparişler sorgulanamadı." });
        }

        db.query(
          "SELECT osh.* FROM order_status_history osh WHERE osh.order_id IN (?)",
          [orderIds],
          (err, statusHistory) => {
            if (err) {
              console.error("Durum geçmişi sorgulama hatası:", err.message, err.stack);
              return res.status(500).json({ error: "Siparişler sorgulanamadı." });
            }

            const parsedResults = orders.map((order) => ({
              ...order,
              order_items: orderItems.filter((item) => item.order_id === order.id),
              status_history: statusHistory.filter((item) => item.order_id === order.id),
            }));

            res.status(200).json({
              status: "success",
              data: parsedResults,
            });
          }
        );
      }
    );
  });
};

// Sipariş durumunu güncelle
const updateOrderStatus = (req, res) => {
  const { order_id } = req.params;
  const { order_status, staff_id, note } = req.body;
  const user = req.user;
  
  console.log("updateOrderStatus çağrıldı:", { order_id, order_status, staff_id, user });
  
  if (!user || !['admin', 'staff'].includes(user.role)) {
    return res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
  }

  if (!order_id || !order_status) {
    return res.status(400).json({ error: "Sipariş ID'si ve yeni durum zorunludur." });
  }

  const validStatuses = ["pending", "preparing", "on_the_way", "delivered", "cancelled"];
  if (!validStatuses.includes(order_status)) {
    return res.status(400).json({ error: "Geçersiz sipariş durumu." });
  }

  withTransaction((connection, cb) => {
    connection.query(
      "SELECT order_status FROM orders WHERE id = ?",
      [order_id],
      (err, orderResult) => {
        if (err) {
          return cb(err);
        }

        if (orderResult.length === 0) {
          return cb(new Error("Sipariş bulunamadı."));
        }

        const oldStatus = orderResult[0].order_status;

        if (staff_id) {
          connection.query(
            "SELECT * FROM staff WHERE id = ? AND status = 'active'",
            [staff_id],
            (err, staffResult) => {
              if (err) {
                return cb(err);
              }

              if (staffResult.length === 0) {
                return cb(new Error("Geçersiz veya aktif olmayan personel ID'si."));
              }

              proceedWithUpdate();
            }
          );
        } else {
          proceedWithUpdate();
        }

        function proceedWithUpdate() {
          connection.query(
            "UPDATE orders SET order_status = ?, staff_id = ?, updated_by = ?, updated_at = ? WHERE id = ?",
            [order_status, staff_id || null, user.id, moment().toDate(), order_id],
            (err) => {
              if (err) {
                return cb(err);
              }

              connection.query(
                "INSERT INTO order_status_history (order_id, old_status, new_status, changed_at, staff_id, note) VALUES (?, ?, ?, ?, ?, ?)",
                [
                  order_id,
                  oldStatus,
                  order_status,
                  moment().toDate(),
                  staff_id || user.id,
                  note || "Sipariş durumu güncellendi",
                ],
                (err) => {
                  if (err) {
                    return cb(err);
                  }

                  cb(null);
                }
              );
            }
          );
        }
      }
    );
  }, (err) => {
    if (err) {
      console.error("Sipariş durumu güncelleme hatası:", err.message, err.stack);
      return res
        .status(err.message.includes("bulunamadı") ? 404 : 500)
        .json({ error: err.message });
    }

    res.status(200).json({
      status: "success",
      message: "Sipariş durumu başarıyla güncellendi.",
    });
  });
};

// Siparişi iptal et
const cancelOrder = (req, res) => {
  const { order_id } = req.params;
  const user = req.user;
  
  console.log("cancelOrder çağrıldı:", { order_id, user });
  
  if (!user) {
    return res.status(401).json({ error: "Yetkisiz erişim." });
  }
  
  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "registered";

  withTransaction((connection, cb) => {
    connection.query(
      `
      SELECT * FROM orders 
      WHERE id = ? AND ((user_id = ? AND user_type = ?) OR (guest_id = ? AND user_type = ?))
      `,
      [order_id, userId, userType, guestId, userType],
      (err, results) => {
        if (err) {
          return cb(err);
        }

        if (results.length === 0) {
          return cb(new Error("Sipariş bulunamadı veya size ait değil."));
        }

        const order = results[0];

        if (order.order_status === "delivered") {
          return cb(new Error("Teslim edilmiş siparişler iptal edilemez."));
        }

        if (order.order_status === "cancelled") {
          return cb(new Error("Sipariş zaten iptal edilmiş."));
        }

        connection.query(
          "UPDATE orders SET order_status = 'cancelled', updated_at = ? WHERE id = ?",
          [moment().toDate(), order_id],
          (err) => {
            if (err) {
              return cb(err);
            }

            connection.query(
              "INSERT INTO order_status_history (order_id, old_status, new_status, changed_at, staff_id, note) VALUES (?, ?, ?, ?, ?, ?)",
              [
                order_id,
                order.order_status,
                "cancelled",
                moment().toDate(),
                null,
                "Sipariş kullanıcı tarafından iptal edildi",
              ],
              (err) => {
                if (err) {
                  return cb(err);
                }

                cb(null);
              }
            );
          }
        );
      }
    );
  }, (err) => {
    if (err) {
      console.error("Sipariş iptal etme hatası:", err.message, err.stack);
      return res
        .status(err.message.includes("bulunamadı") ? 404 : 500)
        .json({ error: err.message });
    }

    res.status(200).json({
      status: "success",
      message: "Sipariş başarıyla iptal edildi.",
    });
  });
};

// Modül export
module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};