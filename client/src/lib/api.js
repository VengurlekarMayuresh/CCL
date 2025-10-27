import axios from "axios";
import { auth, getIdTokenSafe } from "./firebase";

// Base URL resolution:
// - PROD: use VITE_API_URL unless it points to localhost; otherwise use same-origin
// - DEV: use VITE_API_URL or default to http://localhost:5000
const isProd = import.meta.env.PROD;
let resolvedBaseURL = (import.meta.env.VITE_API_URL || "").trim();
if (isProd) {
  if (!resolvedBaseURL || /^https?:\/\/localhost(?::\d+)?/i.test(resolvedBaseURL)) {
    resolvedBaseURL = ""; // same-origin
  }
} else {
  resolvedBaseURL = resolvedBaseURL || "http://localhost:5000";
}

const api = axios.create({
  baseURL: resolvedBaseURL,
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
