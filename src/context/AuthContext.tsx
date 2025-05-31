
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api/auth_api';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'moderator' | 'user';
  membership_level: 'standard' | 'vip' | 'vvip';
  region?: string;
  is_active: boolean;
  video_access_count: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, region?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateMembership: (level: 'standard' | 'vip' | 'vvip') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await authApi.getCurrentUser();
          setUser({
            ...userData,
            role: userData.role as 'admin' | 'moderator' | 'user',
            membership_level: userData.membership_level as 'standard' | 'vip' | 'vvip',
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
      await authApi.login({ email, password });
      const userData = await authApi.getCurrentUser();
      setUser({
        ...userData,
        role: userData.role as 'admin' | 'moderator' | 'user',
        membership_level: userData.membership_level as 'standard' | 'vip' | 'vvip',
      });
      toast.success('Login successful');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one digit";
    }
    return "";
  };

  const register = async (email: string, password: string, name: string, region?: string): Promise<void> => {
    try {
      // Validate password complexity
      const validationError = validatePassword(password);
      if (validationError) {
        toast.error(validationError);
        throw new Error(validationError);
      }
      await authApi.register({
        email,
        password,
        full_name: name,
        role: 'user',
        membership_level: 'standard',
        is_active: true,
        assigned_dolls: [],
        video_access_count: 0,
        region
      });
      toast.success('Registration successful. Please login.');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  };

  const updateMembership = async (level: 'standard' | 'vip' | 'vvip') => {
    if (!user) return;
    try {
      // TODO: Implement membership update API call
      const updatedUser = { ...user, membership_level: level };
      setUser(updatedUser);
      toast.success('Membership updated successfully');
    } catch (error) {
      toast.error('Failed to update membership');
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    toast.success("You've been logged out");
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateMembership
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};