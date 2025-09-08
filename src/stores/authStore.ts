import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  LoginCredentials,
  AuthState,
  AuthStorageState,
  RegisterCredentials,
  LoginResponse,
} from "../types/auth";
import { AxiosResponse } from "axios";
import { capacitorStorage } from "../utils/storage";
import { ApiResponse } from "../types";
import { authService } from "../api/authService";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (
        credentials: LoginCredentials
      ): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);
          const responseData = response.data;

          if (responseData.status === "success" && responseData.data) {
            const userData = responseData.data.user;
            if (userData.status === "active") {
              set({
                user: userData,
                token: responseData.data.access_token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            }
          } else {
            throw new Error(responseData.message || "Login failed");
          }

          return response;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Login failed";

          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: (): void => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async (): Promise<void> => {
        const { token } = get();
        if (!token) {
          get().logout();
          return;
        }

        try {
          await authService.verifyToken();
        } catch (error) {
          console.error("Auth verification failed:", error);
          get().logout();
        }
      },

      register: async (registerData: RegisterCredentials): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(registerData);
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Registration failed";
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      requestPasswordReset: async (contactInfo: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          await authService.requestPasswordReset(contactInfo);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Password reset failed",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyResetCode: async (
        code: string,
        contactInfo: string
      ): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          await authService.verifyResetCode(code, contactInfo);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Invalid verification code",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (
        code: string,
        newPassword: string,
        contactInfo: string
      ): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(code, newPassword, contactInfo);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Password reset failed",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      verifyEmail: async (email: string, code: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          await authService.verifyEmail(email, code);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Email verification failed",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      resendVerificationCode: async (email: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          await authService.resendVerificationCode(email);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to resend verification code",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => capacitorStorage),
      partialize: (state): AuthStorageState => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
