import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminSettings {
  adBeforeDownload: boolean;
  adDuration: number; // seconds
  topBannerEnabled: boolean;
  sidebarAdsEnabled: boolean;
  topBannerCode: string;
  leftAdCode: string;
  rightAdCode: string;
  isLoggedIn: boolean;
}

interface AdminStore extends AdminSettings {
  login: (password: string) => boolean;
  logout: () => void;
  updateSetting: <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => void;
}

const ADMIN_PASSWORD = 'powerdoc2024';

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      adBeforeDownload: true,
      adDuration: 30,
      topBannerEnabled: true,
      sidebarAdsEnabled: true,
      topBannerCode: '',
      leftAdCode: '',
      rightAdCode: '',
      isLoggedIn: false,

      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isLoggedIn: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isLoggedIn: false }),

      updateSetting: (key, value) => set({ [key]: value }),
    }),
    {
      name: 'powerdoc-admin',
      partialize: (state) => ({
        adBeforeDownload: state.adBeforeDownload,
        adDuration: state.adDuration,
        topBannerEnabled: state.topBannerEnabled,
        sidebarAdsEnabled: state.sidebarAdsEnabled,
        topBannerCode: state.topBannerCode,
        leftAdCode: state.leftAdCode,
        rightAdCode: state.rightAdCode,
      }),
    }
  )
);
