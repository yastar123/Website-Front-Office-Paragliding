import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { storageService } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = storageService.getUser();
    setUser(savedUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would be an API call
    const mockCredentials = {
      'admin@paragliding.com': 'admin123',
      'manager@paragliding.com': 'manager123'
    };

    if (mockCredentials[email as keyof typeof mockCredentials] === password) {
      const user: User = {
        id: '1',
        email,
        name: email === 'admin@paragliding.com' ? 'Admin User' : 'Manager User'
      };
      setUser(user);
      storageService.saveUser(user);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    storageService.saveUser(null);
  };

  return {
    user,
    login,
    logout,
    isLoading
  };
};