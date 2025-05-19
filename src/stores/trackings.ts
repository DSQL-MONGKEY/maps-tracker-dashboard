import { Tracking } from '@/types';
import { create } from 'zustand';


type TrackingStore = {
   filteredTrackings: Tracking[];
   setFilteredTrackings: (trackings: any) => void;
}

export const useTrackingStore = create<TrackingStore>((set) => ({
   filteredTrackings: [],
   setFilteredTrackings: (trackings) => set({ filteredTrackings: trackings })
}))