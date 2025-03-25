const db = require("../config/db");
const moment = require("moment");

const withTransaction = async (callback) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const createOrder = (req, res) => {
  const { address_id, payment_type, note, coupon_code } = req.body;
  const user = req.user;

  if (!address_id) {
    return res.status(400).json({ error: "Teslimat adresi zorunludur." });
  }

  if (!payment_type || !["cash", "credit_card"].includes(payment_type)) {
    return res
      .status(400)
      .json({
        error: "Geçersiz ödeme tipi. 'cash' veya 'credit_card' olmalı.",
      });
  }

  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "registered";

  withTransaction(async (connection) => {
    const addressQuery = user.isGuest
      ? "SELECT * FROM addresses WHERE id = ? AND guest_id = ?"
      : "SELECT * FROM addresses WHERE id = ? AND user_id = ?";

    const addressQueryId = user.isGuest ? guestId : userId;

    const [addressResult] = await connection.query(addressQuery, [
      address_id,
      addressQueryId,
    ]);
    if (addressResult.length === 0) {
      throw new Error("Adres bulunamadı veya size ait değil.");
    }

    // Sepeti al
    const cartQuery = user.isGuest
      ? "SELECT c.*, p.base_price, p.options AS product_options FROM cart c JOIN products p ON c.product_id = p.id WHERE c.guest_id = ? AND c.user_type = ?"
      : "SELECT c.*, p.base_price, p.options AS product_options FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ? AND c.user_type = ?";

    const cartQueryId = user.isGuest ? guestId : userId;
    const cartUserType = user.isGuest ? "guest" : "registered";

    const [cartItems] = await connection.query(cartQuery, [
      cartQueryId,
      cartUserType,
    ]);
    if (cartItems.length === 0) {
      throw new Error("Sepetiniz boş, sipariş oluşturamazsınız.");
    }

    let totalAmount = 0;
    const orderItemsValues = cartItems.map((item) => {
      let unitPrice = item.base_price;

      if (item.options) {
        const selectedOption = JSON.parse(item.product_options).find(
          (opt) => opt.name === item.options
        );
        if (selectedOption && selectedOption.price_modifier) {
          unitPrice += selectedOption.price_modifier;
        }
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

    if (coupon_code) {
      const couponQuery = `
        SELECT * FROM coupons 
        WHERE 
          code = ? AND 
          active = 1 AND 
          start_date <= NOW() AND 
          end_date >= NOW() AND 
          min_order_amount <= ?
      `;

      const [couponResult] = await connection.query(couponQuery, [
        coupon_code,
        totalAmount,
      ]);
      if (couponResult.length === 0) {
        throw new Error("Geçersiz veya süresi dolmuş kupon kodu.");
      }

      const coupon = couponResult[0];

      if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        throw new Error("Bu kupon kullanım limitine ulaştı.");
      }

      if (coupon.discount_type === "percent") {
        appliedDiscount = (totalAmount * coupon.discount_amount) / 100;
      } else if (coupon.discount_type === "fixed") {
        appliedDiscount = coupon.discount_amount;
      }

      totalAmount -= appliedDiscount;
      if (totalAmount < 0) totalAmount = 0;

      const updateCouponQuery = `
        UPDATE coupons 
        SET 
          usage_count = usage_count + 1,
          updated_at = ?
        WHERE 
          id = ?
      `;

      await connection.query(updateCouponQuery, [moment().toDate(), coupon.id]);
      couponCode = coupon_code;
    }

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

    const [orderResult] = await connection.query(orderQuery, orderValues);
    const orderId = orderResult.insertId;

    const orderItemsQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, options, note)
      VALUES ?
    `;

    const orderItemsData = orderItemsValues.map((item) => [orderId, ...item]);
    await connection.query(orderItemsQuery, [orderItemsData]);

    const statusHistoryQuery = `
      INSERT INTO order_status_history (order_id, old_status, new_status, changed_at, staff_id, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const statusHistoryValues = [
      orderId,
      null,
      "pending",
      moment().toDate(),
      null,
      "Sipariş oluşturuldu",
    ];

    await connection.query(statusHistoryQuery, statusHistoryValues);

    // Sepeti temizle
    const clearCartQuery = user.isGuest
      ? "DELETE FROM cart WHERE guest_id = ? AND user_type = ?"
      : "DELETE FROM cart WHERE user_id = ? AND user_type = ?";

    await connection.query(clearCartQuery, [cartQueryId, cartUserType]);

    return res.status(201).json({
      status: "success",
      message: "Sipariş başarıyla oluşturuldu.",
      order_id: orderId,
      total_amount: totalAmount,
      applied_discount: appliedDiscount,
    });
  }).catch((err) => {
    console.error("Sipariş oluşturma hatası:", err.message);
    res
      .status(err.message.includes("bulunamadı") ? 404 : 500)
      .json({ error: err.message });
  });
};

const getOrders = (req, res) => {
  const user = req.user;
  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "registered";

  const query = `
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
      sc.full_name AS coupon_created_by_name,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'options', oi.options,
          'note', oi.note
        )
      ) AS order_items,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', osh.id,
          'order_id', osh.order_id,
          'old_status', osh.old_status,
          'new_status', osh.new_status,
          'changed_at', osh.changed_at,
          'staff_id', osh.staff_id,
          'note', osh.note
        )
      ) AS status_history
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
    LEFT JOIN 
      order_items oi ON o.id = oi.order_id
    LEFT JOIN 
      order_status_history osh ON o.id = osh.order_id
    WHERE 
      (o.user_id = ? AND o.user_type = ?) OR (o.guest_id = ? AND o.user_type = ?)
    GROUP BY 
      o.id
    ORDER BY 
      o.order_time DESC
  `;

  db.query(query, [userId, userType, guestId, userType], (err, results) => {
    if (err) {
      console.error("Sipariş sorgulama hatası:", err);
      return res.status(500).json({ error: "Siparişler bulunamadi." });
    }

    // JSON verilerini parse et
    const parsedResults = results.map((order) => ({
      ...order,
      order_items: order.order_items ? JSON.parse(order.order_items) : [],
      status_history: order.status_history
        ? JSON.parse(order.status_history)
        : [],
    }));

    res.status(200).json({
      status: "success",
      data: parsedResults,
    });
  });
};

const getAllOrders = (req, res) => {
  const query = `
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
      sc.full_name AS coupon_created_by_name,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'options', oi.options,
          'note', oi.note
        )
      ) AS order_items,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', osh.id,
          'order_id', osh.order_id,
          'old_status', osh.old_status,
          'new_status', osh.new_status,
          'changed_at', osh.changed_at,
          'staff_id', osh.staff_id,
          'note', osh.note
        )
      ) AS status_history
    FROM 
      orders o
    JOIN 
      addresses a ON o.address_id = a.id
    LEFT JOIN 
      staff s ON o.staff_id = s.id
    LEFT JOIN 
      staff su ON o.updated_by = su.id
    LEFT SearchBar.js JOIN 
      coupons c ON o.coupon_code = c.code
    LEFT JOIN 
      staff sc ON c.created_by = sc.id
    LEFT JOIN 
      order_items oi ON o.id = oi.order_id
    LEFT JOIN 
      order_status_history osh ON o.id = osh.order_id
    GROUP BY 
      o.id
    ORDER BY 
      o.order_time DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Sipariş sorgulama hatası:", err);
      return res.status(500).json({ error: "Siparişler sorgulanamadı." });
    }

    // JSON verilerini parse et
    const parsedResults = results.map((order) => ({
      ...order,
      order_items: order.order_items ? JSON.parse(order.order_items) : [],
      status_history: order.status_history
        ? JSON.parse(order.status_history)
        : [],
    }));

    res.status(200).json({
      status: "success",
      data: parsedResults,
    });
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

  if (
    !["pending", "preparing", "on_the_way", "delivered", "cancelled"].includes(
      order_status
    )
  ) {
    return res.status(400).json({ error: "Geçersiz sipariş durumu." });
  }

  withTransaction(async (connection) => {
    const getOrderQuery = `
      SELECT order_status FROM orders 
      WHERE id = ?
    `;

    const [orderResult] = await connection.query(getOrderQuery, [order_id]);
    if (orderResult.length === 0) {
      throw new Error("Sipariş bulunamadı.");
    }

    const oldStatus = orderResult[0].order_status;

    if (staff_id) {
      const staffQuery = `
        SELECT * FROM staff 
        WHERE id = ? AND status = 'active'
      `;

      const [staffResult] = await connection.query(staffQuery, [staff_id]);
      if (staffResult.length === 0) {
        throw new Error("Geçersiz veya aktif olmayan personel ID'si.");
      }
    }

    const updateQuery = `
      UPDATE orders 
      SET 
        order_status = ?,
        staff_id = ?,
        updated_by = ?,
        updated_at = ?
      WHERE 
        id = ?
    `;

    await connection.query(updateQuery, [
      order_status,
      staff_id || null,
      updated_by,
      moment().toDate(),
      order_id,
    ]);

    const statusHistoryQuery = `
      INSERT INTO order_status_history (order_id, old_status, new_status, changed_at, staff_id, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const statusHistoryValues = [
      order_id,
      oldStatus,
      order_status,
      moment().toDate(),
      staff_id || null,
      note || "Sipariş durumu güncellendi",
    ];

    await connection.query(statusHistoryQuery, statusHistoryValues);

    return res.status(200).json({
      status: "success",
      message: "Sipariş durumu başarıyla güncellendi.",
    });
  }).catch((err) => {
    console.error("Sipariş durumu güncelleme hatası:", err.message);
    res
      .status(err.message.includes("bulunamadı") ? 404 : 500)
      .json({ error: err.message });
  });
};

const cancelOrder = (req, res) => {
  const { order_id } = req.params;
  const user = req.user;
  const userId = user.isGuest ? null : user.id;
  const guestId = user.isGuest ? user.id : null;
  const userType = user.isGuest ? "guest" : "registered";

  withTransaction(async (connection) => {
    const query = `
      SELECT * FROM orders 
      WHERE 
        id = ? AND 
        ((user_id = ? AND user_type = ?) OR (guest_id = ? AND user_type = ?))
    `;

    const [results] = await connection.query(query, [
      order_id,
      userId,
      userType,
      guestId,
      userType,
    ]);
    if (results.length === 0) {
      throw new Error("Sipariş bulunamadı veya size ait değil.");
    }

    const order = results[0];

    if (order.order_status === "delivered") {
      throw new Error("Teslim edilmiş siparişler iptal edilemez.");
    }

    if (order.order_status === "cancelled") {
      throw new Error("Sipariş zaten iptal edilmiş.");
    }

    const updateQuery = `
      UPDATE orders 
      SET 
        order_status = 'cancelled',
        updated_at = ?
      WHERE 
        id = ?
    `;

    await connection.query(updateQuery, [moment().toDate(), order_id]);

    const statusHistoryQuery = `
      INSERT INTO order_status_history (order_id, old_status, new_status, changed_at, staff_id, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const statusHistoryValues = [
      order_id,
      order.order_status,
      "cancelled",
      moment().toDate(),
      null,
      "Sipariş kullanıcı tarafından iptal edildi",
    ];

    await connection.query(statusHistoryQuery, statusHistoryValues);

    return res.status(200).json({
      status: "success",
      message: "Sipariş başarıyla iptal edildi.",
    });
  }).catch((err) => {
    console.error("Sipariş iptal etme hatası:", err.message);
    res
      .status(err.message.includes("bulunamadı") ? 404 : 500)
      .json({ error: err.message });
  });
};

module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
