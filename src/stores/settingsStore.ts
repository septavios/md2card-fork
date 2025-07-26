import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LayoutMode = "自动拆分" | "横线拆分";
export type AspectRatio = "16:9" | "4:3" | "1:1" | "自定义";
export type BackgroundType = "solid" | "gradient" | "texture" | "image";

interface BackgroundSettings {
  type: BackgroundType;
  solidColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: number; // 0-360 degrees
  texturePattern: string;
  imageUrl: string;
  opacity: number; // 0-100
  // Readability enhancement options
  textOverlay?: 'none' | 'semi-transparent' | 'blur' | 'gradient';
  contrastBoost?: number; // 0-100
  blurAmount?: number; // 0-10 px
}

interface SettingsState {
  // Existing settings
  cardWidth: number;
  cardHeight: number;
  viewMode: "长卡片" | "短卡片";
  hideOverflow: boolean;
  selectedTheme: string;
  
  // New settings
  showPageNumbers: boolean;
  layoutMode: LayoutMode;
  aspectRatio: AspectRatio;
  scale: number; // 0-100
  selectedFont: string;
  fontSize: number;
  lineHeight: number;
  background: BackgroundSettings;
  
  // 用户自定义设置跟踪
  hasUserCustomizations: {
    font: boolean;
    background: boolean;
    colors: boolean;
    spacing: boolean;
    shadow: boolean;
  };
  
  // Existing setters
  setCardWidth: (width: number) => void;
  setCardHeight: (height: number) => void;
  setViewMode: (tab: "长卡片" | "短卡片") => void;
  setHideOverflow: (hide: boolean) => void;
  setSelectedTheme: (theme: string) => void;
  
  // New setters
  setShowPageNumbers: (show: boolean) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setScale: (scale: number) => void;
  setSelectedFont: (font: string) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setBackground: (background: Partial<BackgroundSettings>) => void;
  
  // 自定义设置管理
  markUserCustomization: (type: keyof SettingsState['hasUserCustomizations']) => void;
  clearUserCustomizations: () => void;
  resetToThemeDefaults: () => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Existing settings
      cardWidth: 440,
      cardHeight: 586,
      viewMode: "长卡片",
      hideOverflow: false,
      selectedTheme: "默认",
      
      // New settings
      showPageNumbers: false,
      layoutMode: "自动拆分",
      aspectRatio: "16:9",
      scale: 100,
      selectedFont: "Inter",
      fontSize: 14,
      lineHeight: 1.6,
      background: {
        type: "solid",
        solidColor: "#ffffff",
        gradientStart: "#ffffff",
        gradientEnd: "#f0f0f0",
        gradientDirection: 45,
        texturePattern: "none",
        imageUrl: "",
        opacity: 100,
        textOverlay: "none",
        contrastBoost: 0,
        blurAmount: 0,
      },
      
      // 用户自定义设置跟踪
      hasUserCustomizations: {
        font: false,
        background: false,
        colors: false,
        spacing: false,
        shadow: false,
      },
      
      // Existing setters
      setCardWidth: (width: number) => set({ cardWidth: width }),
      setCardHeight: (height: number) => set({ cardHeight: height }),
      setViewMode: (tab: "长卡片" | "短卡片") => set({ viewMode: tab }),
      setHideOverflow: (hide: boolean) => set({ hideOverflow: hide }),
      setSelectedTheme: (theme: string) => set({ selectedTheme: theme }),
      
      // New setters
      setShowPageNumbers: (show: boolean) => set({ showPageNumbers: show }),
      setLayoutMode: (mode: LayoutMode) => set({ layoutMode: mode }),
      setAspectRatio: (ratio: AspectRatio) => set({ aspectRatio: ratio }),
      setScale: (scale: number) => set({ scale: scale }),
      setSelectedFont: (font: string) => set((state) => {
        state.hasUserCustomizations.font = true;
        return { selectedFont: font };
      }),
      setFontSize: (size: number) => set((state) => {
        state.hasUserCustomizations.font = true;
        return { fontSize: size };
      }),
      setLineHeight: (height: number) => set((state) => {
        state.hasUserCustomizations.font = true;
        return { lineHeight: height };
      }),
      setBackground: (background: Partial<BackgroundSettings>) => 
        set((state) => {
          state.hasUserCustomizations.background = true;
          return { background: { ...state.background, ...background } };
        }),
      
      // 自定义设置管理
      markUserCustomization: (type: keyof SettingsState['hasUserCustomizations']) => 
        set((state) => ({
          hasUserCustomizations: {
            ...state.hasUserCustomizations,
            [type]: true
          }
        })),
      
      clearUserCustomizations: () => 
        set({
          hasUserCustomizations: {
            font: false,
            background: false,
            colors: false,
            spacing: false,
            shadow: false,
          }
        }),
      
      resetToThemeDefaults: () => 
        set({
          hasUserCustomizations: {
            font: false,
            background: false,
            colors: false,
            spacing: false,
            shadow: false,
          },
          // 这里可以重置其他设置到默认值
        }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
