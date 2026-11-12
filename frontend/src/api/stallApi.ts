import api from './axiosInstance';
import type { Stall, StallPayload, StallQuery } from '../types';

export const getStalls = (params: StallQuery) =>
  api.get('/stalls', { params }).then((r) => ({
    data: r.data.data as Stall[],
    page: r.data.page as number,
    limit: r.data.limit as number,
  }));

export const getStallById = (id: number | string) =>
  api.get(`/stalls/${id}`).then((r) => r.data.data as Stall);

export const createStall = (payload: StallPayload) =>
  api.post('/stalls', payload).then((r) => r.data.data as Stall);

export const updateStall = (id: number | string, payload: StallPayload) =>
  api.put(`/stalls/${id}`, payload).then((r) => r.data.data as Stall);

export const deleteStall = (id: number | string) =>
  api.delete(`/stalls/${id}`).then((r) => r.data);