import axios from "axios";
import { auth, getIdTokenSafe } from "./firebase";

// Sensible defaults: use local API in dev, same-origin in prod if VITE_API_URL not set
const fallbackBaseURL = import.meta.env.DEV ? "http://localhost:5000" : "";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || fallbackBaseURL,
  withCredentials: true,
});

// Attach Firebase ID token if signed in
api.interceptors.request.use(async (config) => {
  try {
    const token = await getIdTokenSafe();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

export default api;
