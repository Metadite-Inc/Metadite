
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api/auth_api';
import { toast } from 'sonner';

interface User {
  id: number;
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  membership_level: 'free' | 'standard' | 'vip' | 'vvip';
  region?: string;
  is_active: boolean;
  video_access_count: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<boolean> => {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await authApi.getCurrentUser();
          setUser({
            ...userData,
            role: userData.role as 'admin' | 'moderator' | 'user',
            membershipLevel: userData.membershipLevel as 'standard' | 'vip' | 'vvip' | undefined,
          });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        authApi.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await authApi.login({ email, password });
      
      // Get user info after successful login
      const userResponse = await authApi.getCurrentUser();
      // console.log('Login successful, user data:', userResponse);
      setUser(userResponse);
      
      return true;
      const userData = await authApi.getCurrentUser();
      setUser({
        ...userData,
        role: userData.role as 'admin' | 'moderator' | 'user',
        membershipLevel: userData.membershipLevel as 'standard' | 'vip' | 'vvip' | undefined,
      });
      toast.success('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    authApi.logout();
    setUser(null);
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

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        console.log('Found existing token, refreshing user...');
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
        }
      } else {
        console.log('No token found');
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Add effect to log user role changes
  useEffect(() => {
    if (user) {
      console.log('User state updated - Role:', user.role, 'Email:', user.email);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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