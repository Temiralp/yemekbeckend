import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaAngleDown,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";

const Sidebar = ({ isSidebarOpen, toggleSidebar, handleLogoutClick }) => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProductDropdown = () => {
    if (!isSidebarOpen) {
      navigate("/admin/products");
    } else {
      setIsProductDropdownOpen(!isProductDropdownOpen);
    }
  };
  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">_</h2>
        <button className="close-sidebar" onClick={toggleSidebar}>
          ✕
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaTachometerAlt className="menu-icon" />
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaShoppingCart className="menu-icon" />
              <span className="menu-text">Siparişler</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUsers className="menu-icon" />
              <span className="menu-text">Kullanıcılar</span>
            </NavLink>
          </li>

          <li className="dropdown">
            <div className="dropdown-toggle" onClick={toggleProductDropdown}>
              <FaShoppingCart className="menu-icon" />
              <span className="menu-text">Ürün Yönetimi</span>
              <FaAngleDown
                className={`dropdown-arrow ${
                  isProductDropdownOpen ? "open" : ""
                }`}
              />
            </div>
            <div
              className={`dropdown-menu-container ${
                isProductDropdownOpen ? "open" : ""
              }`}
            >
              <ul className="dropdown-menu">
                <li>
                  <NavLink
                    to="/admin/products"
                    onClick={toggleSidebar}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <span className="menu-text">Ürünler</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/categories"
                    onClick={toggleSidebar}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <span className="menu-text">Kategoriler</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <NavLink
              to="/admin/coupons"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUsers className="menu-icon" />
              <span className="menu-text">Kuponlar</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reports"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaTachometerAlt className="menu-icon" />
              <span className="menu-text">Raporlar</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/settings"
              onClick={toggleSidebar}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaCog className="menu-icon" />
              <span className="menu-text">Ayarlar</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={handleLogoutClick}
              style={{ background: "#c0392b" }}
              className="logout-link"
            >
              <CiLogout style={{ fontSize: "20px", fontWeight: "bold" }} />
              <span className="menu-text">Çıkış Yap</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
