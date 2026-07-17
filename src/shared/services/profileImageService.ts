import { fetcher } from '@/shared/services/apiClient';
import type { ApiResponse, ProfileImage } from '@/shared/types/api';

/**
 * Profile avatar image endpoints. Shared between onboarding (upload step) and
 * settings (upload / view / delete).
 */

/** GET /profile/image */
export const getProfileImage = async (): Promise<ApiResponse<ProfileImage>> => {
  return fetcher<ProfileImage>('/profile/image');
};

/**
 * POST /profile/image — multipart/form-data upload.
 * The field name is `file`; the browser sets the multipart boundary.
 */
export const uploadProfileImage = async (
  file: File,
): Promise<ApiResponse<ProfileImage>> => {
  const formData = new FormData();
  formData.append('file', file);
  return fetcher<ProfileImage>('/profile/image', 'POST', formData);
};

/** DELETE /profile/image (settings only) */
export const deleteProfileImage = async (): Promise<ApiResponse<void>> => {
  return fetcher<void>('/profile/image', 'DELETE');
};
