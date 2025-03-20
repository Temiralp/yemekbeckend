
// src/components/Address.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function Address() {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    district: "",
    neighborhood: "",
    street: "",
    address_detail: "",
    is_default: false,
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user_id || !token) {
      setError("Lütfen önce giriş yapın.");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/addresses?user_id=${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data.addresses);
      } catch (err) {
        setError("Adresler yüklenemedi: " + (err.response?.data?.error || err.message));
      }
    };

    fetchAddresses();
  }, [user_id, token]);

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

    const data = { ...formData, user_id };

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

      const response = await axios.get(`http://localhost:3000/addresses?user_id=${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data.addresses);

      setFormData({
        title: "",
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
    }
  };

  const handleEdit = (address) => {
    setFormData({
      title: address.title,
      city: address.city,
      district: address.district,
      neighborhood: address.neighborhood,
      street: address.street,
      address_detail: address.address_detail,
      is_default: address.is_default,
    });
    setEditId(address.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;

    try {
      await axios.delete(`http://localhost:3000/addresses/${id}?user_id=${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Adres silindi!");
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (err) {
      setError("Adres silinemedi: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Adres Yönetimi</h1>

      {/* Adres Ekleme/Güncelleme Formu */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="title"
            placeholder="Adres Başlığı (ör. Ev Adresi)"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
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
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none" }}>
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
            <li key={address.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
              <h3>{address.title}</h3>
              <p><strong>Şehir:</strong> {address.city}</p>
              <p><strong>İlçe:</strong> {address.district}</p>
              <p><strong>Mahalle:</strong> {address.neighborhood}</p>
              <p><strong>Sokak:</strong> {address.street}</p>
              <p><strong>Detay:</strong> {address.address_detail || "Belirtilmemiş"}</p>
              <p><strong>Varsayılan:</strong> {address.is_default ? "Evet" : "Hayır"}</p>
              <button
                onClick={() => handleEdit(address)}
                style={{ padding: "5px 10px", background: "#ffc107", color: "#fff", border: "none", marginRight: "10px" }}
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                style={{ padding: "5px 10px", background: "#dc3545", color: "#fff", border: "none" }}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Address;