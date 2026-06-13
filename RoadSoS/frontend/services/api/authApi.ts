import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import type { AuthUser, AuthResult, LoginCredentials, SignupCredentials } from '../../types/auth.types';

// ─── Helpers ────────────────────────────────────────────────────────

/** Map a Firebase User to our lightweight AuthUser shape */
const toAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  phoneNumber: user.phoneNumber,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

/** Extract a human-readable message from Firebase error codes */
const friendlyError = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

// ─── Auth API ───────────────────────────────────────────────────────

/**
 * Create a new account with email & password.
 * Also sets the user's displayName from `fullName`.
 */
export const signUp = async (
  credentials: SignupCredentials,
): Promise<AuthResult> => {
  try {
    const { email, password, fullName } = credentials;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Attach display name (and phone as part of the profile isn't natively
    // supported, but displayName is).
    await updateProfile(userCredential.user, { displayName: fullName });

    return { success: true, data: toAuthUser(userCredential.user) };
  } catch (err: any) {
    return { success: false, error: friendlyError(err?.code) };
  }
};

/**
 * Sign in with email & password.
 */
export const signIn = async (
  credentials: LoginCredentials,
): Promise<AuthResult> => {
  try {
    const { email, password } = credentials;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, data: toAuthUser(userCredential.user) };
  } catch (err: any) {
    return { success: false, error: friendlyError(err?.code) };
  }
};

/**
 * Sign the current user out.
 */
export const signOut = async (): Promise<AuthResult<null>> => {
  try {
    await firebaseSignOut(auth);
    return { success: true, data: null };
  } catch (err: any) {
    return { success: false, error: friendlyError(err?.code) };
  }
};

/**
 * Return the currently authenticated user (or null).
 */
export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser;
  return user ? toAuthUser(user) : null;
};

/**
 * Subscribe to authentication state changes.
 * Returns an unsubscribe function.
 */
export const onAuthChanged = (
  callback: (user: AuthUser | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? toAuthUser(firebaseUser) : null);
  });
};
