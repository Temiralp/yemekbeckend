import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar";
import "../Orders.css";

const AddCategory = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categoryData, setCategoryData] = useState({
    name: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/api/categories", {
        name: categoryData.name,
        description: categoryData.description,
      });
      setSuccess(response.data.message || "Kategori başarıyla eklendi!");
      setCategoryData({ name: "", description: "" });
      setTimeout(() => navigate("/admin/categories"), 2000); 
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Kategori eklenirken bir hata oluştu: " +
            (err.message || "Bilinmeyen hata")
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
        <h1 className="header-title">Yeni Kategori Ekle</h1>
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
          <form onSubmit={handleSubmit} className="coupon-form modern-form">
            <div className="form-group-row">
              <div className="form-group form-group-full">
                <label htmlFor="name">Kategori Adı</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={categoryData.name}
                  onChange={handleChange}
                  noUpperCase
                  required
                  placeholder="Kategori adını girin"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group form-group-full">
                <label htmlFor="description">Açıklama (Opsiyonel)</label>
                <textarea
                  id="description"
                  name="description"
                  value={categoryData.description}
                  onChange={handleChange}
                  placeholder="Kategori açıklamasını girin"
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn modern-submit-btn"
              disabled={loading}
            >
              {loading ? "Ekleniyor..." : "Kategoriyi Ekle"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddCategory;
