import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ImageData {
  id: string;
  name: string;
  size: number;
  type: string;
  base64: string; // For persistence
  blobUrl?: string; // For performance, not persisted
}

interface ImageStore {
  images: Record<string, ImageData>;
  addImage: (file: File) => Promise<string>;
  getImageUrl: (id: string) => string | null;
  removeImage: (id: string) => void;
  clearImages: () => void;
  getAllImages: () => ImageData[];
}

// Generate a short, user-friendly ID
const generateImageId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      images: {},

      addImage: async (file: File) => {
        const id = generateImageId();
        const base64 = await fileToBase64(file);
        const blobUrl = URL.createObjectURL(file);
        
        const imageData: ImageData = {
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          base64,
          blobUrl,
        };

        set((state) => ({
          images: {
            ...state.images,
            [id]: imageData,
          },
        }));

        return id;
      },

      getImageUrl: (id: string) => {
        const imageData = get().images[id];
        
        if (!imageData) {
          return null;
        }
        
        // Always return base64 data for reliability
        return imageData.base64;
      },

      removeImage: (id: string) => {
        set((state) => {
          const imageData = state.images[id];
          
          if (imageData && imageData.blobUrl) {
            // Revoke the blob URL to free memory
            URL.revokeObjectURL(imageData.blobUrl);
          }
          
          const newImages = { ...state.images };
          delete newImages[id];
          return { images: newImages };
        });
      },

      clearImages: () => {
        const { images } = get();
        // Revoke all blob URLs to free memory
        Object.values(images).forEach((imageData) => {
          if (imageData.blobUrl) {
            URL.revokeObjectURL(imageData.blobUrl);
          }
        });
        
        set({ images: {} });
      },

      getAllImages: () => {
        return Object.values(get().images);
      },
    }),
    {
      name: 'image-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the essential data, exclude blobUrl as it's session-specific
      partialize: (state) => ({
        images: Object.fromEntries(
          Object.entries(state.images).map(([id, imageData]) => [
            id,
            {
              id: imageData.id,
              name: imageData.name,
              size: imageData.size,
              type: imageData.type,
              base64: imageData.base64,
              // Exclude blobUrl from persistence
            }
          ])
        )
      }),
    }
  )
);