// src/hooks/useAuth.ts
import { useAuthStore } from "../stores/authStore";
import { AuthState } from "../types/auth";

export const useAuth = (): AuthState => {
  const {
    user,
    token,
    isAuthenticated,
    register,
    isLoading,
    error,
    login,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    logout,
    verifyEmail,
    resendVerificationCode,
    checkAuth,
    clearError,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    register,
    verifyEmail,
    resendVerificationCode,
    isLoading,
    error,
    login,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    logout,
    checkAuth,
    clearError,
  };
};
