import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // AuthContext'inizin yolunu kontrol edin
import api from "../services/api"; // API servis dosyanızın yolunu kontrol edin
import "./Products.css"; // Stil dosyası (isteğe bağlı, aşağıda açıklayacağım)

const Products = () => {
  const { admin, user, logout } = useContext(AuthContext); // Kullanıcı ve admin bilgisi
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/products/");
        const productsData = response.data.data || [];
        if (!Array.isArray(productsData)) {
          throw new Error("API'den dönen veri bir dizi değil.");
        }
        setProducts(productsData);
      } catch (err) {
        setError(err.response?.data?.error || "Ürünler getirilemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sipariş oluşturma fonksiyonu
  const handleCreateOrder = async (productId) => {
    if (!user) {
      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      navigate("/auth/login");
      return;
    }

    try {
      const orderData = {
        product_id: productId,
        quantity: 1, // Varsayılan olarak 1 adet sipariş
        // Adres gibi ek bilgiler gerekiyorsa buraya eklenebilir
      };
      const response = await api.post("/api/orders/", orderData);
      alert(response.data.message || "Sipariş başarıyla oluşturuldu!");
      // İsteğe bağlı: Sipariş sonrası başka bir sayfaya yönlendirme
      // navigate("/orders"); 
    } catch (err) {
      setError(
        err.response?.data?.error || "Sipariş oluşturulurken bir hata oluştu."
      );
    }
  };

  // Hata mesajını 5 saniye sonra temizle
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="products-container">
      <h1 className="products-title">Ürünler</h1>

      {loading && <p className="loading">Yükleniyor...</p>}
      {error && <p className="error">{error}</p>}
      {products.length === 0 && !loading && !error && (
        <p className="no-data">Ürün bulunamadı.</p>
      )}

      {products.length > 0 && (
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h2>{product.name}</h2>
              <p>{product.description || "Açıklama yok"}</p>
              <p>Fiyat: {product.base_price} TL</p>
              <p>Stok: {product.stock}</p>
              <button
                className="order-btn"
                onClick={() => handleCreateOrder(product.id)}
              >
                Sipariş Oluştur
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;