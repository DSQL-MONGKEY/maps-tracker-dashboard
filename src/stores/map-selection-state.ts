import { set } from 'date-fns';
import { create } from 'zustand'


interface MapSelecttionState {
   fromId: string | null;
   toId: string | null;
   setFromId: (id: string | null) => void;
   setToId: (id: string | null) => void;
   clearSelection: () => void;
}

export const useMapSelectionStore = create<MapSelecttionState>((set) => ({
   fromId: null,
   toId: null,
   setFromId: (id) => set({ fromId: id }),
   setToId: (id) => set({ toId: id }),
   clearSelection: () => set({ fromId: null, toId: null }),   
}));

