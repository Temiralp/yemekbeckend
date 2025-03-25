import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Switch from "react-switch"; // react-switch importu
import "./Orders.css";

const AdminProducts = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(searchParams.get("page")) || 1;
  });
  const productsPerPage = 10;

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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/products/");
        const productsData =
          response.data.data || response.data.products || response.data || [];
        if (!Array.isArray(productsData)) {
          throw new Error("API'den dönen veri bir dizi değil.");
        }
        setProducts(productsData);
        setFilteredProducts(productsData); // Include all products initially
      } catch (err) {
        setError(err.message || "Ürünler getirilemedi.");
      } finally {
        setLoading(false);
      }
    };

    if (admin) {
      fetchProducts();
    }
  }, [admin]);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.id.toString().includes(searchTerm) ||
          (product.name &&
            product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    const filterActiveStatus = searchParams.get("active");
    if (filterActiveStatus === "true") {
      filtered = filtered.filter((product) => product.is_active === true); 
    } else if (filterActiveStatus === "false") {
      filtered = filtered.filter((product) => product.is_active === false); 
    }
    setFilteredProducts(filtered);

    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    if (
      filtered.length > 0 &&
      pageFromUrl > Math.ceil(filtered.length / productsPerPage)
    ) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
    } else if (searchTerm) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
    } else {
      setCurrentPage(pageFromUrl);
    }
  }, [searchTerm, products, searchParams, setSearchParams]);

  useEffect(() => {
    if (parseInt(searchParams.get("page")) !== currentPage) {
      setSearchParams({ page: currentPage.toString() });
    }
  }, [currentPage, searchParams, setSearchParams]);

  const handleDelete = async (productId) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        await api.delete(`/api/products/${productId}`);
        setProducts(products.filter((product) => product.id !== productId));
      } catch (err) {
        setError("Ürün silinirken bir hata oluştu.");
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

  const handleSwitchChange = async (productId, checked) => {
    try {
      await api.put(`/api/products/${productId}`, { is_active: checked });
      setProducts(
        products.map((product) =>
          product.id === productId
            ? { ...product, is_active: checked }
            : product
        )
      );
    } catch (err) {
      setError("Aktiflik durumu güncellenirken bir hata oluştu.");
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];
  const totalPages = Math.ceil(
    Array.isArray(filteredProducts)
      ? filteredProducts.length / productsPerPage
      : 0
  );

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
        <h1 className="header-title">Ürün Yönetimi</h1>
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
              placeholder="ID, Ürün Adı veya Açıklama ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <div className="add-boss">
              <button onClick={() => navigate("/admin/products/add")}>
                Ürün Ekle
              </button>
            </div>
          </div>

          {loading && <p className="loading">Yükleniyor...</p>}
          {error && <p className="error">{error}</p>}
          {filteredProducts.length === 0 && !loading && !error && (
            <p className="no-data">Ürün bulunamadı.</p>
          )}
          {filteredProducts.length > 0 && (
            <>
              <div className="table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Resim</th>
                      <th>Ürün Adı</th>
                      <th>Açıklama</th>
                      <th>Fiyat</th>
                      <th>Stok</th>
                      <th>Kategori</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <img
                              src="https://via.placeholder.com/50"
                              alt="Placeholder"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.description || "Belirtilmemiş"}</td>
                        <td>
                          {product.base_price
                            ? `${product.base_price} TL`
                            : "Belirtilmemiş"}
                        </td>
                        <td>
                          {product.stock !== undefined
                            ? product.stock
                            : "Belirtilmemiş"}
                        </td>
                        <td>{product.category_id || "Belirtilmemiş"}</td>
                        <td>
                          <button
                            className="action-btn edit-btn"
                            onClick={() =>
                              navigate(`/admin/products/edit/${product.id}`)
                            }
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(product.id)}
                          >
                            <FaTrash />
                          </button>
                          <Switch
                            checked={product.is_active}
                            onChange={(checked) =>
                              handleSwitchChange(product.id, checked)
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

export default AdminProducts;
