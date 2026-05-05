import { request } from './client';
import { AuthUser } from '../constants/types';

export function login(email: string, password: string) {
  return request<AuthUser>('/api/auth/login', { method: 'POST', body: { email, password } });
}

export function register(name: string, email: string, password: string, keyTagIds: number[]) {
  return request<AuthUser>('/api/auth/register', {
    method: 'POST',
    body: { name, email, password, keyTagIds },
  });
}
