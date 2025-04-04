
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

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
  login: (email: string, password: string, role?: string) => Promise<User>;
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
  const login = async (email: string, password: string, role: string = 'user'): Promise<User> => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user by email
    const foundUser = sampleUsers.find(
      user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }
    
    // Set the user in state and localStorage
    setUser(foundUser);
    localStorage.setItem('metaditeUser', JSON.stringify(foundUser));
    
    return foundUser;
  };

  // Register function
  const register = async (email: string, password: string, name: string, region: string = 'north_america'): Promise<User> => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    const userExists = sampleUsers.some(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (userExists) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${sampleUsers.length + 1}`,
      email,
      password,
      name,
      role: 'user',
      vip: false,
      membershipLevel: 'standard',
      region
    };
    
    // Add user to sample data (in a real app, this would be a database operation)
    sampleUsers.push(newUser);
    
    return newUser;
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
  const logout = () => {
    // Remove user from state and localStorage
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
