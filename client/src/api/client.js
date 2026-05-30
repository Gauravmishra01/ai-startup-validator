import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let csrfToken = null;

export const setCsrfToken = (token) => {
  csrfToken = token;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method) && csrfToken) {
    config.headers = config.headers || {};
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

export const fetchCsrfToken = async () => {
  const { data } = await api.get("/api/auth/csrf");
  setCsrfToken(data.csrfToken);
  return data.csrfToken;
};
