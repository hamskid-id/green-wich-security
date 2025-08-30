// src/api/auth.ts
import apiClient from './client';
import { LoginCredentials, LoginResponse, User } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  verifyToken: async (token: string): Promise<{ valid: boolean; user?: User }> => {
    const response = await apiClient.post('/auth/verify', { token });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },
};