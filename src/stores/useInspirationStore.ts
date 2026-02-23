import { create } from 'zustand';
import { Inspiration } from '@/types';
import { db } from '@/db';
import { aiService } from '@/services/aiService';

interface InspirationState {
  inspirations: Inspiration[];
  isGenerating: boolean;
  loadInspirations: () => Promise<void>;
  generateInspirations: (keywords: string[]) => Promise<void>;
  adoptInspiration: (id: string) => Promise<void>;
  addInspirations: (inspirations: Inspiration[]) => Promise<void>;
  clearInspirations: () => Promise<void>;
}

export const useInspirationStore = create<InspirationState>((set, get) => ({
  inspirations: [],
  isGenerating: false,

  loadInspirations: async () => {
    const inspirations = await db.inspirations.orderBy('createdAt').reverse().toArray();
    set({ inspirations });
  },

  clearInspirations: async () => {
    await db.inspirations.clear();
    set({ inspirations: [] });
  },

  generateInspirations: async (keywords: string[]) => {
    set({ isGenerating: true });
    try {
      // Clear previous inspirations
      await get().clearInspirations();

      const generated = await aiService.generateInspirations({ keywords });
      
      const newInspirations: Inspiration[] = generated.map(item => ({
        ...item,
        id: crypto.randomUUID(),
        isAdopted: false,
        createdAt: new Date(),
      }));

      await get().addInspirations(newInspirations);
    } catch (error) {
      console.error('Failed to generate inspirations:', error);
    } finally {
      set({ isGenerating: false });
    }
  },

  addInspirations: async (newInspirations: Inspiration[]) => {
    await db.inspirations.bulkAdd(newInspirations);
    await get().loadInspirations();
  },

  adoptInspiration: async (id: string) => {
    await db.inspirations.update(id, { isAdopted: true });
    await get().loadInspirations();
  },
}));
