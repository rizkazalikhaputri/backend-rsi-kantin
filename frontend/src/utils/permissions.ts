import type { Stall, User } from '../types';

export const canCreate = (u: User | null) =>
  !!u && (u.role === 'admin' || u.role === 'owner');

export const canEdit = (u: User | null, s: Stall) =>
  !!u && (u.role === 'admin' || (u.role === 'owner' && s.owner_id === u.id));

// Sesuai backend: DELETE hanya admin
export const canDelete = (u: User | null) => !!u && u.role === 'admin';