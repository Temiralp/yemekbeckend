// src/components/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Yönlendirme için useNavigate

function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fullName = `${name} ${surname}`;
    const userData = { name, surname, full_name: fullName, phone, email };

    try {
      const response = await axios.post("http://localhost:3000/auth/register", userData);
      console.log("Backend yanıtı:", response.data);

      navigate("/login");
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : err.message;
      setError(`Hata: ${errorMessage}`);
      console.error("Kayıt hatası:", err);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>Üye Ol</h1>

      {/* Kayıt Formu */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Adınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Soyadınız"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
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
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="E-posta (isteğe bağlı)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none" }}>
          Üye Ol
        </button>
      </form>

      {/* Hata Mesajı */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default Register;