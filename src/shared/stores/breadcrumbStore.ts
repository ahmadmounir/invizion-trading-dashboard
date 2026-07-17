import { create } from 'zustand';

interface BreadcrumbState {
  pageTitle: string | null;
  setPageTitle: (title: string) => void;
  clearPageTitle: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  pageTitle: null,
  setPageTitle: (title) => set({ pageTitle: title }),
  clearPageTitle: () => set({ pageTitle: null }),
}));
