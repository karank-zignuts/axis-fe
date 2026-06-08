'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearStoredToken,
  getMe,
  getStoredToken,
  login as loginRequest,
  setStoredToken,
  signup as signupRequest,
} from '@/lib/api';
import type { User } from '@/types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (payload: { email: string; password: string }) => Promise<User>;
  signup: (payload: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const nextUser = await getMe();
      setUser(nextUser);
      setError(null);
      return nextUser;
    } catch (err) {
      clearStoredToken();
      setUser(null);
      setError(err instanceof Error ? err.message : 'Session expired.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const response = await loginRequest(payload);
    setStoredToken(response.accessToken);
    setUser(response.user);
    setError(null);
    return response.user;
  }, []);

  const signup = useCallback(async (payload: { name: string; email: string; password: string }) => {
    const response = await signupRequest(payload);
    setStoredToken(response.accessToken);
    setUser(response.user);
    setError(null);
    return response.user;
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, login, signup, logout, refreshUser }),
    [error, loading, login, logout, refreshUser, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
