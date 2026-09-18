import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('timecheck_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('timecheck_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('timecheck_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[Auth] Session expired or invalid token');
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.success && response.token) {
      localStorage.setItem('timecheck_token', response.token);
      localStorage.setItem('timecheck_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (name, email, password, confirmPassword) => {
    const response = await authService.register({
      name,
      email,
      password,
      confirmPassword,
    });
    if (response.success && response.token) {
      localStorage.setItem('timecheck_token', response.token);
      localStorage.setItem('timecheck_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('timecheck_token');
    localStorage.removeItem('timecheck_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
