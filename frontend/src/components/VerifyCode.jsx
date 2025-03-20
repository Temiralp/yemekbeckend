import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyCode() {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const navigate = useNavigate();
  const location = useLocation();

  const { phone } = location.state || {};

  if (!phone) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Doğrulama kodunun süresi doldu. Lütfen tekrar kod isteyin.");
      navigate("/login");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/verify-code", {
        phone,
        code: verificationCode,
      });
      console.log("Doğrulama yanıtı:", response.data);

      // Token ve user_id'yi 
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("user_type", response.data.user_type);
      

      alert("Giriş başarılı!");
      navigate("/profile");
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : err.message;
      setError(`Doğrulama hatası: ${errorMessage}`);
      console.error("Doğrulama hatası:", err);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>Doğrulama Kodu</h1>
      <p>Telefon numaranıza ({phone}) 6 haneli bir doğrulama kodu gönderdik.</p>
      <p style={{ color: "gray" }}>(Şimdilik doğrulama kodu: 123456)</p>
      <p>
        Kalan süre: <span style={{ color: timeLeft <= 30 ? "red" : "black", fontWeight: "bold" }}>{formatTime(timeLeft)}</span>
      </p>

      <form onSubmit={handleVerification}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Doğrulama Kodu"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            maxLength="6"
            style={{ width: "100%", padding: "8px", textAlign: "center", letterSpacing: "5px", fontSize: "16px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#28a745", color: "#fff", border: "none" }}>
          Doğrula
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <p style={{ marginTop: "10px" }}>
        Kod almadınız mı? <a href="/login">Tekrar Gönder</a>
      </p>
    </div>
  );
}

export default VerifyCode;