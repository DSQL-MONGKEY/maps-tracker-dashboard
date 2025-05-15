import { create } from 'zustand'


interface MapSelecttionState {
   fromId: string | null;
   toId: string | null;
   latestMode: boolean;
   latitude: number | null;
   longitude: number | null;
   setLatitude: (lat: number | null) => void;
   setLongitude: (lng: number | null) => void;
   setFromId: (id: string | null) => void;
   setToId: (id: string | null) => void;
   setLatestMode: (latestMode: boolean) => void;

   clearSelection: () => void;
}

export const useMapSelectionStore = create<MapSelecttionState>((set) => ({
   fromId: null,
   toId: null,
   latestMode: false,
   latitude: 0,
   longitude: 0,
   setLatitude: (lat) => set({ latitude: lat }),
   setLongitude: (lng) => set({ longitude: lng }),
   setFromId: (id) => set({ fromId: id }),
   setToId: (id) => set({ toId: id }),
   setLatestMode: () => set(prev => ({ latestMode: !prev.latestMode })),
   clearSelection: () => set({ fromId: '', toId: '' }),   
}));

