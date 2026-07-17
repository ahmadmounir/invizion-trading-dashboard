import { fetcher } from '@/shared/services/apiClient';
import type {
  ApiResponse,
  ChangePasswordRequest,
  SetPasswordRequest
} from '@/shared/types/api';

/**
 * Begin email change - sends verification code to new email
 */
export const beginEmailChange = async (data: { address: string }): Promise<ApiResponse<void>> => {
  return fetcher<void>('/profile/change-email/begin', 'POST', data);
};

/**
 * Verify email change code - no auth required
 */
export const verifyEmailChangeCode = async (data: { address: string; code: string }): Promise<ApiResponse<{ token: string }>> => {
  return fetcher<{ token: string }>('/profile/change-email/verify', 'POST', data);
};

/**
 * Commit email change with token
 */
export const commitEmailChange = async (data: { token: string }): Promise<ApiResponse<void>> => {
  return fetcher<void>('/profile/change-email/commit', 'POST', data);
};

/**
 * Change user password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
  return fetcher<void>('/profile/password', 'POST', data);
};

/**
 * Set a password for accounts that don't have one yet (e.g. social sign-in)
 */
export const setPassword = async (data: SetPasswordRequest): Promise<ApiResponse<void>> => {
  return fetcher<void>('/profile/password/set', 'POST', data);
};

/**
 * Enable MFA for user account
 */
export const enableMfa = async (): Promise<ApiResponse<void>> => {
  return fetcher<void>('/profile/mfa/enable', 'POST');
};

/**
 * Disable MFA for user account
 */
export const disableMfa = async (): Promise<ApiResponse<void>> => {
  return fetcher<void>('/profile/mfa/disable', 'POST');
};