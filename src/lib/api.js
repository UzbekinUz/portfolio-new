import axios from 'axios';

// Auth httpOnly cookie orqali (same-origin / vite proxy) — token JS'ga ko'rinmaydi
export const api = axios.create({ baseURL: '/api', withCredentials: true });

api.interceptors.response.use(
  (r) => r,
  (e) => {
    const url = e.config?.url || '';
    if (e.response?.status === 401 && url.startsWith('/admin') && !url.endsWith('/login') && !url.endsWith('/me')) {
      if (!location.pathname.startsWith('/admin/login')) location.href = '/admin/login';
    }
    return Promise.reject(e);
  }
);

export const errMsg = (e) => e?.response?.data?.error || e?.message || 'Error';
