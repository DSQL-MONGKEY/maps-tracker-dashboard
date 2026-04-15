'use client';

import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider, SearchControl } from 'leaflet-geosearch';
import Link from 'next/link';
import DistanceLine from './distance-line';
import { useTrackingStore } from '@/stores/trackings';
import { useMapSelectionStore } from '@/stores/map-selection-state';
import { Tracking } from '@/types';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

const defaultPosition: [number, number] = [-6.393875, 106.822557]; // Depok

const deviceMarkerIcon = new L.Icon({
  iconUrl: '/icons/map-marker.png',
  iconSize: [35, 51],
  iconAnchor: [12, 41],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  popupAnchor: [1, -35],
  shadowSize: [41, 41]
});

const baseMarkerIcon = new L.Icon({
  iconUrl: '/icons/map-marker-base.png',
  iconSize: [35, 51],
  iconAnchor: [12, 41],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  popupAnchor: [1, -35],
  shadowSize: [41, 41]
});

const selectLocationMarkerIcon = new L.Icon({
  iconUrl: '/icons/map-marker-select.png',
  iconSize: [35, 51],
  iconAnchor: [12, 41],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//@ts-ignore
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(event) {
      const { latlng } = event;
      onMapClick(latlng);
    }
  });

  return null;
};

//@ts-ignore
export default function Map() {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([
    0, 0
  ]);
  // const [filteredTrackings, setFilteredTrackings] = useState<Tracking[]>([])
  const { filteredTrackings, setFilteredTrackings } = useTrackingStore();
  const { data: response } = useSWR('/api/trackings', fetcher, {
    revalidateOnFocus: true
  });

  const { latestMode, fromId, toId } = useMapSelectionStore();

  const handleMapClick = (latlng: any) => {
    const { lat, lng } = latlng;
    setMarkerPosition(latlng);
    setSelectedLocation([lat, lng]);
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
        autoCompleteDelay: 250
      });

      map.addControl(searchControl);

      map.on('geosearch:result', (e) => {
        if (previousMarker) {
          map.removeLayer(previousMarker);
        }
        //@ts-ignore
        const { lat, lng } = e.result.latlng;
        const marker = L.marker([lat, lng], {
          icon: deviceMarkerIcon
        });
        map.addLayer(marker);
        previousMarker = marker;
      });

      return () => {
        map.removeControl(searchControl);
        if (previousMarker) {
          map.removeLayer(previousMarker);
        }
      };
    }, [map]);

    return null;
  }

  useEffect(() => {
    if (!response?.data) return;

    const accumulator: Record<string, any> = {};

    response.data.forEach((current: any) => {
      // Ingat: Gunakan camelCase sesuai Prisma (deviceId, createdAt)
      const existing = accumulator[current.deviceId];

      if (
        !existing ||
        new Date(current.createdAt) > new Date(existing.createdAt)
      ) {
        accumulator[current.deviceId] = current;
      }
    });

    const latestData: Tracking[] = Object.values(accumulator);

    setFilteredTrackings(latestData);
  }, [response?.data, setFilteredTrackings]);

  return (
    <MapContainer
      center={defaultPosition}
      style={{ height: '500px', width: '100%' }}
      zoom={13}
      className='rounded-lg'
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapSetup />
      <MapEvents onMapClick={handleMapClick} />

      {(!latestMode ? filteredTrackings : (response?.data as Tracking[])).map(
        (track) => (
          <Marker
            key={track.id}
            position={[track.latitude, track.longitude]}
            icon={
              track.device.type === 'base_station'
                ? baseMarkerIcon
                : deviceMarkerIcon
            }
          >
            <Popup>
              <div className='flex flex-col gap-1'>
                <h3 className='text-lg font-semibold'>{track.device.name}</h3>
                <span>Device Holder: {track.climberUser?.name}</span>
                <span className='flex gap-1'>
                  Coordinate:
                  <Link
                    target='_blank'
                    href={`https://www.google.com/maps/search/${track.latitude},${track.longitude}`}
                  >
                    {`${track.latitude}, ${track.longitude}`}
                  </Link>
                </span>
                <span>RSSI: {track.rssi}</span>
                <span>SNR: {track.snr}</span>
                <span>
                  Status: {track.isEmergency ? 'Emergency' : 'Normal'}
                </span>
              </div>
            </Popup>
          </Marker>
        )
      )}

      <DistanceLine fromId={fromId!} toId={toId!} devices={[]} />

      {markerPosition && (
        <Marker position={markerPosition} icon={selectLocationMarkerIcon}>
          <Popup>
            <div className='flex flex-col gap-2'>
              <h3 className='text-lg font-semibold'>Selected Location</h3>
              <span>Latiude: {selectedLocation[0]}</span>
              <span>Longitude: {selectedLocation[1]}</span>
              <span>
                Coordinate: {`${selectedLocation[0]}, ${selectedLocation[1]}`}
              </span>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
