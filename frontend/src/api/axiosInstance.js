import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor — Attach JWT ─────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // User token
    const token = localStorage.getItem('lida_user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Admin Axios Instance ─────────────────────────────────────────────────────
export const adminAxios = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lida_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Handle 401 ──────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lida_user_token');
      localStorage.removeItem('lida_user');
      // Let component handle redirect
    }
    return Promise.reject(error);
  }
);

adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lida_admin_token');
      localStorage.removeItem('lida_admin');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
