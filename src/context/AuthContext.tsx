import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient'

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  membershipLevel?: 'standard' | 'vip' | 'vvip';
  region?: string;
  vip?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, region?: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  updateMembership: (level: 'standard' | 'vip' | 'vvip') => void;
}

// Create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data for demo purposes
const sampleUsers: User[] = [
  { id: 'admin-1', email: 'admin@metadite.com', password: 'admin123', name: 'Admin User', role: 'admin', membershipLevel: 'vvip', region: 'usa' },
  { id: 'mod-1', email: 'anita.moderator@metadite.com', password: 'anita123', name: 'Anita Jones', role: 'moderator', membershipLevel: 'vip', region: 'uk' },
  { id: 'user-1', email: 'john@example.com', password: 'user123', name: 'John Doe', role: 'user', vip: true, membershipLevel: 'vip', region: 'asia' }
];

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem('metaditeUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('User not found');
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      password: 'placeholder_password', // Placeholder value for password
      name: data.user.user_metadata?.name || 'User',
      role: data.user.user_metadata?.role || 'user',
      membershipLevel: data.user.user_metadata?.membershipLevel || 'standard',
      region: data.user.user_metadata?.region,
      vip: data.user.user_metadata?.vip || false,
    };

    setUser(user);
    localStorage.setItem('metaditeUser', JSON.stringify(user));

    return user;
  };

  // Register function
  const register = async (email: string, password: string, name: string, region: string = 'north_america'): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'user',
          membershipLevel: 'standard',
          region,
          vip: false,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Registration failed');
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      password: 'placeholder_password', // Placeholder value for password
      name,
      role: 'user',
      membershipLevel: 'standard',
      region,
      vip: false,
    };

    setUser(user);
    localStorage.setItem('metaditeUser', JSON.stringify(user));

    return user;
  };

  // Update membership level
  const updateMembership = (level: 'standard' | 'vip' | 'vvip') => {
    if (!user) return;
    
    const updatedUser = { ...user, membershipLevel: level };
    
    // Update user in state and localStorage
    setUser(updatedUser);
    localStorage.setItem('metaditeUser', JSON.stringify(updatedUser));
    
    // Update in sample data (in a real app, this would be a database operation)
    const userIndex = sampleUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      sampleUsers[userIndex] = updatedUser;
    }
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed");
      return;
    }

    setUser(null);
    localStorage.removeItem('metaditeUser');
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
