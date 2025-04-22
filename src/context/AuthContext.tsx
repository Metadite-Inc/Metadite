import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { authApi } from '../lib/api/auth_api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  membershipLevel?: 'standard' | 'vip' | 'vvip';
  region?: string;
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

// Create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
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
      setUser(userData);
      toast.success('Login successful');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, region?: string): Promise<void> => {
    try {
      await authApi.register({ email, password, name, region });
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
      const updatedUser = { ...user, membershipLevel: level };
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

  // Context value
  const value = {
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

// Hook for components to get the auth object and re-render when it changes
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
