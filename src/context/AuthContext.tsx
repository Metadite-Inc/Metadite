
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api/auth_api';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'moderator' | 'user';
  membershipLevel?: string;
  region?: string;
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
    try {
      setLoading(true);
      await authApi.login({ email, password });
      
      // Get user info after successful login
      const userResponse = await authApi.getCurrentUser();
      const userData: User = {
        ...userResponse,
        role: userResponse.role as 'admin' | 'moderator' | 'user'
      };
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userResponse = await authApi.getCurrentUser();
      const userData: User = {
        ...userResponse,
        role: userResponse.role as 'admin' | 'moderator' | 'user'
      };
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

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
