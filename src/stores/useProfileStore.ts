import { create } from 'zustand';
import { Profile } from '@/types';
import { db, initProfile } from '@/db';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,

  loadProfile: async () => {
    set({ isLoading: true });
    try {
      await initProfile();
      const profile = await db.profile.get('default-user');
      set({ profile: profile || null });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { profile } = get();
    if (profile) {
      await db.profile.update(profile.id, updates);
      await get().loadProfile();
    }
  },
}));
