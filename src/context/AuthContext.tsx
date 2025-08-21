import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api/auth_api';

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
  login: (email: string, password: string, region?: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  register: (email: string, password: string, name: string, region: string) => Promise<void>;
  updateMembership: (membershipLevel: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string, region?: string): Promise<boolean> => {
    try {
      setLoading(true);
      await authApi.login({ email, password, region });
      
      // Get user info after successful login
      const userResponse = await authApi.getCurrentUser();
      console.log('Login successful, user data:', userResponse);
      setUser(userResponse);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      // Remove the toast from here - let the component handle notifications
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('Logging out user');
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
        const userResponse = await authApi.getCurrentUser();
        setUser(userResponse);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setUser(null);
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
