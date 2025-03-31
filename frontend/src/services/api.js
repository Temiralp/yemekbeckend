import axios from "axios";
import { isTokenExpired } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
        return Promise.reject(new Error("Token süresi doldu."));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;