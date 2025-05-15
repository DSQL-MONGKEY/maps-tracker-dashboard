'use client';

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import { OpenStreetMapProvider, SearchControl } from "leaflet-geosearch";
import { useMapSelectionStore } from "@/stores/map-selection-state";


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

const defaultPosition: [number, number] = [-6.393875, 106.822557]; // Depok

export default function TrackingsFormMaps(props: any) {
   const [selectedLocation, setSelectedLocation] = useState<[number, number]>([0, 0])
   const [markerPosition, setMarkerPosition] = useState(null);
   const { setLatitude, setLongitude } = useMapSelectionStore();

   const handleMapClick = (latlng: any) => {
      const { lat, lng } = latlng;
      setMarkerPosition(latlng)
      setSelectedLocation([lat, lng]);
      setLatitude(selectedLocation[0]);
      setLongitude(selectedLocation[1]);
   };

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
                  icon: selectLocationMarkerIcon,
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
      console.log(selectedLocation);

   return (
      <MapContainer
               center={defaultPosition}
               zoom={13}
               {...props}
               >
               <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               />
               <MapSetup />
               <MapEvents onMapClick={handleMapClick} />
      
               {markerPosition && (
                  <Marker
                     position={markerPosition}
                     icon={selectLocationMarkerIcon}
                  >
                     <Popup
                        minWidth={100}
                     >
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
   );
}