import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "./Orders.css";

const AdminCoupons = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(searchParams.get("page")) || 1;
  });
  const couponsPerPage = 10;

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/api/coupon/");
        console.log("API Response:", response.data);
        // API'den gelen verinin doğru alanını alalım
        const couponData = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.coupons || [];
        console.log("Processed Coupon Data:", couponData);
        setCoupons(couponData);
        setFilteredCoupons(couponData);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.error || "Kuponlar getirilemedi.");
        setCoupons([]);
        setFilteredCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    if (admin) {
      fetchCoupons();
    }
  }, [admin]);

  useEffect(() => {
    let filtered = [...coupons];
    if (searchTerm) {
      filtered = filtered.filter(
        (coupon) =>
          (coupon.code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (coupon.description &&
            coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    console.log("Filtered Coupons:", filtered);
    setFilteredCoupons(filtered);

    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    if (filtered.length > 0 && pageFromUrl > Math.ceil(filtered.length / couponsPerPage)) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
    } else if (searchTerm) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
    } else {
      setCurrentPage(pageFromUrl);
    }
  }, [searchTerm, coupons, searchParams, setSearchParams]);

  useEffect(() => {
    if (parseInt(searchParams.get("page")) !== currentPage) {
      setSearchParams({ page: currentPage.toString() });
    }
  }, [currentPage, searchParams, setSearchParams]);

  const handleDelete = async (couponId) => {
    if (window.confirm("Bu kuponu silmek istediğinizden emin misiniz?")) {
      try {
        await api.delete(`/api/coupon/${couponId}`);
        setCoupons(coupons.filter((coupon) => coupon.id !== couponId));
      } catch (err) {
        setError("Kupon silinirken bir hata oluştu.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Bilinmiyor";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Geçersiz Tarih" : date.toLocaleDateString("tr-TR");
  };

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!admin) return null;

  return (
    <div className="admin-orders">
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
        <h1 className="header-title">Kupon Yönetimi</h1>
      </header>

      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </aside>

      <main
        className={`main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <section className="orders-section">
          <div className="filters">
            <input
              type="text"
              placeholder="Kupon Kodu veya Açıklama ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <div className="add-boss">
              <button onClick={() => navigate("/admin/coupons/add")}>
                Kupon Ekle
              </button>
            </div>
          </div>

          {loading && <p className="loading">Yükleniyor...</p>}
          {error && <p className="error">{error}</p>}
          {filteredCoupons.length === 0 && !loading && !error && (
            <p className="no-data">Kupon bulunamadı.</p>
          )}
          {filteredCoupons.length > 0 && (
            <>
              <div className="table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Kupon Kodu</th>
                      <
th>İndirim Tipi</th>
                      <th>İndirim Miktarı</th>
                      <th>Min. Sipariş Tutarı</th>
                      <th>Başlangıç Tarihi</th>
                      <th>Bitiş Tarihi</th>
                      <th>Kullanım Limiti</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCoupons.map((coupon) => (
                      <tr key={coupon.id}>
                        <td>{coupon.code || "Bilinmiyor"}</td>
                        <td>{coupon.discount_type === "percentage" ? "Yüzde (%)" : "Sabit Tutar"}</td>
                        <td>{coupon.discount_amount || "0"}</td>
                        <td>{coupon.min_order_amount || "0"}</td>
                        <td>{formatDate(coupon.start_date)}</td>
                        <td>{formatDate(coupon.end_date)}</td>
                        <td>{coupon.usage_limit || "Sınırsız"}</td>
                        <td>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => navigate(`/admin/coupons/edit/${coupon.id}`)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(coupon.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="action-btn"
                  style={{ margin: "0 10px" }}
                >
                  Önceki
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageClick(index + 1)}
                    className={`action-btn ${currentPage === index + 1 ? "edit-btn" : ""}`}
                    style={{ margin: "0 5px" }}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="action-btn"
                  style={{ margin: "0 10px" }}
                >
                  Sonraki
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminCoupons;