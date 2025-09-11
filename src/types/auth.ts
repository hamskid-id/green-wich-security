import { AxiosResponse } from "axios";
import { ApiResponse } from ".";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  unit_id: string;
  password: string;
  password_confirmation: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  expiresIn: number;
}

// Password reset request interfaces
export interface PasswordResetRequest {
  email?: string;
  phoneNumber?: string;
}

export interface VerifyResetCodeRequest {
  email?: string;
  phoneNumber?: string;
  code: string;
}

export interface ResetPasswordRequest {
  email?: string;
  phoneNumber?: string;
  code: string;
  newPassword: string;
}

export interface PasswordResetResponse {
  message: string;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Authentication methods
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  register: (registerData: RegisterCredentials) => Promise<void>;
  login: (
    credentials: LoginCredentials
  ) => Promise<AxiosResponse<ApiResponse<LoginResponse>>>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;

  // Password reset methods
  requestPasswordReset: (contactInfo: string) => Promise<void>;
  verifyResetCode: (code: string, contactInfo: string) => Promise<void>;
  resetPassword: (
    code: string,
    newPassword: string,
    confirmPassword: string,
    contactInfo: string
  ) => Promise<void>;
}

export interface AuthStorageState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Stat {
  monthly_visitors: number;
  active_codes: number;
  activities: {
    message: string;
    time: Date;
  }[];
}
