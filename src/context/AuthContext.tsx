
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
  membershipLevel?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserResponse {
  id: string;
  email: string;
  role: string;
  name: string; // API returns name but we use full_name in our app
  membershipLevel?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Transform API response to our User type
          setUser({
            id: userData.id,
            email: userData.email,
            role: userData.role,
            full_name: userData.name || 'Unknown User',
            membershipLevel: userData.membershipLevel,
            created_at: userData.created_at,
            updated_at: userData.updated_at
          });
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    
    checkUserSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Call your login API, store token in localStorage
      const mockResponse: UserResponse = {
        id: uuidv4(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : email.includes('moderator') ? 'moderator' : 'user'
      };
      
      localStorage.setItem('access_token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockResponse));
      
      // Transform API response to our User type
      setUser({
        id: mockResponse.id,
        email: mockResponse.email,
        role: mockResponse.role,
        full_name: mockResponse.name || 'Unknown User',
        membershipLevel: mockResponse.membershipLevel,
        created_at: mockResponse.created_at,
        updated_at: mockResponse.updated_at
      });

      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Call your registration API, store token in localStorage
      const mockResponse: UserResponse = {
        id: uuidv4(),
        email,
        name,
        role: 'user'
      };
      
      localStorage.setItem('access_token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockResponse));
      
      // Transform API response to our User type
      setUser({
        id: mockResponse.id,
        email: mockResponse.email,
        role: mockResponse.role,
        full_name: mockResponse.name,
        membershipLevel: mockResponse.membershipLevel,
        created_at: mockResponse.created_at,
        updated_at: mockResponse.updated_at
      });

      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
