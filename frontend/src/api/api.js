// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-fullstack-production-6b4f.up.railway.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
