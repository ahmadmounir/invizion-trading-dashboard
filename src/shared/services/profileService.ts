import { fetcher } from '@/shared/services/apiClient';
import { useProfileStore } from '@/shared/stores/profileStore';
import i18n from 'i18next';
import type {
  ApiResponse,
  Profile,
} from '@/shared/types/api';

/**
 * Store user profile in Zustand store
 */
export const storeProfile = (profile: Profile): void => {
  useProfileStore.getState().setProfile(profile);
};

/**
 * Get user profile from API
 */
export const getProfile = async (): Promise<ApiResponse<Profile>> => {
  return fetcher<Profile>('/profile');
};

/**
 * Fetch and store user profile
 */
export const fetchAndStoreProfile = async (): Promise<ApiResponse<Profile>> => {
  const response = await getProfile();
  if (response.success && response.data) {
    storeProfile(response.data);
    // Sync language to localStorage and i18n, but only on first load — if a
    // language is already stored (e.g. a developer override), don't clobber
    // it every time the profile is refetched (login, page refresh, etc).
    if (response.data.language && !localStorage.getItem('inviziontenantui-language')) {
      localStorage.setItem('inviziontenantui-language', response.data.language);
      if (i18n.language !== response.data.language) {
        i18n.changeLanguage(response.data.language);
      }
    }
  }
  return response;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: { 
  firstName: string; 
  lastName: string;
  phone?: string;
  timezoneId?: string;
  language?: string;
}): Promise<ApiResponse<Profile>> => {
  return fetcher<Profile>('/profile', 'PUT', data);
};

/**
 * Update user language preference
 */
export const updateProfileLanguage = async (language: string): Promise<ApiResponse<void>> => {
  return fetcher<void>('/profile/language', 'PATCH', { language });
};

/**
 * Get all available timezones
 */
export const getTimezones = async (): Promise<ApiResponse<Record<string, string>>> => {
  return fetcher<Record<string, string>>('/timezones/list', 'GET', undefined, false);
};

/**
 * Get active sessions
 */
export const getSessions = async (): Promise<ApiResponse<import('@/shared/types/api').Session[]>> => {
  return fetcher<import('@/shared/types/api').Session[]>('/profile/sessions', 'GET');
};