import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session on application mount
  const checkSession = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data?.authenticated && res.data.user) {
        setUser(res.data.user);
        setSessionId(res.data.sessionId || null);
      } else {
        setUser(null);
        setSessionId(null);
      }
    } catch {
      setUser(null);
      setSessionId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    if (res.data?.success && res.data.user) {
      setUser(res.data.user);
      setSessionId(res.data.sessionId || null);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
      setSessionId(null);
    }
  };

  const updateUserBalance = (newBalance) => {
    if (user) {
      setUser((prev) => ({ ...prev, balance: newBalance }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkSession,
        updateUserBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
