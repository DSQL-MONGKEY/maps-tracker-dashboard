import { Tracking } from '@/features/maps/components/leaflet-maps';
import { create } from 'zustand';


type TrackingStore = {
   filteredTrackings: Tracking[];
   setFilteredTrackings: (trackings: Tracking[]) => void;
}

export const useTrackingStore = create<TrackingStore>((set) => ({
   filteredTrackings: [],
   setFilteredTrackings: (trackings) => set({ filteredTrackings: trackings })
}))