/**
 * Authentication service for login, registration, and session management
 */
import { fetcher } from '@/shared/services/apiClient';
import { fetchAndStoreProfile } from '@/shared/services/profileService';
import { useProfileStore } from '@/shared/stores/profileStore';
import type {
  ApiResponse,
  AuthChallengeData,
  Profile
} from '@/shared/types/api';
import type {
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordBeginRequest,
  ResetPasswordVerifyRequest,
  ResetPasswordCommitRequest,
  SetMobileRequest
} from '@/features/auth/types';

// Route to land on for each known "fully authenticated" nextStep value.
const ACCESS_STEP_PATHS: Record<string, string> = {
  dashboard: '/',
};
const DEFAULT_ACCESS_PATH = '/';

export interface AuthChallengeOutcome {
  /** Whether this response grants full access or requires another step. */
  status: 'access' | 'challenge';
  /** Route to navigate to next. */
  path: string;
  /** OTP destinations for the next challenge step, if any (e.g. MFA). */
  otpSentTo?: string[] | null;
}

/**
 * Single place every auth step (login, external login, MFA/email/mobile
 * verification) calls once its endpoint responds with an AuthChallengeData
 * payload. Stores the new token and, when `tokenType` is "access" (the
 * server also sends `nextStep: "dashboard"`), hydrates the profile store
 * before resolving. Every step must go through this so none of them can
 * drift out of sync with what "fully authenticated" requires.
 */
export async function resolveAuthChallenge(
  data: AuthChallengeData,
): Promise<AuthChallengeOutcome> {
  localStorage.setItem('inviziontenantui-token', data.token);

  if (data.tokenType === 'access') {
    await Promise.all([
      fetchAndStoreProfile().catch((error) => {
        console.error('Failed to fetch profile after authentication:', error);
      }),
    ]);

    const path =
      (data.nextStep && ACCESS_STEP_PATHS[data.nextStep]) || DEFAULT_ACCESS_PATH;
    return { status: 'access', path };
  }

  if (data.tokenType === 'challenge' && data.nextStep) {
    return {
      status: 'challenge',
      path: `/auth/${data.nextStep}`,
      otpSentTo: data.otpSentTo,
    };
  }

  throw new Error('Unexpected authentication response');
}

export async function register(credentials: RegisterCredentials): Promise<ApiResponse<{ accessToken: string }>> {
  const registerData = {
    email: credentials.email,
    timezoneId: credentials.timezoneId,
    password: credentials.password,
    firstName: credentials.firstName,
    lastName: credentials.lastName,
    phone: credentials.phone || ''
  };

  return fetcher<{ accessToken: string }>('/auth/signup', 'POST', registerData);
}

// Token storage and profile/onboarding hydration for the response happen in
// resolveAuthChallenge() — callers must await it with the response data.
export async function externalLogin(provider: string, credential: string): Promise<ApiResponse<AuthChallengeData>> {
  return fetcher<AuthChallengeData>('/auth/external/login', 'POST', {
    provider,
    credential,
    timezoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: "tr"
  });
}

export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthChallengeData>> {
  return fetcher<AuthChallengeData>('/auth/login', 'POST', {
    username: credentials.username,
    password: credentials.password
  });
}

export async function getProfile(): Promise<ApiResponse<Profile>> {
  const token = localStorage.getItem('inviziontenantui-token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return fetcher<Profile>('/auth/profile', 'GET');
}

// MFA Verification - Verify the MFA code
export async function verifyMfa(code: string): Promise<ApiResponse<AuthChallengeData>> {
  const token = localStorage.getItem('inviziontenantui-token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // fetcher will automatically send the token from localStorage in Authorization header
  return fetcher<AuthChallengeData>(
    '/auth/mfa/verify',
    'POST',
    { code }
  );
}

// Email Verification - Begin the email verification process
export async function verifyEmailBegin(): Promise<ApiResponse<void>> {
  const token = localStorage.getItem('inviziontenantui-token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // fetcher will automatically send the token from localStorage in Authorization header
  return fetcher<void>('/auth/verify-email/begin', 'POST');
}

// Email Verification - Verify the email code
export async function verifyEmail(code: string): Promise<ApiResponse<AuthChallengeData>> {
  const token = localStorage.getItem('inviziontenantui-token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // fetcher will automatically send the token from localStorage in Authorization header
  return fetcher<AuthChallengeData>(
    '/auth/verify-email/verify',
    'POST',
    { code }
  );
}

// Set Mobile - Register a mobile number during the login challenge flow
// Note: the API only returns success/error here (no token/tokenType/nextStep) —
// the caller always continues to the verify-mobile step on success.
export async function setMobile(mobileNumber: string): Promise<ApiResponse<void>> {
  const token = localStorage.getItem('inviziontenantui-token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const data: SetMobileRequest = { mobileNumber };

  return fetcher<void>('/auth/set-mobile', 'POST', data);
}

// Mobile Verification - Begin the mobile verification process
export async function verifyMobileBegin(): Promise<ApiResponse<void>> {
  const token = localStorage.getItem('inviziontenantui-token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  // fetcher will automatically send the token from localStorage in Authorization header
  return fetcher<void>('/auth/verify-mobile/begin', 'POST');
}

// Mobile Verification - Verify the mobile code
export async function verifyMobile(code: string): Promise<ApiResponse<AuthChallengeData>> {
  const token = localStorage.getItem('inviziontenantui-token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  // fetcher will automatically send the token from localStorage in Authorization header
  return fetcher<AuthChallengeData>(
    '/auth/verify-mobile/verify',
    'POST',
    { code }
  );
}
  
// Reset password flow - Begin the reset process
export async function resetPasswordBegin(email: string): Promise<ApiResponse<void>> {
  const data: ResetPasswordBeginRequest = { address: email };
  return fetcher<void>('/auth/reset-password/begin', 'POST', data);
}

// Reset password flow - Verify the code
export async function resetPasswordVerify(email: string, code: string): Promise<ApiResponse<{ token: string }>> {
  const data: ResetPasswordVerifyRequest = { 
    address: email,
    code: code 
  };
  return fetcher<{ token: string }>('/auth/reset-password/verify', 'POST', data);
}

// Reset password flow - Commit the new password
export async function resetPasswordCommit(token: string, newPassword: string): Promise<ApiResponse<void>> {
  const data: ResetPasswordCommitRequest = { 
    token: token,
    newPassword: newPassword 
  };
  return fetcher<void>('/auth/reset-password/commit', 'POST', data);
}

export async function logout(): Promise<ApiResponse<void>> {
  try {
    // Call server-side logout API
    const result = await fetcher<void>('/auth/logout', 'POST');
    
    // Always clear client-side data regardless of API response
    localStorage.removeItem('inviziontenantui-token');
    useProfileStore.getState().clearProfile();

    return result;
  } catch (error) {
    // Even if API fails, clear client-side data
    localStorage.removeItem('inviziontenantui-token');
    useProfileStore.getState().clearProfile();

    throw error;
  }
}

export async function logoutAll(): Promise<ApiResponse<void>> {
  try {
    // Call server-side logout all API
    const result = await fetcher<void>('/auth/logout-all', 'POST');

    // Always clear client-side data regardless of API response
    localStorage.removeItem('inviziontenantui-token');
    useProfileStore.getState().clearProfile();

    return result;
  } catch (error) {
    // Even if API fails, clear client-side data
    localStorage.removeItem('inviziontenantui-token');
    useProfileStore.getState().clearProfile();

    throw error;
  }
}