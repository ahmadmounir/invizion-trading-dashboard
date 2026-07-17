/**
 * Zustand store for the logged-in user's profile.
 * No backend — the profile is mirrored to localStorage so a page reload keeps
 * the user logged in with their data, instead of needing an async re-fetch.
 */
import { create } from 'zustand';
import type { PublicUser } from '@/shared/types/user';

const PROFILE_STORAGE_KEY = 'inviziontenantui-profile';

const readStoredProfile = (): PublicUser | null => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as PublicUser;
  } catch {
    return null;
  }
};

interface ProfileState {
  profile: PublicUser | null;
  setProfile: (profile: PublicUser | null) => void;
  clearProfile: () => void;
  updateProfile: (updates: Partial<PublicUser>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: readStoredProfile(),

  setProfile: (profile) => {
    if (profile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
    set({ profile });
  },

  clearProfile: () => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    set({ profile: null });
  },

  updateProfile: (updates) =>
    set((state) => {
      if (!state.profile) return state;
      const profile = { ...state.profile, ...updates };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return { profile };
    }),
}));

/** Helper hook to get just the profile data */
export const useProfile = () => useProfileStore((state) => state.profile);
