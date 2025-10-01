'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  initialLat: number;
  initialLng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapComponent({
  initialLat,
  initialLng,
  onLocationSelect,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([initialLat, initialLng], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add initial marker
    const marker = L.marker([initialLat, initialLng]).addTo(map);
    markerRef.current = marker;

    // Handle map clicks
    map.on('click', e => {
      const { lat, lng } = e.latlng;

      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }

      // Call the callback
      onLocationSelect(lat, lng);
    });

    // Add click instruction popup
    const instructionPopup = L.popup()
      .setLatLng([initialLat, initialLng])
      .setContent('Click anywhere on the map to select a new location')
      .openOn(map);

    // Remove instruction popup after 3 seconds
    setTimeout(() => {
      map.closePopup(instructionPopup);
    }, 3000);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialLat, initialLng, onLocationSelect]);

  // Update marker when initial coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([initialLat, initialLng]);
      markerRef.current.setLatLng([initialLat, initialLng]);
    }
  }, [initialLat, initialLng]);

  return <div ref={mapRef} className="w-full h-full relative -z-100" />;
}
