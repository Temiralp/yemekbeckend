import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Switch from "react-switch"; // For toggling is_active
import "./Orders.css";

const AdminCategories = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(searchParams.get("page")) || 1;
  });
  const categoriesPerPage = 10;

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
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/categories");
        console.log("API Response:", response.data);
        const categoriesData = response.data.data || [];
        if (!Array.isArray(categoriesData)) {
          throw new Error("API'den dönen veri bir dizi değil.");
        }
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
      } catch (err) {
        console.error("Fetch Categories Error:", err);
        console.error("Error Response:", err.response);
        setError(err.response?.data?.error || "Kategoriler getirilemedi.");
      } finally {
        setLoading(false);
      }
    };

    if (admin) {
      fetchCategories();
    }
  }, [admin]);

  useEffect(() => {
    let filtered = [...categories];
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.id.toString().includes(searchTerm) ||
          (category.name &&
            category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredCategories(filtered);

    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    if (
      filtered.length > 0 &&
      pageFromUrl > Math.ceil(filtered.length / categoriesPerPage)
    ) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
    } else if (searchTerm) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
    } else {
      setCurrentPage(pageFromUrl);
    }
  }, [searchTerm, categories, searchParams, setSearchParams]);

  useEffect(() => {
    if (parseInt(searchParams.get("page")) !== currentPage) {
      setSearchParams({ page: currentPage.toString() });
    }
  }, [currentPage, searchParams, setSearchParams]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDelete = async (categoryId) => {
    if (window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        await api.delete(`/api/categories/${categoryId}`);
        setCategories(
          categories.filter((category) => category.id !== categoryId)
        );
      } catch (err) {
        setError(
          err.response?.data?.error || "Kategori silinirken bir hata oluştu."
        );
      }
    }
  };

  const handleSwitchChange = async (categoryId, checked) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) {
      setError("Kategori bulunamadı.");
      return;
    }

    const previousCategories = [...categories];
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? { ...category, is_active: checked }
          : category
      )
    );

    try {
      await api.put(`/api/categories/${categoryId}`, { is_active: checked });
    } catch (err) {
      setCategories(previousCategories);
      const errorMessage =
        err.response?.data?.error ||
        "Aktiflik durumu güncellenirken bir hata oluştu.";
      setError(errorMessage);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

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
        <h1 className="header-title">Kategori Yönetimi</h1>
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
        <section className="orders-section">
          <div className="filters">
            <input
              type="text"
              placeholder="ID veya Kategori Adı ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <div className="add-boss">
              <button onClick={() => navigate("/admin/categories/add")}>
                Kategori Ekle
              </button>
            </div>
          </div>

          {loading && <p className="loading">Yükleniyor...</p>}
          {error && <p className="error">{error}</p>}
          {filteredCategories.length === 0 && !loading && !error && (
            <p className="no-data">Kategori bulunamadı.</p>
          )}
          {filteredCategories.length > 0 && (
            <>
              <div className="table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Kategori Adı</th>
                      <th>Durum</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.is_active ? "Aktif" : "Deaktif"}</td>
                        <td>
                          <button
                            className="action-btn edit-btn"
                            onClick={() =>
                              navigate(`/admin/categories/edit/${category.id}`)
                            }
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(category.id)}
                          >
                            <FaTrash />
                          </button>
                          <Switch
                            checked={category.is_active}
                            onChange={(checked) =>
                              handleSwitchChange(category.id, checked)
                            }
                            offColor="#888"
                            onColor="#0f0"
                            offHandleColor="#fff"
                            onHandleColor="#fff"
                            height={20}
                            width={40}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="pagination"
                style={{ marginTop: "20px", textAlign: "center" }}
              >
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
                    className={`action-btn ${
                      currentPage === index + 1 ? "edit-btn" : ""
                    }`}
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

export default AdminCategories;
