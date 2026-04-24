import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost',
  baseURL: '/aether',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

api.defaults.xsrfCookieName = 'XSRF-TOKEN';
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

/**
 * INTERCEPTOR:
 * Antes de cada requisição sair, verificamos se existe um token no LocalStorage.
 * Se existir, injetamos no Header Authorization para que o Laravel Sanctum nos reconheça.
 */
api.interceptors.request.use(async (config) => {
  // 1. Bearer Token
  const token = localStorage.getItem('@App:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. FORÇAR X-XSRF-TOKEN (O golpe de misericórdia no 419)
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const xsrfToken = getCookie('XSRF-TOKEN');
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }

  return config;
}, (error) => Promise.reject(error));

export default api;