'use client';

import { MapSkeleton } from "@/components/ui/maps/data-maps-skeleton";
import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import('@/features/maps/components/leaflet-maps'), {
   ssr: false,
   loading: () => <MapSkeleton /> 
});

export default function ClientMapWrapper() {
   return (
      <MapLeaflet />
   )
}