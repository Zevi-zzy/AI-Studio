import { create } from 'zustand';
import { Inspiration } from '@/types';
import { db } from '@/db';

interface InspirationState {
  inspirations: Inspiration[];
  isGenerating: boolean;
  loadInspirations: () => Promise<void>;
  generateInspirations: (keywords: string[]) => Promise<void>;
  adoptInspiration: (id: string) => Promise<void>;
  addInspirations: (inspirations: Inspiration[]) => Promise<void>;
}

export const useInspirationStore = create<InspirationState>((set, get) => ({
  inspirations: [],
  isGenerating: false,

  loadInspirations: async () => {
    const inspirations = await db.inspirations.orderBy('createdAt').reverse().toArray();
    set({ inspirations });
  },

  generateInspirations: async (keywords: string[]) => {
    set({ isGenerating: true });
    try {
      // Logic for generating inspirations will be handled by the UI calling the AI service
      // This function might be just a placeholder or state setter
      // But we can persist the result here if needed
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
