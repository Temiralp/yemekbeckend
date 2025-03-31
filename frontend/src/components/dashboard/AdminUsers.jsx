import React, { useContext, useEffect, useState } from "react";
import { useNavigate, NavLink, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import Sidebar from "./Sidebar";
import "./Orders.css";

const AdminUsers = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(searchParams.get("page")) || 1;
  });
  const usersPerPage = 10;

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
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/auth/users");
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (err) {
        setError(err.response?.data?.error || "Kullanıcılar getirilemedi.");
      } finally {
        setLoading(false);
      }
    };

    if (admin) {
      fetchUsers();
    }
  }, [admin]);

  useEffect(() => {
    let filtered = [...users];
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.id.toString().includes(searchTerm) ||
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredUsers(filtered);

    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    if (filtered.length > 0 && pageFromUrl > Math.ceil(filtered.length / usersPerPage)) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
    } else if (searchTerm) {
      setCurrentPage(1);
      setSearchParams({ page: "1" });
    } else {
      setCurrentPage(pageFromUrl);
    }
  }, [searchTerm, users, searchParams, setSearchParams]);

  useEffect(() => {
    if (parseInt(searchParams.get("page")) !== currentPage) {
      setSearchParams({ page: currentPage.toString() });
    }
  }, [currentPage, searchParams, setSearchParams]);

  const handleDelete = async (userId) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        await api.delete(`/auth/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        setError("Kullanıcı silinirken bir hata oluştu.");
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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
        <h1 className="header-title">Kullanıcı Yönetimi</h1>
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
          // handleLogoutClick={x}
        />
      </aside>

      <main
        className={`main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <section className="orders-section">
          <div className="filters">
            <input
              type="text"
              placeholder="ID, Ad, Telefon veya Email ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <div className="add-boss">
                    <button>Kullanıcı Ekle</button>
            </div>
          </div>

          {loading && <p className="loading">Yükleniyor...</p>}
          {error && <p className="error">{error}</p>}
          {filteredUsers.length === 0 && !loading && !error && (
            <p className="no-data">Kullanıcı bulunamadı.</p>
          )}
          {filteredUsers.length > 0 && (
            <>
              <div className="table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tam Ad</th>
                      <th>Telefon</th>
                      <th>Email</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.full_name}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(user.id)}
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

export default AdminUsers;