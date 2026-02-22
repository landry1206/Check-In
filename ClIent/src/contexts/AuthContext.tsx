import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types';
import { authService } from '@/services/api';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Connexion
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials.email, credentials.password);
      const { access_token, user } = response as AuthResponse;

      // Stocker le token et les données utilisateur
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      setUser(user as User);
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // Inscription
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(credentials);
      const { access_token, user } = response as AuthResponse;

      // Stocker le token et les données utilisateur
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      setUser(user as User);
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur d\'inscription';
      setError(message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // Déconnexion
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  // Effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
