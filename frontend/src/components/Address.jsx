import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Address() {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    title: "Ev",
    city: "",
    district: "",
    neighborhood: "",
    street: "",
    address_detail: "",
    is_default: false,
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id");
  const user_type = localStorage.getItem("user_type");
  const guest_id = localStorage.getItem("guest_user_id");
  const token = localStorage.getItem("token");

  const addressTitleOptions = ["Ev", "İş", "Diğer"];

  useEffect(() => {
    if (!token || !user_type || (user_type === "registered" && !user_id) || (user_type === "guest" && !guest_id)) {
      setError("Lütfen önce giriş yapın.");
      navigate("/login");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/addresses", {
          params: { user_id, user_type, guest_id },
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data.addresses);
      } catch (err) {
        setError("Adresler yüklenemedi: " + (err.response?.data?.error || err.message));
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    fetchAddresses();
  }, [user_id, user_type, guest_id, token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = {
      ...formData,
      user_id: user_type === "registered" ? user_id : null,
      user_type,
      guest_id: user_type === "guest" ? guest_id : null,
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:3000/addresses/${editId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Adres güncellendi!");
      } else {
        await axios.post("http://localhost:3000/addresses", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Adres eklendi!");
      }

      const response = await axios.get("http://localhost:3000/addresses", {
        params: { user_id, user_type, guest_id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data.addresses);

      // Formu sıfırla
      setFormData({
        title: "Ev",
        city: "",
        district: "",
        neighborhood: "",
        street: "",
        address_detail: "",
        is_default: false,
      });
      setEditId(null);
    } catch (err) {
      setError("İşlem başarısız: " + (err.response?.data?.error || err.message));
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  const handleEdit = (address) => {
    setFormData({
      title: address.title,
      city: address.city,
      district: address.district,
      neighborhood: address.neighborhood,
      street: address.street,
      address_detail: address.address_detail || "",
      is_default: address.is_default,
    });
    setEditId(address.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;

    try {
      await axios.delete(`http://localhost:3000/addresses/${id}`, {
        params: { user_id, user_type, guest_id },
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Adres silindi!");
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (err) {
      setError("Adres silinemedi: " + (err.response?.data?.error || err.message));
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Adres Yönetimi</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Adres Başlığı:</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            {addressTitleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="city"
            placeholder="Şehir (ör. İstanbul)"
            value={formData.city}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="district"
            placeholder="İlçe (ör. Kadıköy)"
            value={formData.district}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="neighborhood"
            placeholder="Mahalle (ör. Fenerbahçe)"
            value={formData.neighborhood}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="street"
            placeholder="Sokak (ör. Bağdat Caddesi, No: 123, Daire: 5)"
            value={formData.street}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="address_detail"
            placeholder="Adres Detayı (isteğe bağlı)"
            value={formData.address_detail}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", minHeight: "60px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
            />
            Varsayılan Adres Yap
          </label>
        </div>
        <button
          type="submit"
          style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none" }}
        >
          {editId ? "Adresi Güncelle" : "Adres Ekle"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>}

      <h2>Kayıtlı Adresler</h2>
      {addresses.length === 0 ? (
        <p>Henüz kayıtlı adresiniz yok.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {addresses.map((address) => (
            <li
              key={address.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                backgroundColor: address.is_default ? "#e0f7fa" : "#fff",
              }}
            >
              <h3>{address.title} {address.is_default && "(Varsayılan)"}</h3>
              <p><strong>Şehir:</strong> {address.city}</p>
              <p><strong>İlçe:</strong> {address.district}</p>
              <p><strong>Mahalle:</strong> {address.neighborhood}</p>
              <p><strong>Sokak:</strong> {address.street}</p>
              <p><strong>Detay:</strong> {address.address_detail || "Belirtilmemiş"}</p>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleEdit(address)}
                  style={{
                    padding: "5px 10px",
                    background: "#ffc107",
                    color: "#fff",
                    border: "none",
                    marginRight: "10px",
                  }}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  style={{ padding: "5px 10px", background: "#dc3545", color: "#fff", border: "none" }}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Address;