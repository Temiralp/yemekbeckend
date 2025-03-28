import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Products.css";

const Products = () => {
  const { user, userType, addToCartForGuest } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("Products bileşeni yüklendi. user:", user, "userType:", userType);

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

  // Sepete ekleme fonksiyonu
  const handleAddToCart = async (productId) => {
    console.log("handleAddToCart çağrıldı. user:", user, "userType:", userType);

    if (!user && userType !== "guest") {
      console.log("Kullanıcı giriş yapmamış ve misafir değil. Yönlendiriliyor...");
      navigate("/auth/login");
      return;
    }

    try {
      if (userType === "guest") {
        console.log("Misafir kullanıcı için sepete ekleme yapılıyor...");
        addToCartForGuest(productId);
        alert("Ürün sepete başarıyla eklendi!");
      } else if (userType === "registered" && user?.id) {
        console.log("Kayıtlı kullanıcı için API isteği gönderiliyor...");
        const cartData = {
          product_id: productId,
          quantity: 1,
        };

        const response = await api.post("/api/products/add-to-cart", cartData);
        console.log("Sepete ekleme yanıtı:", response.data);
        alert(response.data.message || "Ürün sepete başarıyla eklendi!");
      } else {
        throw new Error("Kullanıcı bilgisi eksik veya geçersiz.");
      }
    } catch (err) {
      console.error("Sepete ekleme hatası:", err);
      setError(
        err.response?.data?.error || err.message || "Sepete eklerken bir hata oluştu."
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
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product.id)}
              >
                Sepete Ekle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;