import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const context = useContext(AuthContext);
  const { login, admin } = context || {}; 
  const navigate = useNavigate();

  if (!context) {
    console.error("AuthContext bulunamadı. AuthProvider ile sarmalandığından emin olun.");
    return <div>Context hatası: AuthProvider eksik.</div>;
  }

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken || admin) {
      navigate("/admin/dashboard");
    }
  }, [navigate, admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/staff/login", { email, password });
      const { token, staff } = response.data;
      login(token, staff);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Bir hata oluştu.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Yönetim Paneli Giriş</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>E-posta:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

// Stiller
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default AdminLogin;
