export type Role = 'admin' | 'owner' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at?: string;
}

export interface Stall {
  id: number;
  owner_id: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  avg_rating: number;
  review_count: number;
  created_at: string;
}

export interface StallPayload {
  name: string;
  category?: string;
  location?: string;
  description?: string;
}

export interface StallQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}