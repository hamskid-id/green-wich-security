// src/stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Preferences } from "@capacitor/preferences";
import {
  LoginCredentials,
  AuthState,
  AuthStorageState,
  RegisterCredentials,
} from "../types/auth";
import apiClient from "../api/client";
import { capacitorStorage } from "../utils/storage";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post("/auth/login", credentials);
          const responseData = response.data;

          // Check if the response has the expected structure
          if (responseData.status === "success" && responseData.data) {
            const userData = responseData.data.user;

            set({
              user: {
                id: userData.id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role,
                status: userData.status,
              },
              token: responseData.data.access_token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(responseData.message || "Login failed");
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Login failed";

          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
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
          // Verify token validity with backend
          await apiClient.get("/auth/verify");
        } catch (error) {
          console.error("Auth verification failed:", error);
          get().logout();
        }
      },

      register: async (registerData: RegisterCredentials): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post("/auth/register", registerData);
          const data = response.data;

          // Optionally auto-login after successful registration
          // Or just set success state without logging in
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Registration failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      clearError: (): void => {
        set({ error: null });
      },

      // Password reset functionality
      requestPasswordReset: async (contactInfo: string): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          // Determine if contactInfo is email or phone number
          const isEmail = contactInfo.includes("@");
          const payload = isEmail
            ? { email: contactInfo }
            : { phoneNumber: contactInfo };

          await apiClient.post("/auth/forgot-password", payload);

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Password reset request failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      verifyResetCode: async (
        code: string,
        contactInfo: string
      ): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          // Determine if contactInfo is email or phone number
          const isEmail = contactInfo.includes("@");
          const payload = isEmail
            ? { email: contactInfo, code: parseInt(code) }
            : { phoneNumber: contactInfo, code: parseInt(code) };

          await apiClient.post("/auth/verify-reset-code", payload);

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Invalid verification code";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      resetPassword: async (
        code: string,
        newPassword: string,
        contactInfo: string
      ): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          // Determine if contactInfo is email or phone number
          const isEmail = contactInfo.includes("@");
          const payload = isEmail
            ? {
                email: contactInfo,
                code: parseInt(code),
                password: newPassword,
                password_confirmation: newPassword,
              }
            : {
                phoneNumber: contactInfo,
                code: parseInt(code),
                password: newPassword,
                password_confirmation: newPassword,
              };

          await apiClient.post("/auth/reset-password", payload);

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Password reset failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      // Email verification functionality
      verifyEmail: async (email: string, code: string): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          await apiClient.post("/auth/verify-email", {
            email,
            code: parseInt(code),
          });

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Email verification failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      resendVerificationCode: async (email: string): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          await apiClient.post("/auth/resend-verify-code", { email });

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to resend verification code";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
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
