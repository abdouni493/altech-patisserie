import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoreSettings } from '@/types';

interface SettingsState {
  settings: StoreSettings;
  updateSettings: (data: Partial<StoreSettings>) => void;
}

const defaultSettings: StoreSettings = {
  logo: null,
  name: 'Altech Pâtisserie',
  description: 'Pâtisserie - Gâteaux & Douceurs',
  email: 'contact@altechpatisserie.com',
  phone: '0555 12 34 56',
  address: '12 Rue des Jardins, Alger',
  socialMedia: '@altechpatisserie',
  nif: '001234567890123',
  nis: '1920384756',
  article: '16253445',
  rc: '16/00-1234567B',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      updateSettings: (data) => set({ settings: { ...get().settings, ...data } }),
    }),
    {
      name: 'boulengerie-settings',
      version: 1,
      // Rebrand stores still carrying the old fast-food defaults.
      migrate: (persisted, version) => {
        const state = persisted as { settings?: StoreSettings };
        if (version < 1 && state?.settings) {
          const s = state.settings;
          if (s.name === 'Altech Food') s.name = defaultSettings.name;
          if (s.description === 'Fast Food - Commande & Vente') s.description = defaultSettings.description;
          if (s.email === 'contact@altechfood.com') s.email = defaultSettings.email;
          if (s.socialMedia === '@altechfood') s.socialMedia = defaultSettings.socialMedia;
        }
        return state as SettingsState;
      },
    }
  )
);
