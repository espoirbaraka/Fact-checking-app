import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  apiKey: string | null;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setNotifications: (enabled: boolean) => void;
  setApiKey: (key: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      notifications: true,
      apiKey: null,
      setTheme: (theme) => set({ theme }),
      setNotifications: (enabled) => set({ notifications: enabled }),
      setApiKey: (key) => set({ apiKey: key }),
    }),
    {
      name: "settings-storage",
    }
  )
);
