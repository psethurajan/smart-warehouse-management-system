import axios from "axios";

// Central axios instance so we don't repeat the base URL everywhere
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach the JWT token (if present) to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
