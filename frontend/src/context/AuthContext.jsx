import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { isTokenExpired } from "../utils/auth";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || null);
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")) || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`; 
    } else {
      localStorage.removeItem("adminToken");
      delete api.defaults.headers.common["Authorization"];
    }
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("admin");
    }
  }, [adminToken, admin]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token && isTokenExpired(token)) {
      logout(); 
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        logout();
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [adminToken]);

  const login = (token, adminData) => {
    setAdminToken(token);
    setAdmin(adminData);
  };

  const logout = () => {
    setAdminToken(null);
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    delete api.defaults.headers.common["Authorization"];
    navigate("/admin/login"); 
  };

  return (
    <AuthContext.Provider value={{ adminToken, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;