import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set the VITE_API_BASE_URL environment variable.");
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: 'admin' | 'moderator' | 'user';
  membership_level?: 'free' | 'standard' | 'vip' | 'vvip';
  region?: string;
  is_active?: boolean;
  assigned_dolls?: string[];
  video_access_count?: number;
}

interface UserResponse {
  id: number;
  uuid: string;
  email: string;
  full_name: string;
  role: 'admin' | 'moderator' | 'user';
  membership_level: 'free' | 'standard' | 'vip' | 'vvip';
  region?: string;
  is_active: boolean;
  video_access_count: number;
  created_at: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Create axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  // Login user
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/api/auth/login', data);
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  // Register new user
  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/api/auth/register', data);
    return response.data;
  },

  // Get current user info
  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/api/auth/me');
    return response.data;
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/api/auth/password-reset/request', { email });
  },

  // Confirm password reset
  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/password-reset/confirm', {
      oob_code: token,
      new_password: newPassword,
    });
  },

  // Update password
  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/password-update', {
      password: currentPassword,
      new_password: newPassword,
    });
  },

  // Request email verification
  async requestEmailVerification(email: string): Promise<void> {
    await api.post('/api/auth/verify-email/request', { email });
  },

  // Logout (clear token)
  logout(): void {
    localStorage.removeItem('access_token');
  },
};