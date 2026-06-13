import { create } from 'zustand';
import type { AuthUser } from '../types/auth.types';

interface AuthState {
  /** The currently authenticated user, or null if logged out */
  user: AuthUser | null;
  /** Whether the auth state has been resolved (initial session check done) */
  isInitialized: boolean;
  /** Convenience getter */
  isAuthenticated: boolean;
  /** True while a login / signup request is in-flight */
  isLoading: boolean;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) =>
    set({ user, isAuthenticated: user !== null }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  setInitialized: (isInitialized) =>
    set({ isInitialized }),

  clearUser: () =>
    set({ user: null, isAuthenticated: false }),
}));
