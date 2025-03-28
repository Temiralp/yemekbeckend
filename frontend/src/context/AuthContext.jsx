import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { isTokenExpired } from "../utils/auth";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Normal Kullanıcı State
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    console.log("localStorage'dan user yükleniyor:", storedUser);
    let parsedUser = null;
    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("User JSON parse hatası:", error);
    }
    return parsedUser;
  });

  // Misafir Kullanıcı State
  const [guestUserId, setGuestUserId] = useState(() => {
    const storedGuestId = localStorage.getItem("guest_user_id");
    console.log("localStorage'dan guest_user_id yükleniyor:", storedGuestId);
    return storedGuestId || null;
  });

  // Admin State
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");
    console.log("localStorage'dan admin yükleniyor:", storedAdmin);
    let parsedAdmin = null;
    try {
      parsedAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch (error) {
      console.error("Admin JSON parse hatası:", error);
    }
    return parsedAdmin;
  });

  // Token State (Hem admin hem kullanıcı için ortak token)
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    console.log("localStorage'dan token yükleniyor:", storedToken);
    return storedToken || null;
  });

  // User Type State (guest, registered, admin)
  const [userType, setUserType] = useState(() => {
    const storedUserType = localStorage.getItem("user_type");
    console.log("localStorage'dan user_type yükleniyor:", storedUserType);
    return storedUserType || "guest";
  });

  // Token kontrolü ve veri yükleme
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("useEffect çalıştı. token:", storedToken, "userType:", userType);

    if (storedToken) {
      const isExpired = isTokenExpired(storedToken);
      if (isExpired) {
        console.log("Token süresi dolmuş. Çıkış yapılıyor...");
        logout();
      } else {
        if (userType === "registered" && !user) {
          console.log("Kayıtlı kullanıcı için veri getiriliyor...");
          fetchUserData(storedToken);
        } else if (userType === "admin" && !admin) {
          console.log("Admin için veri getiriliyor...");
          fetchAdminData(storedToken);
        }
      }
    }
  }, [userType, user, admin]);

  // Normal kullanıcı verisini API'den almak
  const fetchUserData = async (token) => {
    try {
      const response = await api.get("/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("fetchUserData yanıtı:", response.data);
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        console.error("Kullanıcı verisi hatalı veya eksik:", response.data);
      }
    } catch (err) {
      console.error("Kullanıcı verisi alınamadı:", err);
      logout();
    }
  };

  // Admin verisini API'den almak
  const fetchAdminData = async (token) => {
    try {
      const response = await api.get("/api/staff/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("fetchAdminData yanıtı:", response.data);
      if (response.data) {
        setAdmin(response.data);
        localStorage.setItem("admin", JSON.stringify(response.data));
      } else {
        console.error("Admin verisi hatalı veya eksik:", response.data);
      }
    } catch (err) {
      console.error("Admin verisi alınamadı:", err);
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  // Giriş fonksiyonu (hem kullanıcı hem admin için)
  const login = (token, data, type = "registered") => {
    console.log("login çağrıldı. token:", token, "data:", data, "type:", type);
    
    if (!data?.id && !data?.user_id) {
      console.error("data.id veya data.user_id eksik:", data);
      return;
    }

    setToken(token);
    localStorage.setItem("token", token);

    if (type === "guest") {
      setGuestUserId(data.user_id);
      setUserType("guest");
      localStorage.setItem("guest_user_id", data.user_id);
      localStorage.setItem("user_type", "guest");
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      setUser(null);
      setAdmin(null);
      navigate("/");
    } else if (type === "admin") {
      setAdmin(data);
      setUserType("admin");
      localStorage.setItem("admin", JSON.stringify(data));
      localStorage.setItem("user_type", "admin");
      localStorage.removeItem("user");
      localStorage.removeItem("guest_user_id");
      setUser(null);
      setGuestUserId(null);
      navigate("/admin/dashboard");
    } else {
      setUser(data);
      setUserType("registered");
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("user_type", "registered");
      localStorage.removeItem("admin");
      localStorage.removeItem("guest_user_id");
      setAdmin(null);
      setGuestUserId(null);
      navigate("/dashboard");
    }
    console.log("login tamamlandı. userType:", type);
  };

  // Çıkış fonksiyonu (her tür için ortak)
  const logout = () => {
    console.log("logout çağrıldı.");
    setUser(null);
    setGuestUserId(null);
    setAdmin(null);
    setToken(null);
    setUserType("guest");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("guest_user_id");
    localStorage.removeItem("user_type");
    navigate("/auth/login");
  };

  // Misafir kullanıcı için sepete ürün ekleme
  const addToCartForGuest = (productId) => {
    if (userType === "guest") {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existingProductIndex = guestCart.findIndex(
        (item) => item.product_id === productId
      );
      if (existingProductIndex !== -1) {
        guestCart[existingProductIndex].quantity += 1;
      } else {
        guestCart.push({ product_id: productId, quantity: 1 });
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        guestUserId,
        admin,
        token,
        userType,
        login,
        logout,
        addToCartForGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;