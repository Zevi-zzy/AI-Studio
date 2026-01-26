import Dexie, { Table } from 'dexie';
import { Creation, Inspiration, Material, Profile } from '@/types';

export class ZeviDatabase extends Dexie {
  creations!: Table<Creation>;
  inspirations!: Table<Inspiration>;
  materials!: Table<Material>;
  profile!: Table<Profile>;

  constructor() {
    super('ZeviDB');
    
    // Define schema
    this.version(1).stores({
      creations: 'id, title, status, createdAt, updatedAt',
      inspirations: 'id, title, isAdopted, createdAt',
      materials: 'id, type, usageCount, lastUsed, createdAt, *tags',
      profile: 'id'
    });
  }
}

export const db = new ZeviDatabase();

// Initialize profile if not exists
export const initProfile = async () => {
  const count = await db.profile.count();
  if (count === 0) {
    await db.profile.add({
      id: 'default-user',
      nickname: 'Creative User',
      accountType: 'Personal',
      totalCreations: 0,
      createdAt: new Date(),
      settings: {
        defaultTone: 'casual',
        aiPreferences: {},
        theme: 'light'
      }
    });
  }
};
