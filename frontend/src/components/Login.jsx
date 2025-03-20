import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const userData = { phone };

    try {
      const response = await axios.post("http://localhost:3000/auth/login", userData);
      console.log("Backend yanıtı:", response.data);

      console.log("SMS Gönderim Şablonu:");
      console.log(`Telefon: ${phone}, Doğrulama Kodu: 123456`);

      navigate("/verify-code", { state: { phone } });
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : err.message;
      setError(`Giriş hatası: ${errorMessage}`);
      console.error("Giriş hatası:", err);
    }
  };

  const handleGuestLogin = async () => {
    setError("");

    const deviceData = {
      device_id: "test-device-123",
      device_type: "Android",
      device_model: "Samsung Galaxy S21", 
    };

    try {
      const response = await axios.post("http://localhost:3000/auth/guest-login", deviceData);
      console.log("Guest login yanıtı:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("guest_user_id", response.data.guest_user_id);

      alert("Misafir girişi başarılı!");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : err.message;
      setError(`Misafir giriş hatası: ${errorMessage}`);
      console.error("Misafir giriş hatası:", err);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>Giriş Yap</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="tel"
            placeholder="Telefon Numaranız (+90)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#28a745", color: "#fff", border: "none" }}>
          Doğrulama Kodu Gönder
        </button>
      </form>

      <button
        onClick={handleGuestLogin}
        style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none", marginTop: "10px" }}
      >
        Üye Olmadan Devam Et
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <p style={{ marginTop: "10px" }}>
        Hesabınız yok mu? <a href="/register">Üye Ol</a>
      </p>
    </div>
  );
}

export default Login;