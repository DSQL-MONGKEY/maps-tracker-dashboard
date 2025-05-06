'use client';

import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import('@/features/maps/components/leaflet-maps'), {
   ssr: false,
   loading: () => <p>Loading Map...</p>
});

export default function ClientMapWrapper() {
   return (
      <MapLeaflet />
   )
}