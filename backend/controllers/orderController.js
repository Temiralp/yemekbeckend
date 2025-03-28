const db = require("../config/db");
const moment = require("moment");

// Create a new order
const createOrder = (req, res) => {
  const { address_id, payment_type, note, coupon_code } = req.body;
  const user = req.user;

  if (!address_id) {
    return res.status(400).json({ error: "Teslimat adresi zorunludur." });
  }

  if (!payment_type || !["cash", "credit_card"].includes(payment_type)) {
    return res.status(400).json({
      error: "Geçersiz ödeme tipi. 'cash' veya 'credit_card' olmalı.",
    });
  }

  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "registered";

  // Check if address exists for the user
  const addressQuery = user.isGuest
    ? "SELECT * FROM addresses WHERE id = ? AND guest_id = ?"
    : "SELECT * FROM addresses WHERE id = ? AND user_id = ?";
  const addressQueryId = user.isGuest ? guestId : userId;

  db.query(addressQuery, [address_id, addressQueryId], (err, addressResult) => {
    if (err) {
      return res.status(500).json({ error: "Adres kontrolü hatası" });
    }

    if (!addressResult.length) {
      return res
        .status(404)
        .json({ error: "Adres bulunamadı veya size ait değil." });
    }

    // Fetch the cart items
    const cartQuery = user.isGuest
      ? "SELECT c.*, p.base_price, p.options AS product_options FROM cart c JOIN products p ON c.product_id = p.id WHERE c.guest_id = ? AND c.user_type = ?"
      : "SELECT c.*, p.base_price, p.options AS product_options FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ? AND c.user_type = ?";
    const cartQueryId = user.isGuest ? guestId : userId;
    const cartUserType = user.isGuest ? "guest" : "registered";

    db.query(cartQuery, [cartQueryId, cartUserType], (err, cartItems) => {
      if (err) {
        return res.status(500).json({ error: "Sepet verisi hatası" });
      }

      if (!cartItems.length) {
        return res
          .status(400)
          .json({ error: "Sepetiniz boş, sipariş oluşturamazsınız." });
      }

      let totalAmount = 0;
      const orderItemsValues = cartItems.map((item) => {
        let unitPrice = item.base_price;

        if (item.options) {
          const productOptions = JSON.parse(item.product_options || "[]");
          const selectedOption = productOptions.find(
            (opt) => opt.name === item.options
          );
          unitPrice += selectedOption?.price_modifier || 0;
        }

        const itemPrice = unitPrice * item.quantity;
        totalAmount += itemPrice;

        return [
          item.product_id,
          item.quantity,
          unitPrice,
          item.options || null,
          item.note || null,
        ];
      });

      let appliedDiscount = 0;
      let couponCode = null;

      if (!coupon_code) {
        return proceedWithOrder();
      }

      // Validate coupon code
      const couponQuery = `
                SELECT * FROM coupons 
                WHERE code = ? AND active = 1 AND start_date <= NOW() AND end_date >= NOW() AND min_order_amount <= ?
              `;
      db.query(couponQuery, [coupon_code, totalAmount], (err, couponResult) => {
        if (err) {
          return res.status(500).json({ error: "Kupon kontrolü hatası" });
        }

        if (!couponResult.length) {
          return res
            .status(400)
            .json({ error: "Geçersiz veya süresi dolmuş kupon kodu." });
        }

        const coupon = couponResult[0];

        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
          return res
            .status(400)
            .json({ error: "Bu kupon kullanım limitine ulaştı." });
        }

        appliedDiscount =
          coupon.discount_type === "percent"
            ? (totalAmount * coupon.discount_amount) / 100
            : coupon.discount_type === "fixed"
            ? coupon.discount_amount
            : 0;

        totalAmount = Math.max(totalAmount - appliedDiscount, 0);
        couponCode = coupon_code;

        db.query(
          "UPDATE coupons SET usage_count = usage_count + 1, updated_at = ? WHERE id = ?",
          [moment().toDate(), coupon.id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: "Kupon güncelleme hatası" });
            }
            proceedWithOrder();
          }
        );
      });

      function proceedWithOrder() {
        // Insert the order
        const orderQuery = `
                  INSERT INTO orders (user_id, user_type, address_id, order_time, total_amount, payment_type, order_status, note, coupon_code, guest_id)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          couponCode,
          guestId,
        ];

        db.query(orderQuery, orderValues, (err, orderResult) => {
          if (err) {
            return res.status(500).json({ error: "Sipariş oluşturma hatası" });
          }

          const orderId = orderResult.insertId;

          // Insert the order items
          const orderItemsQuery = `
                    INSERT INTO order_items (order_id, product_id, quantity, unit_price, options, note)
                    VALUES ?
                  `;
          const orderItemsData = orderItemsValues.map((item) => [
            orderId,
            ...item,
          ]);

          db.query(orderItemsQuery, [orderItemsData], (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Sipariş ürünleri eklenirken hata oluştu" });
            }

            // Insert order status history
            db.query(
              "INSERT INTO order_status_history (order_id, old_status, new_status, changed_at, staff_id, note) VALUES (?, ?, ?, ?, ?, ?)",
              [
                orderId,
                null,
                "pending",
                moment().toDate(),
                null,
                "Sipariş oluşturuldu",
              ],
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .json({
                      error: "Sipariş durumu geçmişi eklenirken hata oluştu",
                    });
                }

                // Clear the cart
                const clearCartQuery = user.isGuest
                  ? "DELETE FROM cart WHERE guest_id = ? AND user_type = ?"
                  : "DELETE FROM cart WHERE user_id = ? AND user_type = ?";

                db.query(clearCartQuery, [cartQueryId, cartUserType], (err) => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ error: "Sepet temizlenirken hata oluştu" });
                  }

                  res.status(201).json({
                    status: "success",
                    message: "Sipariş başarıyla oluşturuldu.",
                    order_id: orderId,
                    total_amount: totalAmount,
                    applied_discount: appliedDiscount,
                  });
                });
              }
            );
          });
        });
      }
    });
  });
};

// Get orders for the authenticated user
const getOrders = (req, res) => {
  const user = req.user;
  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "registered";

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

  db.query(
    ordersQuery,
    [userId, userType, guestId, userType],
    (err, orders) => {
      if (err) {
        console.error("Sipariş sorgulama hatası:", err.message, err.stack);
        return res.status(500).json({ error: "Siparişler bulunamadı." });
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
            console.error(
              "Sipariş öğeleri sorgulama hatası:",
              err.message,
              err.stack
            );
            return res.status(500).json({ error: "Siparişler bulunamadı." });
          }

          db.query(
            "SELECT osh.* FROM order_status_history osh WHERE osh.order_id IN (?)",
            [orderIds],
            (err, statusHistory) => {
              if (err) {
                console.error(
                  "Durum geçmişi sorgulama hatası:",
                  err.message,
                  err.stack
                );
                return res
                  .status(500)
                  .json({ error: "Siparişler bulunamadı." });
              }

              const parsedResults = orders.map((order) => ({
                ...order,
                order_items: orderItems.filter(
                  (item) => item.order_id === order.id
                ),
                status_history: statusHistory.filter(
                  (item) => item.order_id === order.id
                ),
              }));

              res.status(200).json({
                status: "success",
                data: parsedResults,
              });
            }
          );
        }
      );
    }
  );
};

// Get all orders (admin only)
const getAllOrders = (req, res) => {
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
          console.error(
            "Sipariş öğeleri sorgulama hatası:",
            err.message,
            err.stack
          );
          return res.status(500).json({ error: "Siparişler sorgulanamadı." });
        }

        db.query(
          "SELECT osh.* FROM order_status_history osh WHERE osh.order_id IN (?)",
          [orderIds],
          (err, statusHistory) => {
            if (err) {
              console.error(
                "Durum geçmişi sorgulama hatası:",
                err.message,
                err.stack
              );
              return res
                .status(500)
                .json({ error: "Siparişler sorgulanamadı." });
            }

            const parsedResults = orders.map((order) => ({
              ...order,
              order_items: orderItems.filter(
                (item) => item.order_id === order.id
              ),
              status_history: statusHistory.filter(
                (item) => item.order_id === order.id
              ),
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

const updateOrderStatus = (req, res) => {
  const { order_id } = req.params;
  const { order_status, staff_id, note } = req.body;
  const updated_by = req.user.id;

  if (!order_id || !order_status) {
    return res
      .status(400)
      .json({ error: "Sipariş ID'si ve yeni durum zorunludur." });
  }

  const validStatuses = [
    "pending",
    "preparing",
    "on_the_way",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(order_status)) {
    return res.status(400).json({ error: "Geçersiz sipariş durumu." });
  }

  withTransaction(
    (connection, cb) => {
      connection.query(
        "SELECT order_status FROM orders WHERE id = ?",
        [order_id],
        (err, orderResult) => {
          if (err) {
            return cb(err);
          }

          if (!orderResult.length) {
            return cb(new Error("Sipariş bulunamadı."));
          }

          const oldStatus = orderResult[0].order_status;

          if (!staff_id) {
            return proceedWithUpdate();
          }

          connection.query(
            "SELECT * FROM staff WHERE id = ? AND status = 'active'",
            [staff_id],
            (err, staffResult) => {
              if (err) {
                return cb(err);
              }

              if (!staffResult.length) {
                return cb(
                  new Error("Geçersiz veya aktif olmayan personel ID'si.")
                );
              }

              proceedWithUpdate();
            }
          );

          function proceedWithUpdate() {
            connection.query(
              "UPDATE orders SET order_status = ?, staff_id = ?, updated_by = ?, updated_at = ? WHERE id = ?",
              [
                order_status,
                staff_id || null,
                updated_by,
                moment().toDate(),
                order_id,
              ],
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
                    staff_id || null,
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
    },
    (err) => {
      if (err) {
        console.error(
          "Sipariş durumu güncelleme hatası:",
          err.message,
          err.stack
        );
        return res
          .status(err.message.includes("bulunamadı") ? 404 : 500)
          .json({ error: err.message });
      }

      res.status(200).json({
        status: "success",
        message: "Sipariş durumu başarıyla güncellendi.",
      });
    }
  );
};

// Cancel an order (user action)
const cancelOrder = (req, res) => {
  const { order_id } = req.params;
  const user = req.user;
  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "registered";

  withTransaction(
    (connection, cb) => {
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

          if (!results.length) {
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
    },
    (err) => {
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
    }
  );
};

module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
