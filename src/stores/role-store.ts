import { create } from "zustand";
import { persist } from "zustand/middleware";


type RoleState = {
   role: string | null;
   setRole: (role: string) => void;
   clearRole: () => void;
};

export const useRoleStore = create<RoleState>()(
   persist(
      (set) => ({
         role: null,
         setRole: (role) => set({ role }),
         clearRole: () => set({ role: null })
      }),
      {
         name: 'user-role', // key local-storage
      }
   )
)