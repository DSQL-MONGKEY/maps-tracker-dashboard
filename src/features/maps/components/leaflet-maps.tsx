'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider, SearchControl } from 'leaflet-geosearch'
import { supabase } from '@/lib/supabase/server';


interface Tracking {
   id: string;
   device_id: string;
   holder_name: string;
   rssi: string;
   snr:  string;
   latitude: number;
   longitude: number;
   is_emergency: boolean;
   createdAt: string;
   updatedAt: string;
   devices: {
      name: string
   }
}  

const defaultPosition: [number, number] = [-6.393875, 106.822557]; // Depok

const deviceMarkerIcon = new L.Icon({
      iconUrl: '/icons/map-marker.png',
      iconSize: [35, 51],
      iconAnchor: [12, 41],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      popupAnchor: [1, -35],
      shadowSize: [41, 41],
});

const selectLocationMarkerIcon = new L.Icon({
   iconUrl: '/icons/map-marker-select.png',
   iconSize: [35, 51],
   iconAnchor: [12, 41],
   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
   popupAnchor: [1, -34],
   shadowSize: [41, 41],
});

//@ts-ignore
const MapEvents = ({ onMapClick }) => {
   useMapEvents({
      click(event) {
         const { latlng } = event;
         onMapClick(latlng);
      },
   });

   return null;
};





//@ts-ignore
export default function Map() {
   const [trackings, setTrackings] = useState<Tracking[]>([]);
   const [markerPosition, setMarkerPosition] = useState(null);
   const [selectedLocation, setSelectedLocation] = useState<[number, number]>([0, 0]);
   
   const handleMapClick = (latlng: any) => {
      const { lat, lng } = latlng;
      setMarkerPosition(latlng);
      setSelectedLocation([lat, lng]);
   };

   const fetchTrackings = async () => {
      try {
         const res = await fetch('/api/trackings', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         });

         const resJson = await res.json();
         console.log('resJson', resJson);
         
         if(resJson.success && resJson.data) {
            setTrackings(resJson.data);
            localStorage.setItem('cached-trackings', JSON.stringify(resJson.data));
         }
      } catch (error) {
         console.log('Error fetching data:', error);
      }
   }


   function MapSetup() {
      const map = useMap();
   
      useEffect(() => {
         let previousMarker: any = null;
   
         // @ts-ignore
         const provider = new OpenStreetMapProvider();
   
         // @ts-ignore
         const searchControl: any = new SearchControl({
            provider,
            style: 'bar',
            colors: '#4ED7F1',
            searchLabel: 'Search for a location',
            autoComplete: true,
            autoCompleteDelay: 250,
         });
      
         map.addControl(searchControl);
   
         map.on('geosearch:result', (e) => {
            if(previousMarker) {
               map.removeLayer(previousMarker);
            }
            //@ts-ignore
            const { lat, lng } = e.result.latlng;
            const marker = L.marker([lat, lng], {
               icon: deviceMarkerIcon,
            });
            map.addLayer(marker);
            previousMarker = marker;
         })
   
         return () => {
            map.removeControl(searchControl);
            if(previousMarker) {
               map.removeLayer(previousMarker);
            }
         }
      }, [map]);
   
      return null;
   }

   useEffect(() => {
      const cached = localStorage.getItem('cached-trackings');
      if(cached) {
         try {
            const parsed: Tracking[] = JSON.parse(cached);
            setTrackings(parsed); 
         } catch{
            console.log('Error parsing cached data');
            localStorage.removeItem('cached-trackings');
         }
      }

      fetchTrackings();

      const channel = supabase
         .channel('trackings')
         .on('postgres_changes',
            {
               event: '*',
               schema: 'public',
               table: 'trackings'
            },
            (payload) => {
               console.log('Changes received!', payload);
               fetchTrackings();
            }
         )
         .subscribe((status) => {
            console.log('Subscription status:', status);
         })

         return () => {
            supabase.removeChannel(channel);
         }
   }, [])

   return (
      <MapContainer
         center={defaultPosition}
         style={{ height: '500px', width: '100%' }}
         zoom={13}
         >
         <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         />
         <MapSetup />
         <MapEvents onMapClick={handleMapClick} />

         {trackings
         .filter(track =>
               typeof track.latitude === 'number' &&
               typeof track.longitude === 'number')
            .map((track) => (
                     <Marker 
                     key={track.id} 
                     position={[track.latitude, track.longitude]}
                     icon={deviceMarkerIcon}
                  >
                     <Popup>
                        <div className="flex flex-col gap-1">
                           <h3 className="text-lg font-semibold">
                              {track.devices.name}
                           </h3>
                           <span>
                              Device Holder: {track.holder_name}
                           </span>
                           <span>
                              Coordinate: {`${track.latitude}, ${track.longitude}`}
                           </span>
                           <span>
                              RSSI: {track.rssi}
                           </span>
                           <span>
                              SNR: {track.snr}
                           </span>
                           <span>
                              Status: {track.is_emergency ? 'Emergency' : 'Normal'}
                           </span>
                        </div>
                     </Popup>
                  </Marker>     
            ))}

         {markerPosition && (
            <Marker
               position={markerPosition}
               icon={selectLocationMarkerIcon}
            >
               <Popup>
                  <div className="flex flex-col gap-2">
                     <h3 className="text-lg font-semibold">Selected Location</h3>
                     <span>Latiude: {selectedLocation[0]}</span>
                     <span>Longitude: {selectedLocation[1]}</span>
                     <span>Coordinate: {`${selectedLocation[0]}, ${selectedLocation[1]}`}</span>
                  </div>
               </Popup>
            </Marker>
         )}

      </MapContainer>
   )
}