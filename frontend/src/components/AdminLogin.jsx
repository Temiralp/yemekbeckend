import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, userType, admin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Eğer zaten admin girişi yapılmışsa dashboard'a yönlendir
    if (userType === "admin" || admin) {
      navigate("/admin/dashboard");
    }
  }, [navigate, userType, admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/staff/login", { 
        email, 
        password 
      });
      
      const { token, staff } = response.data;
      
      // Açıkça admin türünü belirterek giriş yap
      login(token, staff, "admin");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Giriş sırasında bir hata oluştu.";
      console.error("Yönetici giriş hatası:", err.response?.status, errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>Yönetim Paneli Girişi</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-posta:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="E-posta adresinizi girin"
            />
          </div>
          <div className="form-group">
            <label>Şifre:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Şifrenizi girin"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;