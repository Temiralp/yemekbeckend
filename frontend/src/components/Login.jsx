import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase.config";

function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth nesnesi tanımlı değil!");
      setError("Firebase yapılandırması hatalı, lütfen geliştiriciyle iletişime geçin.");
      return;
    }

    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (!recaptchaContainer) {
      console.error("reCAPTCHA container bulunamadı!");
      setError("reCAPTCHA yüklenemedi, lütfen sayfayı yenileyin.");
      return;
    }

    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: (response) => {
            console.log("reCAPTCHA çözüldü:", response);
          },
          "expired-callback": () => {
            console.log("reCAPTCHA süresi doldu!");
            setError("reCAPTCHA süresi doldu, lütfen tekrar deneyin.");
          },
        }
      );
      recaptchaVerifierRef.current.appVerificationDisabledForTesting = true; // Test modunu aktif et
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      setError("Lütfen geçerli bir 10 haneli telefon numarası girin (5XX XXX XX XX).");
      return;
    }

    const phoneNumber = `+90${cleanedPhone}`;
    const appVerifier = recaptchaVerifierRef.current;

    console.log("Telefon numarası:", phoneNumber);
    console.log("reCAPTCHA Verifier:", appVerifier);
    console.log("Firebase Auth:", auth);

    try {
      if (!appVerifier) {
        throw new Error("reCAPTCHA verifier başlatılamadı!");
      }
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      console.log("Doğrulama kodu gönderildi!", result);
    } catch (err) {
      setError(`SMS gönderim hatası: ${err.message}`);
      console.error("SMS gönderim hatası:", err);
      if (err.code === "auth/too-many-requests") {
        setError("Çok fazla istek yapıldı, lütfen bir süre bekleyip tekrar deneyin.");
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      console.log("Kullanıcı doğrulandı:", user);
      const idToken = await user.getIdToken();

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", idToken);
        navigate("/profile");
      } else {
        setError(data.error || "Giriş başarısız.");
      }
    } catch (err) {
      setError(`Kod doğrulama hatası: ${err.message}`);
      console.error("Kod doğrulama hatası:", err);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>Giriş Yap</h1>
      <div id="recaptcha-container"></div>
      {!confirmationResult ? (
        <form onSubmit={handleSendCode}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="tel"
              placeholder="Telefon Numaranız (5XX XXX XX XX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#28a745",
              color: "#fff",
              border: "none",
            }}
          >
            Doğrulama Kodu Gönder
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Doğrulama Kodunu Girin"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#28a745",
              color: "#fff",
              border: "none",
            }}
          >
            Kodu Doğrula
          </button>
        </form>
      )}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default Login;