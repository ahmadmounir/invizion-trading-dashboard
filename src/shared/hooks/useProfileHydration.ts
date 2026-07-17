/**
 * Profile hydration hook
 * Automatically fetches the profile when the app loads if a token exists but
 * the store is empty (e.g. after refresh or a fresh login where the store is
 * in memory only).
 */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, shouldFetchProfile, useProfileStore } from '@/shared/stores/profileStore';
import { fetchAndStoreProfile } from '@/shared/services/profileService';

/**
 * Hook to automatically fetch the profile on app mount.
 * - Checks if token exists but profile is missing (page refresh).
 * - Redirects to login if 401 (invalid/expired token).
 * - SKIPS on auth pages to prevent redirect loops during MFA flow.
 */
export function useProfileHydration() {
  const profile = useProfile();
  const navigate = useNavigate();
  const setLoading = useProfileStore((state) => state.setLoading);
  const isHydrating = useRef(false);
  const hasHydrated = useRef(false);

  // ---- Profile hydration ----
  useEffect(() => {
    // Only run once on mount and if not already hydrating
    if (hasHydrated.current || isHydrating.current) {
      return;
    }

    // IMPORTANT: Skip profile hydration on auth pages (login, MFA, password reset, etc.)
    // This prevents redirect loops during authentication flows (especially MFA)
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/auth/')) {
      return;
    }

    // Check if we need to fetch profile
    if (shouldFetchProfile()) {
      isHydrating.current = true;
      setLoading(true);

      fetchAndStoreProfile()
        .then((response) => {
          if (!response.success) {
            // If failed (401 or other error), redirect to login
            console.error('Failed to fetch profile:', response.message);
            if (response.statusCode === 401) {
              navigate('/auth/login', { replace: true });
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
          // On error, redirect to login
          navigate('/auth/login', { replace: true });
        })
        .finally(() => {
          isHydrating.current = false;
          hasHydrated.current = true;
          setLoading(false);
        });
    }
  }, [navigate, profile, setLoading]);

  return { profile, isHydrating: isHydrating.current };
}
