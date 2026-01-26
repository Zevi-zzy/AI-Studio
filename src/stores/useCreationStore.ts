import { create } from 'zustand';
import { Creation } from '@/types';
import { db } from '@/db';

interface CreationState {
  creations: Creation[];
  currentCreation: Creation | null;
  isLoading: boolean;
  loadCreations: () => Promise<void>;
  loadCreation: (id: string) => Promise<void>;
  saveCreation: (creation: Creation) => Promise<void>;
  updateCreation: (id: string, updates: Partial<Creation>) => Promise<void>;
  deleteCreation: (id: string) => Promise<void>;
  setCurrentCreation: (creation: Creation | null) => void;
}

export const useCreationStore = create<CreationState>((set, get) => ({
  creations: [],
  currentCreation: null,
  isLoading: false,

  loadCreations: async () => {
    set({ isLoading: true });
    try {
      const creations = await db.creations.orderBy('updatedAt').reverse().toArray();
      set({ creations });
    } finally {
      set({ isLoading: false });
    }
  },

  loadCreation: async (id: string) => {
    set({ isLoading: true });
    try {
      const creation = await db.creations.get(id);
      set({ currentCreation: creation || null });
    } finally {
      set({ isLoading: false });
    }
  },

  saveCreation: async (creation: Creation) => {
    await db.creations.put(creation);
    await get().loadCreations();
  },

  updateCreation: async (id: string, updates: Partial<Creation>) => {
    await db.creations.update(id, { ...updates, updatedAt: new Date() });
    await get().loadCreations();
    if (get().currentCreation?.id === id) {
      const updated = await db.creations.get(id);
      set({ currentCreation: updated || null });
    }
  },

  deleteCreation: async (id: string) => {
    await db.creations.delete(id);
    await get().loadCreations();
    if (get().currentCreation?.id === id) {
      set({ currentCreation: null });
    }
  },

  setCurrentCreation: (creation) => set({ currentCreation: creation }),
}));
