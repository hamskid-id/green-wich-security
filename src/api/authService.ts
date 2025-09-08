import apiClient from "../api/client";
import { AxiosResponse } from "axios";
import {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
} from "../types/auth";
import { ApiResponse } from "../types";

export const authService = {
  login: async (
    credentials: LoginCredentials
  ): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
    return (
      apiClient.post <ApiResponse<LoginResponse>>("/auth/login", credentials)
    );
  },

  register: async (data: RegisterCredentials): Promise<void> => {
    await apiClient.post("/auth/register", data);
  },

  verifyToken: async (): Promise<void> => {
    await apiClient.get("/auth/verify");
  },

  requestPasswordReset: async (contactInfo: string): Promise<void> => {
    const isEmail = contactInfo.includes("@");
    const payload = isEmail
      ? { email: contactInfo }
      : { phoneNumber: contactInfo };

    await apiClient.post("/auth/forgot-password", payload);
  },

  verifyResetCode: async (code: string, contactInfo: string): Promise<void> => {
    const isEmail = contactInfo.includes("@");
    const payload = isEmail
      ? { email: contactInfo, code: parseInt(code) }
      : { phoneNumber: contactInfo, code: parseInt(code) };

    await apiClient.post("/auth/verify-email", payload);
  },

  resetPassword: async (
    code: string,
    newPassword: string,
    contactInfo: string
  ): Promise<void> => {
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
  },

  verifyEmail: async (email: string, code: string): Promise<void> => {
    await apiClient.post("/auth/verify-email", {
      email,
      code: parseInt(code),
    });
  },

  resendVerificationCode: async (email: string): Promise<void> => {
    await apiClient.post("/auth/resend-verify-code", { email });
  },
};
