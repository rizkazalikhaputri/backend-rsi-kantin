import axios, { AxiosError } from 'axios';

export const TOKEN_KEY = 'token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Tempel JWT otomatis di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tangani 401 secara global
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const url = error.config?.url ?? '';
    const isLoginRequest = url.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

interface ErrorBody {
  message?: string;
  errors?: { field: string; message: string }[];
}

// Pesan error yang rapi: jaringan vs backend vs validasi
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Tidak dapat terhubung ke server. Pastikan backend berjalan.';
    }
    const data = error.response.data as ErrorBody;
    if (data?.errors?.length) {
      return data.errors.map((e) => `${e.field}: ${e.message}`).join(' | ');
    }
    return data?.message ?? `Terjadi kesalahan (${error.response.status}).`;
  }
  return 'Terjadi kesalahan tidak terduga.';
}

export default api;