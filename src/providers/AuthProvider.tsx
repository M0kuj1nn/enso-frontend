'use client';

import { FC, ReactNode, useCallback, useState } from 'react';

import { loginRequest, registerRequest } from '@api/auth';
import type { LoginData, RegisterData } from '@api/auth';
import { AuthContext } from '@contexts/AuthContext';
import { useIsomorphicLayoutEffect } from '@shared/hooks/useIsomorphicLayoutEffect';
import type { User } from '@shared/types/user';
//remove when real API is ready
import Cookies from 'js-cookie';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const saved = Cookies.get('user');
    if (saved) setUser(JSON.parse(saved));
    setIsInitialized(true);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await loginRequest(data);
      setUser(userData);
      //remove when real API is ready
      Cookies.set('user', JSON.stringify(userData));
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
      //remove when real API is ready
      Cookies.set('user', JSON.stringify(userData));
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
    //remove when real API is ready
    Cookies.remove('user');
  };

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitialized,
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
