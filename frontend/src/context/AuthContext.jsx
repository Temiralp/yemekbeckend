import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || null);
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")) || null);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("admin");
    }
  }, [adminToken, admin]);

  const login = (token, adminData) => {
    setAdminToken(token);
    setAdmin(adminData);
  };

  const logout = () => {
    setAdminToken(null);
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ adminToken, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;