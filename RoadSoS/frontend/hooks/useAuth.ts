import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import * as authApi from '../services/api/authApi';
import type { AuthResult, LoginCredentials, SignupCredentials } from '../types/auth.types';

/**
 * Convenience hook that pairs the Zustand auth store with
 * the Firebase auth API functions.
 */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, isInitialized, setUser, setLoading, clearUser } =
    useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      setLoading(true);
      const result = await authApi.signIn(credentials);
      if (result.success && result.data) {
        setUser(result.data);
      }
      setLoading(false);
      return result;
    },
    [setUser, setLoading],
  );

  const signup = useCallback(
    async (credentials: SignupCredentials): Promise<AuthResult> => {
      setLoading(true);
      const result = await authApi.signUp(credentials);
      if (result.success && result.data) {
        setUser(result.data);
      }
      setLoading(false);
      return result;
    },
    [setUser, setLoading],
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    await authApi.signOut();
    clearUser();
    setLoading(false);
  }, [clearUser, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    signup,
    logout,
  };
};
