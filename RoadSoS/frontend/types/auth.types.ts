/** Lightweight user object extracted from Firebase User */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/** Payload for the login form */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Payload for the signup form */
export interface SignupCredentials {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

/** Generic result wrapper returned by auth functions */
export interface AuthResult<T = AuthUser> {
  success: boolean;
  data?: T;
  error?: string;
}
