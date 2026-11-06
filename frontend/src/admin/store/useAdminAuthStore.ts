import { create } from 'zustand';
import { adminApi } from '@/admin/adminApi';

interface AdminAuthState {
  username: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  checkSession: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  username: null,
  status: 'idle',
  checkSession: async () => {
    set({ status: 'loading' });
    try {
      const { username } = await adminApi.me();
      set({ username, status: 'authenticated' });
    } catch {
      set({ username: null, status: 'unauthenticated' });
    }
  },
  login: async (username, password) => {
    const result = await adminApi.login(username, password);
    set({ username: result.username, status: 'authenticated' });
  },
  logout: async () => {
    await adminApi.logout().catch(() => {});
    set({ username: null, status: 'unauthenticated' });
  },
}));
