import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar";
import "../Orders.css";

const AddProduct = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    base_price: "",
    stock: "",
    category_id: "",
    image: null,
    options: [],
    ingredients: [],
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [optionInput, setOptionInput] = useState({ name: "", is_default: false, priceModifier: "" });
  const [ingredientInput, setIngredientInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    } else {
      const fetchCategories = async () => {
        try {
          const response = await api.get("/api/categories");
          setCategories(response.data.data || []);
        } catch (err) {
          setError("Kategoriler yüklenirken bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
        }
      };
      fetchCategories();
    }
  }, [admin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOptionInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionAdd = () => {
    if (optionInput.name.trim() && optionInput.priceModifier !== "") {
      const priceModifier = Number(optionInput.priceModifier);
      if (isNaN(priceModifier) || priceModifier < 0) {
        setError("Fiyat değiştirici pozitif bir sayı olmalıdır.");
        return;
      }
      setProductData((prev) => ({
        ...prev,
        options: [...prev.options, { 
          name: optionInput.name.trim(), 
          is_default: optionInput.is_default, 
          priceModifier: priceModifier 
        }],
      }));
      setOptionInput({ name: "", is_default: false, priceModifier: "" });
    }
  };

  const handleOptionRemove = (index) => {
    setProductData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientAdd = () => {
    if (ingredientInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, { name: ingredientInput.trim() }],
      }));
      setIngredientInput("");
    }
  };

  const handleIngredientRemove = (index) => {
    setProductData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const hasDefaultOption = () => {
    return productData.options.some((opt) => opt.is_default);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("base_price", Number(productData.base_price));
      formData.append("stock", Number(productData.stock));
      formData.append("category_id", Number(productData.category_id));
      if (productData.image) {
        formData.append("image", productData.image);
      }
      formData.append("options", JSON.stringify(productData.options));
      formData.append("ingredients", JSON.stringify(productData.ingredients));

      const response = await api.post("/api/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(response.data.message || "Ürün başarıyla eklendi!");
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Ürün eklenirken bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!admin) return null;

  return (
    <div className="admin-coupon">
      <header className="header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isSidebarOpen ? "menu-icon-open" : "menu-icon-closed"}
          >
            <path
              className="line1"
              d="M4 6H20"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="line2"
              d="M4 12H14"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="line3"
              d="M4 18H9"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="header-title">Yeni Ürün Ekle</h1>
      </header>

      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </aside>

      <main
        className={`main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <section className="coupon-form-section">
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form onSubmit={handleSubmit} className="coupon-form modern-form">
            {/* Grup 1: Ürün Adı ve Kategori */}
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="name">Ürün Adı</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ürün adını girin"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category_id">Kategori</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={productData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grup 2: Fiyat, Stok ve Resim Yükleme */}
            <div className="form-group-row form-group-row-triple">
              <div className="form-group">
                <label htmlFor="base_price">Fiyat</label>
                <input
                  type="number"
                  id="base_price"
                  name="base_price"
                  value={productData.base_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="Fiyat (ör. 99.99)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stok Miktarı</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={productData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="Stok (ör. 100)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Ürün Resmi (Opsiyonel)</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Ürün Resmi Önizleme" />
                  </div>
                )}
              </div>
            </div>

            {/* Grup 3: Seçenekler */}
            <div className="form-group-row">
              <div className="form-group form-group-full">
                <label>Seçenekler (Opsiyonel)</label>
                <div className="input-group">
                  <input
                    type="text"
                    name="name"
                    value={optionInput.name}
                    onChange={handleOptionChange}
                    placeholder="Seçenek adı (ör. Büyük Boy)"
                  />
                  <input
                    type="number"
                    name="priceModifier"
                    value={optionInput.priceModifier}
                    onChange={handleOptionChange}
                    placeholder="Fiyat Değiştirici (ör. 5.00)"
                    step="0.01"
                    min="0"
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={optionInput.is_default}
                      onChange={handleOptionChange}
                      disabled={hasDefaultOption() && !optionInput.is_default}
                    />
                    Varsayılan
                  </label>
                  <button type="button" className="add-btn" onClick={handleOptionAdd}>
                    Ekle
                  </button>
                </div>
                {productData.options.length > 0 && (
                  <ul className="item-list">
                    {productData.options.map((option, index) => (
                      <li key={index}>
                        <span>
                          {option.name} (+{option.priceModifier} TL) {option.is_default ? "(Varsayılan)" : ""}
                        </span>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleOptionRemove(index)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Grup 4: Malzemeler */}
            <div className="form-group-row">
              <div className="form-group form-group-full">
                <label>Malzemeler (Opsiyonel)</label>
                <div className="input-group">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    placeholder="Malzeme adı (ör. Peynir)"
                  />
                  <button type="button" className="add-btn" onClick={handleIngredientAdd}>
                    Ekle
                  </button>
                </div>
                {productData.ingredients.length > 0 && (
                  <ul className="item-list">
                    {productData.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        <span>{ingredient.name}</span>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleIngredientRemove(index)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group form-group-full">
                <label htmlFor="description">Açıklama (Opsiyonel)</label>
                <textarea
                  id="description"
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  placeholder="Ürün açıklamasını girin"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn modern-submit-btn" disabled={loading}>
              {loading ? "Ekleniyor..." : "Ürünü Ekle"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddProduct;