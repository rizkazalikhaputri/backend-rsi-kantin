import api from './axiosInstance';
import type { User } from '../types';

export const register = (body: { name: string; email: string; password: string }) =>
  api.post('/auth/register', body).then((r) => r.data.data as User);

export const login = (body: { email: string; password: string }) =>
  api
    .post('/auth/login', body)
    .then((r) => r.data.data as { token: string; user: User });

export const getMe = () => api.get('/auth/me').then((r) => r.data.data as User);