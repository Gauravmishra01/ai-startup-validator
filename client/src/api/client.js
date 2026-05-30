import axios from "axios";

let API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Normalize common malformed values (e.g. ":5000" or "localhost:5000")
if (typeof API_BASE_URL === "string") {
  API_BASE_URL = API_BASE_URL.trim();

  if (API_BASE_URL.startsWith(":")) {
    API_BASE_URL = `http://localhost${API_BASE_URL}`;
  } else if (/^localhost(:|$)/.test(API_BASE_URL)) {
    API_BASE_URL = `http://${API_BASE_URL}`;
  }
}

// Debug: show which base URL the client is using (remove in production)
console.debug("API_BASE_URL:", API_BASE_URL);

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
