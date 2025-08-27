import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set the VITE_API_BASE_URL environment variable.");
}

interface LoginRequest {
  email: string;
  password: string;
  region?: string;
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
  is_temp_password?: boolean;
  message?: string;
}

interface SessionResponse {
  authenticated: boolean;
  user_id?: number;
  email?: string;
  role?: string;
  user_type?: string;
  message?: string;
}

interface SessionResponse {
  authenticated: boolean;
  user_id?: number;
  email?: string;
  role?: string;
  user_type?: string;
  message?: string;
}

// Create axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies
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
    console.log('Attempting login with payload:', data); // Added for debugging
    console.log('API Base URL:', API_BASE_URL); // Debug API URL
    console.log('With credentials:', true); // Debug credentials setting
    
    try {
      const response = await api.post<TokenResponse>('/api/auth/login', data);
      console.log('Login response:', response.data); // Debug response
      localStorage.setItem('access_token', response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Login error details:', error); // Enhanced error logging
      throw error;
    }
  },

  // Register new user
  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/api/auth/register', data);
    return response.data;
  },

  // Get current user info
  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await api.get<UserResponse>('/api/auth/me');
      return response.data;
    } catch (error) {
      // If JWT token is expired, try to refresh it using session
      if (error.response?.status === 401) {
        console.warn('JWT token expired, attempting to refresh...');
        try {
          await this.refreshToken();
          // Retry the request with new token
          const response = await api.get<UserResponse>('/api/auth/me');
          return response.data;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw refreshError;
        }
      }
      throw error;
    }
  },

  // Refresh JWT token using session
  async refreshToken(): Promise<void> {
    const response = await api.post<{access_token: string}>('/api/auth/refresh-token');
    localStorage.setItem('access_token', response.data.access_token);
  },

  // Check session status using cookies
  async checkSession(): Promise<SessionResponse> {
    const response = await api.get<SessionResponse>('/api/auth/session');
    return response.data;
  },

  // Check session status using cookies
  async checkSession(): Promise<SessionResponse> {
    const response = await api.get<SessionResponse>('/api/auth/session');
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
      old_password: currentPassword,
      new_password: newPassword,
    });
  },

  // Request email verification
  async requestEmailVerification(email: string): Promise<void> {
    await api.post('/api/auth/verify-email/request', { email });
  },

  // Logout (clear token and cookies)
  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
    }
  },
};