'use client';

import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import('@/components/maps/leaflet_maps'), {
   ssr: false,
   loading: () => <p>Loading Map...</p>
});

export default function ClientMapWrapper() {
   return (
      <MapLeaflet />
   )
}