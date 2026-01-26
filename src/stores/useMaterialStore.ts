import { create } from 'zustand';
import { Material } from '@/types';
import { db } from '@/db';

interface MaterialState {
  materials: Material[];
  isLoading: boolean;
  loadMaterials: () => Promise<void>;
  addMaterial: (material: Material) => Promise<void>;
  updateMaterial: (id: string, updates: Partial<Material>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  incrementUsage: (id: string) => Promise<void>;
}

export const useMaterialStore = create<MaterialState>((set, get) => ({
  materials: [],
  isLoading: false,

  loadMaterials: async () => {
    set({ isLoading: true });
    try {
      const materials = await db.materials.orderBy('createdAt').reverse().toArray();
      set({ materials });
    } finally {
      set({ isLoading: false });
    }
  },

  addMaterial: async (material: Material) => {
    await db.materials.add(material);
    await get().loadMaterials();
  },

  updateMaterial: async (id: string, updates: Partial<Material>) => {
    await db.materials.update(id, updates);
    await get().loadMaterials();
  },

  deleteMaterial: async (id: string) => {
    await db.materials.delete(id);
    await get().loadMaterials();
  },

  incrementUsage: async (id: string) => {
    const material = await db.materials.get(id);
    if (material) {
      await db.materials.update(id, {
        usageCount: material.usageCount + 1,
        lastUsed: new Date(),
      });
      await get().loadMaterials();
    }
  },
}));
