export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const doPasswordsMatch = (a: string, b: string): boolean => {
  return a === b;
};

export const isValidOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export interface SignupErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateSignupForm = (data: {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}): SignupErrors => {
  const errors: SignupErrors = {};

  if (!isValidName(data.fullName)) {
    errors.fullName = 'Please enter your full name';
  }
  if (!isValidPhone(data.phone)) {
    errors.phone = 'Enter a valid phone number';
  }
  if (!isValidEmail(data.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!isValidPassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (!doPasswordsMatch(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export interface LoginErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (data: {
  email: string;
  password: string;
}): LoginErrors => {
  const errors: LoginErrors = {};

  if (!isValidEmail(data.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!isValidPassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};
