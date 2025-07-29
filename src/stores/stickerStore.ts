import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Sticker {
  id: string;
  emoji: string;
  x: number; // Position X (percentage)
  y: number; // Position Y (percentage)
  size: number; // Size multiplier (0.5 - 3.0)
  rotation: number; // Rotation in degrees (0-360)
  zIndex: number;
}

interface StickerState {
  stickers: Sticker[];
  isPickerOpen: boolean;
  selectedStickerId: string | null;
  
  // Actions
  addSticker: (emoji: string, x?: number, y?: number) => void;
  removeSticker: (id: string) => void;
  updateSticker: (id: string, updates: Partial<Omit<Sticker, 'id'>>) => void;
  selectSticker: (id: string | null) => void;
  clearAllStickers: () => void;
  setPickerOpen: (open: boolean) => void;
  
  // Utility actions
  duplicateSticker: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
}

// 小红书风格的常用贴纸表情
export const XIAOHONGSHU_STICKERS = [
  // 表情类
  '😊', '😍', '🥰', '😘', '😋', '😎', '🤩', '🥳', '😇', '🤗',
  '😂', '🤣', '😭', '🥺', '😤', '😱', '🤔', '😴', '🤤', '🙄',
  
  // 手势类
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '👏', '🙌', '👐',
  '🤲', '🙏', '✍️', '💪', '🦵', '👂', '👀', '🧠', '❤️', '💔',
  
  // 物品类
  '📱', '💻', '📷', '🎧', '🎮', '🕹️', '🎯', '🎲', '🧩', '🎨',
  '📚', '📝', '✏️', '🖊️', '📐', '📏', '📌', '📎', '🔗', '📋',
  
  // 食物类
  '🍎', '🍌', '🍓', '🍇', '🍊', '🥝', '🍑', '🥭', '🍍', '🥥',
  '🍔', '🍕', '🌭', '🥪', '🌮', '🌯', '🥗', '🍝', '🍜', '🍲',
  '🍰', '🧁', '🍪', '🍫', '🍬', '🍭', '🍮', '🍯', '🥛', '☕',
  
  // 活动类
  '🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🕯️', '🎆', '🎇', '✨',
  '⭐', '🌟', '💫', '⚡', '💥', '💢', '💨', '💦', '💤', '💭',
  
  // 符号类
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕',
  '💖', '💗', '💘', '💝', '💞', '💟', '❣️', '💌', '💋', '💍',
  
  // 自然类
  '🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌾', '🌿', '☘️', '🍀',
  '🌙', '⭐', '🌟', '☀️', '⛅', '🌈', '❄️', '⚡', '🔥', '💧'
];

const useStickerStore = create<StickerState>()(
  persist(
    (set, get) => ({
      stickers: [],
      isPickerOpen: false,
      selectedStickerId: null,
      
      addSticker: (emoji: string, x = 50, y = 50) => {
        const newSticker: Sticker = {
          id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          emoji,
          x: Math.max(2, Math.min(98, x)), // Ensure within bounds
          y: Math.max(2, Math.min(98, y)), // Ensure within bounds
          size: 1.0,
          rotation: 0,
          zIndex: get().stickers.length,
        };
        
        set((state) => ({
          stickers: [...state.stickers, newSticker],
          selectedStickerId: newSticker.id,
        }));
      },
      
      removeSticker: (id: string) => {
        set((state) => ({
          stickers: state.stickers.filter(s => s.id !== id),
          selectedStickerId: state.selectedStickerId === id ? null : state.selectedStickerId,
        }));
      },
      
      updateSticker: (id: string, updates: Partial<Omit<Sticker, 'id'>>) => {
        set((state) => ({
          stickers: state.stickers.map(s => 
            s.id === id ? { 
              ...s, 
              ...updates,
              // Ensure position stays within bounds
              x: updates.x !== undefined ? Math.max(2, Math.min(98, updates.x)) : s.x,
              y: updates.y !== undefined ? Math.max(2, Math.min(98, updates.y)) : s.y,
              // Ensure size stays within reasonable bounds
              size: updates.size !== undefined ? Math.max(0.3, Math.min(3, updates.size)) : s.size,
              // Ensure rotation stays within 0-360
              rotation: updates.rotation !== undefined ? updates.rotation % 360 : s.rotation,
            } : s
          ),
        }));
      },
      
      selectSticker: (id: string | null) => {
        set({ selectedStickerId: id });
      },
      
      clearAllStickers: () => {
        set({ stickers: [], selectedStickerId: null });
      },
      
      setPickerOpen: (open: boolean) => {
        set({ isPickerOpen: open });
      },
      
      duplicateSticker: (id: string) => {
        const sticker = get().stickers.find(s => s.id === id);
        if (sticker) {
          const newSticker: Sticker = {
            ...sticker,
            id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            x: Math.max(2, Math.min(98, sticker.x + 5)),
            y: Math.max(2, Math.min(98, sticker.y + 5)),
            zIndex: get().stickers.length,
          };
          
          set((state) => ({
            stickers: [...state.stickers, newSticker],
            selectedStickerId: newSticker.id,
          }));
        }
      },
      
      bringToFront: (id: string) => {
        const stickers = get().stickers;
        const maxZ = Math.max(...stickers.map(s => s.zIndex), 0);
        get().updateSticker(id, { zIndex: maxZ + 1 });
      },
      
      sendToBack: (id: string) => {
        const stickers = get().stickers;
        const minZ = Math.min(...stickers.map(s => s.zIndex), 0);
        get().updateSticker(id, { zIndex: minZ - 1 });
      },
    }),
    {
      name: "sticker-storage",
      version: 1, // Add version for future migrations
    },
  ),
);

export default useStickerStore;