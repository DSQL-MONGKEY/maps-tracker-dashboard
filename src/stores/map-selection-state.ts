import { create } from 'zustand'


interface MapSelecttionState {
   fromId: string | null;
   toId: string | null;
   latestMode: boolean;
   setFromId: (id: string | null) => void;
   setToId: (id: string | null) => void;
   setLatestMode: (latestMode: boolean) => void;
   clearSelection: () => void;
}

export const useMapSelectionStore = create<MapSelecttionState>((set) => ({
   fromId: null,
   toId: null,
   latestMode: false,
   setFromId: (id) => set({ fromId: id }),
   setToId: (id) => set({ toId: id }),
   setLatestMode: () => set(prev => ({ latestMode: !prev.latestMode })),
   clearSelection: () => set({ fromId: '', toId: '' }),   
}));

