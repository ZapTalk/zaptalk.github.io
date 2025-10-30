import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  pubkey: string | null;
  isGuest: boolean;
  loginWithNostr: (pubkey: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      pubkey: null,
      isGuest: false,
      
      loginWithNostr: (pubkey: string) => {
        set({ pubkey, isGuest: false });
      },
      
      continueAsGuest: () => {
        set({ pubkey: null, isGuest: true });
      },
      
      logout: () => {
        set({ pubkey: null, isGuest: false });
      },
    }),
    {
      name: 'zaptalk-auth',
    }
  )
);
