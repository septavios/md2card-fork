import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  showClock: boolean;
  setDarkMode: (isDark: boolean) => void;
  setShowClock: (show: boolean) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: true, // Default to dark mode
      showClock: false,
      setDarkMode: (isDark: boolean) => {
        set({ isDarkMode: isDark });
        // Apply theme to document root
        if (isDark) {
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
        }
      },
      setShowClock: (show: boolean) => set({ showClock: show }),
      toggleTheme: () => {
        const { isDarkMode, setDarkMode } = get();
        setDarkMode(!isDarkMode);
      },
      initializeTheme: () => {
        const { isDarkMode } = get();
        // Apply theme immediately to prevent FOUC
        if (isDarkMode) {
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
        }
        // Remove loading class to show content
        document.body.classList.remove('theme-loading');
        document.body.classList.add('theme-loaded');
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useThemeStore;
