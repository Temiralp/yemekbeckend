import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (err) {
        setError(
          "Profil yüklenemedi: " + (err.response?.data?.error || err.message)
        );
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Token'ı istemci tarafında sil
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("guest_user_id");
      alert("Oturum başarıyla kapatıldı.");
      navigate("/login");
    } catch (err) {
      setError(
        "Çıkış yapılamadı: " + (err.response?.data?.error || err.message)
      );
    }
  };

  if (!user) return <div>Yükleniyor...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Profil Sayfası</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <h2>Kullanıcı Bilgileri</h2>
        <p>
          <strong>Kullanıcı Tipi:</strong>{" "}
          {user.type === "guest" ? "Misafir Kullanıcı" : "Normal Kullanıcı"}
        </p>
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        {user.type === "normal" && (
          <>
            <p>
              <strong>Telefon:</strong> {user.phone}
            </p>
          </>
        )}
        {user.type === "guest" && (
          <>
            <p>
              <strong>Cihaz ID'si:</strong> {user.device_id}
            </p>
            <p>
              <strong>Cihaz Tipi:</strong> {user.device_type}
            </p>
            <p>
              <strong>Cihaz Modeli:</strong> {user.device_model}
            </p>
          </>
        )}
      </div>
      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}

export default Profile;
