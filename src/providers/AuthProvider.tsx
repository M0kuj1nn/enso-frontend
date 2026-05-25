'use client';

import { FC, ReactNode, useCallback, useState } from 'react';

import { loginRequest, registerRequest } from '@api/auth';
import type { LoginData, RegisterData } from '@api/auth';
import { AuthContext } from '@contexts/AuthContext';
import type { User } from '@shared/types/user';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    //проверка, что мы не на сервере, для него вернуть null.
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await loginRequest(data);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Произошла ошибка');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await registerRequest(data);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Произошла ошибка');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
  };

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        clearError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
