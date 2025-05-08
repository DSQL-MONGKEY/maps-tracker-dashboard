'use client';
import { Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useTrackingStore } from '@/stores/trackings';

interface Device {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface Props {
   fromId: string;
   toId: string;
   devices: Device[];
}

export default function DistanceLine({ fromId, toId }: Props) {
   const { filteredTrackings } = useTrackingStore();

   const fromDevice = filteredTrackings.find((d) => d.id === fromId);
   const toDevice = filteredTrackings.find((d) => d.id === toId);

   if (!fromDevice || !toDevice) return null;

   const fromLatLng = L.latLng(fromDevice.latitude, fromDevice.longitude);
   const toLatLng = L.latLng(toDevice.latitude, toDevice.longitude);
   const distance = fromLatLng.distanceTo(toLatLng); // in meters

   const middlePoint = L.latLng(
      (fromDevice.latitude + toDevice.latitude) / 2,
      (fromDevice.longitude + toDevice.longitude) / 2
   );

   return (
      <>
         <Polyline positions={[[fromLatLng.lat, fromLatLng.lng], [toLatLng.lat, toLatLng.lng]]} color="yellow">
            <Tooltip 
               permanent 
               offset={[0, -10]}
               direction="center"
               position={middlePoint}
               className="text-xs bg-white p-1 rounded shadow"
            >
               {`${(distance / 1000).toFixed(2)} km`}
            </Tooltip>
         </Polyline>
      </>
   );
}
