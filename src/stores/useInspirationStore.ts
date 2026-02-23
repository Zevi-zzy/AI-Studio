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
    // Optimistically clear state first for immediate UI feedback
    set({ inspirations: [] });
    try {
      await db.inspirations.clear();
    } catch (error) {
      console.error('Failed to clear inspirations from DB:', error);
      // If DB clear fails, we might want to reload from DB to ensure consistency,
      // but for now, let's assume the state clear is what the user wants to see.
    }
  },

  generateInspirations: async (keywords: string[]) => {
    set({ isGenerating: true });
    try {
      // Clear previous inspirations immediately
      await get().clearInspirations();

      const generated = await aiService.generateInspirations({ keywords });
      
      const newInspirations: Inspiration[] = generated.map(item => ({
        ...item,
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substring(2),
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
