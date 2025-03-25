import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar";
import "../Orders.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddCoupon = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [couponData, setCouponData] = useState({
    code: "",
    discount_type: "percentage",
    discount_amount: "",
    min_order_amount: "0",
    start_date: null,
    end_date: null,
    usage_limit: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  const generateCouponCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let code = "";
    
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    for (let i = 0; i < 2; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    for (let i = 0; i < 2; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    setCouponData((prev) => ({ ...prev, code }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "code" ? value.toUpperCase().slice(0, 8) : value;
    setCouponData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleDateChange = (date, name) => {
    setCouponData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        ...couponData,
        discount_amount: Number(couponData.discount_amount),
        min_order_amount: Number(couponData.min_order_amount),
        usage_limit: couponData.usage_limit
          ? Number(couponData.usage_limit)
          : null,
        start_date: couponData.start_date
          ? couponData.start_date.toISOString().split("T")[0]
          : "",
        end_date: couponData.end_date
          ? couponData.end_date.toISOString().split("T")[0]
          : "",
      };
      const response = await api.post("/api/coupon/", payload);
      setSuccess(response.data.message || "Kupon başarıyla eklendi!");
      setTimeout(() => navigate("/admin/coupons"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Kupon eklenirken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!admin) return null;

  return (
    <div className="admin-coupon">
      <header className="header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isSidebarOpen ? "menu-icon-open" : "menu-icon-closed"}
          >
            <path
              className="line1"
              d="M4 6H20"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="line2"
              d="M4 12H14"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="line3"
              d="M4 18H9"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="header-title">Yeni Kupon Ekle</h1>
      </header>

      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </aside>

      <main
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <section className="coupon-form-section">
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form onSubmit={handleSubmit} className="coupon-form">
            {/* Grup 1: Kupon Kodu ve İndirim Tipi */}
            <div className="form-group-row">
              <div className="form-group code-group">
                <label htmlFor="code">Kupon Kodu</label>
                <div className="code-input-wrapper">
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={couponData.code}
                    onChange={handleChange}
                    maxLength={8} // HTML attribute for max length
                    required
                  />
                  <button
                    type="button"
                    className="generate-btn"
                    onClick={generateCouponCode}
                  >
                    Oluştur
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="discount_type">İndirim Tipi</label>
                <select
                  id="discount_type"
                  name="discount_type"
                  value={couponData.discount_type || "percentage"}
                  onChange={handleChange}
                  required
                >
                  <option value="percentage">Yüzde (%)</option>
                  <option value="fixed">Sabit Tutar</option>
                </select>
              </div>
            </div>

            {/* Rest of the form remains the same */}
            <div className="form-group-row form-group-row-triple">
              <div className="form-group">
                <label htmlFor="discount_amount">İndirim Miktarı</label>
                <input
                  type="number"
                  id="discount_amount"
                  name="discount_amount"
                  value={couponData.discount_amount}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="min_order_amount">Minimum Sipariş Tutarı</label>
                <input
                  type="number"
                  id="min_order_amount"
                  name="min_order_amount"
                  value={couponData.min_order_amount}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="usage_limit">Kullanım Limiti</label>
                <input
                  type="number"
                  id="usage_limit"
                  name="usage_limit"
                  value={couponData.usage_limit}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="start_date">Başlangıç Tarihi</label>
                <DatePicker
                  selected={couponData.start_date}
                  onChange={(date) => handleDateChange(date, "start_date")}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Başlangıç Tarihi"
                  className="custom-datepicker"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_date">Bitiş Tarihi</label>
                <DatePicker
                  selected={couponData.end_date}
                  onChange={(date) => handleDateChange(date, "end_date")}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Bitiş Tarihi"
                  className="custom-datepicker"
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group form-group-full">
                <label htmlFor="description">Açıklama (Opsiyonel)</label>
                <textarea
                  id="description"
                  name="description"
                  value={couponData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Ekleniyor..." : "Kuponu Ekle"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddCoupon;