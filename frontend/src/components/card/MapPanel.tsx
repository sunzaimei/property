'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Coordinates } from '@/types';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon broken in Next.js (webpack asset handling)
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface Props {
  coordinates: Coordinates;
  address: string;
}

export default function MapPanel({ coordinates, address }: Props) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={16}
        style={{ height: '350px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
