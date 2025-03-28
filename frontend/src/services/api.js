import axios from "axios";
import { isTokenExpired } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// api.js
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("token"); // Normal kullanıcı için token
    const guestUserId = localStorage.getItem("guest_user_id"); // Misafir kullanıcı için id
    const userType = localStorage.getItem("user_type"); // Kullanıcı tipi (misafir ya da normal)

    let token = null;

    // Eğer misafir kullanıcıysa, guest_user_id'yi token gibi kullanıyoruz
    if (userType === "guest" && guestUserId) {
      token = guestUserId;
    } else if (userToken) {
      token = userToken;
    }

    // Eğer token mevcutsa, başlığa ekliyoruz
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// API yanıtları sırasında 401 hatası alırsak, logout işlemi yapılır
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Kullanıcı token'ı geçersizse logout işlemi yapılır
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("guest_user_id");
      localStorage.removeItem("user_type");
      window.location.href = "/login"; // Kullanıcıyı login sayfasına yönlendirir
    }
    return Promise.reject(error);
  }
);

export default api;
