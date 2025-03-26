import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar";
import Switch from "react-switch"; // react-switch kütüphanesini import et
import "../Orders.css";

const EditCategory = () => {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // URL'den kategori ID'sini al
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    is_active: true, // Varsayılan olarak aktif
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Kategori verilerini yükle
  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    } else {
      const fetchCategory = async () => {
        try {
          const response = await api.get(`/api/categories/${id}`);
          const { name, description, is_active } = response.data.data || {};
          setCategoryData({
            name: name || "",
            description: description || "",
            is_active: typeof is_active === "boolean" ? is_active : true, // Varsayılan aktif
          });
        } catch (err) {
          setError(
            "Kategori yüklenirken bir hata oluştu: " + (err.message || "Bilinmeyen hata")
          );
          navigate("/admin/categories"); // Hata varsa kategoriler sayfasına dön
        }
      };
      fetchCategory();
    }
  }, [admin, id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked) => {
    setCategoryData((prev) => ({
      ...prev,
      is_active: checked, // Switch'in yeni değeriyle güncelle
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put(`/api/categories/${id}`, {
        name: categoryData.name,
        description: categoryData.description,
        is_active: categoryData.is_active, // Aktiflik durumu da gönderiliyor
      });
      setSuccess(response.data.message || "Kategori başarıyla güncellendi!");
      setTimeout(() => navigate("/admin/categories"), 2000); // Kategoriler sayfasına yönlendir
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Kategori güncellenirken bir hata oluştu: " + (err.message || "Bilinmeyen hata")
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
        <h1 className="header-title">Kategoriyi Düzenle</h1>
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

            <div className="form-group-row">
              <div className="form-group form-group-full">
                <label>Aktiflik Durumu</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Switch
                    onChange={handleSwitchChange}
                    checked={categoryData.is_active}
                    offColor="#888" // Kapalıyken gri
                    onColor="#0f0" // Açıkken yeşil
                    offHandleColor="#fff" // Kapalıyken tutamaç beyaz
                    onHandleColor="#fff" // Açıkken tutamaç beyaz
                    height={20} // Yükseklik
                    width={40} // Genişlik
                  />
                  <span>{categoryData.is_active ? "Aktif" : "Pasif"}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn modern-submit-btn"
              disabled={loading}
            >
              {loading ? "Güncelleniyor..." : "Kategoriyi Güncelle"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default EditCategory;