import type { ServiceResult, UserProfile } from "../store-schema";

export type AuthSession = {
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
};

export type SignInRequest = {
  email?: string;
  phone?: string;
  redirectTo?: string;
};

const backendNotConfigured = <T>(message = "Authentication backend is not connected yet."): ServiceResult<T> => ({
  data: null,
  error: { code: "backend_not_configured", message },
});

export const getCurrentSession = async (): Promise<ServiceResult<AuthSession>> => ({
  data: null,
  error: null,
});

export const getCurrentUser = async (): Promise<ServiceResult<UserProfile>> => ({
  data: null,
  error: null,
});

export const signInWithOtp = async (request: SignInRequest): Promise<ServiceResult<AuthSession>> => {
  void request;
  return backendNotConfigured<AuthSession>();
};

export const signOut = async (): Promise<ServiceResult<null>> => ({
  data: null,
  error: null,
});
