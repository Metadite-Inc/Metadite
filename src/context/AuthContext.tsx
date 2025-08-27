import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api/auth_api';
import { getStoredUserRegion } from '../lib/utils';

interface User {
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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, region?: string) => Promise<{ success: boolean; isTempPassword?: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, region: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateMembership: (membershipLevel: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string, region?: string): Promise<{ success: boolean; isTempPassword?: boolean; message?: string }> => {
    try {
      setLoading(true);
      const loginResponse = await authApi.login({ email, password, region });
      
      // Get user info after successful login
      const userResponse = await authApi.getCurrentUser();
      console.log('Login successful, user data:', userResponse);
      setUser(userResponse);
      
      // Check if this was a temporary password login
      const isTempPassword = loginResponse.is_temp_password || false;
      const message = loginResponse.message || undefined;
      
      return { 
        success: true, 
        isTempPassword,
        message
      };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('Logging out user');
    
    // Store the current user's region before logout for future use
    if (user && user.region) {
      localStorage.setItem('user_region', user.region);
      console.log('Preserved user region on logout:', user.region);
    }
    
    await authApi.logout();
    setUser(null);
  };

  const register = async (email: string, password: string, name: string, region: string) => {
    try {
      await authApi.register({
        email,
        password,
        full_name: name,
        region,
        role: 'user',
        membership_level: 'free'
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const userResponse = await authApi.getCurrentUser();
      console.log('User refreshed:', userResponse);
      setUser(userResponse);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const checkSession = async () => {
    try {
      const sessionResponse = await authApi.checkSession();
      if (sessionResponse.authenticated) {
        // If we have a valid session, get the full user data
        try {
          const userResponse = await authApi.getCurrentUser();
          setUser(userResponse);
        } catch (jwtError) {
          console.warn('JWT token expired, but session is valid. Refreshing token...');
          // The getCurrentUser method will now automatically refresh the token
          // If it still fails, we'll fall back to session data
          try {
            await authApi.refreshToken();
            const userResponse = await authApi.getCurrentUser();
            setUser(userResponse);
          } catch (refreshError) {
            console.error('Token refresh failed, using session data:', refreshError);
            // Fallback to session data
            setUser({
              id: sessionResponse.user_id,
              email: sessionResponse.email,
              role: sessionResponse.role as "admin" | "moderator" | "user",
              // Add other required fields with defaults
              uuid: '',
              full_name: '',
              membership_level: 'free',
              region: 'usa',
              is_active: true,
              video_access_count: 0,
              created_at: new Date().toISOString()
            });
          }
        }
      } else {
        // Check if we have a JWT token in localStorage
        const token = localStorage.getItem('access_token');
        if (token) {
          // Try to use the JWT token to get user data
          try {
            const userResponse = await authApi.getCurrentUser();
            setUser(userResponse);
          } catch (jwtError) {
            console.warn('JWT token is invalid, clearing it');
            setUser(null);
            localStorage.removeItem('access_token');
          }
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
      
      // Don't immediately logout on network errors or temporary failures
      // Only logout if it's a clear authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
        localStorage.removeItem('access_token');
      } else {
        // For other errors (network, server issues), keep the current state
        // and let the user continue with their current session if they have one
        console.warn('Session check failed due to network/server issue, keeping current state');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateMembership = async (membershipLevel: string) => {
    if (user) {
      setUser({ ...user, membership_level: membershipLevel as any });
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Add effect to log user role changes
  useEffect(() => {
    if (user) {
      console.log('User state updated - Role:', user.role, 'Email:', user.email);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, register, updateMembership }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
