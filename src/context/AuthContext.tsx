
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api/auth_api';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin' | 'moderator' | 'regular';
  membershipLevel?: 'free' | 'basic' | 'premium' | 'vip' | 'vvip';
  createdAt?: string;
  lastLogin?: string;
  region?: string;
  vip?: boolean;
  uuid?: string;
}

export interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateMembership: (level: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          const userData = await authApi.getCurrentUser();
          // Convert API response to our User type
          setUser({
            id: userData.id,
            email: userData.email,
            full_name: userData.name,
            role: userData.role as 'user' | 'admin' | 'moderator' | 'regular',
            membershipLevel: userData.membershipLevel as 'free' | 'basic' | 'premium' | 'vip' | 'vvip',
            region: userData.region
          });
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Optionally clear the token if it's invalid
        localStorage.removeItem('access_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('access_token', response.access_token);
      const profile = await authApi.getCurrentUser();
      // Convert API response to our User type
      setUser({
        id: profile.id,
        email: profile.email,
        full_name: profile.name,
        role: profile.role as 'user' | 'admin' | 'moderator' | 'regular',
        membershipLevel: profile.membershipLevel as 'free' | 'basic' | 'premium' | 'vip' | 'vvip',
        region: profile.region
      });
      toast.success(`Welcome, ${profile.name || profile.email}!`);
      
      // Redirect based on role
      if (profile.role === 'admin') {
        navigate('/admin');
      } else if (profile.role === 'moderator') {
        navigate('/moderator');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      await authApi.register({ 
        email, 
        password, 
        full_name: fullName 
      });
      await login(email, password); // Automatically log in after successful registration
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    authApi.logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API when available
      // const updatedUser = await apiService.updateProfile(data);
      // For now just update the local state
      setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const updateMembership = async (level: string) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API when available
      // const updatedUser = await apiService.updateMembership(level);
      // For now just update the local state
      setUser(prevUser => prevUser ? { ...prevUser, membershipLevel: level as any } : null);
      toast.success(`Membership upgraded to ${level}!`);
    } catch (error) {
      console.error('Membership update failed:', error);
      toast.error('Failed to update membership');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextProps = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    updateMembership,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
