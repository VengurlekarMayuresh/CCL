import axios from "axios";
import { auth, getIdTokenSafe } from "./firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
