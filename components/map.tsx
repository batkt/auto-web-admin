import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

interface MapClickHandlerProps {
  onMapClick?: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  const map = useMapEvents({
    click: e => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

interface MapComponentProps {
  position: [number, number];
  onMapClick?: (lat: number, lng: number) => void;
  interactive?: boolean;
}

export default function MapComponent({
  position,
  onMapClick,
  interactive = false,
}: MapComponentProps) {
  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={interactive}
      className="w-full h-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>📍 Энэ бол миний байрлал!</Popup>
      </Marker>
      {interactive && onMapClick && <MapClickHandler onMapClick={onMapClick} />}
    </MapContainer>
  );
}
