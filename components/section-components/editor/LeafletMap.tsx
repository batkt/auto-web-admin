"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LeafletMapProps {
    initialLat: number;
    initialLng: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function LeafletMap({ initialLat, initialLng, onLocationSelect }: LeafletMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map with scroll wheel zoom enabled
        const map = L.map(mapRef.current, {
            scrollWheelZoom: true, // Enable mouse scroll zoom
            doubleClickZoom: true, // Enable double-click zoom
            zoomControl: true, // Show zoom controls
            dragging: true, // Enable map dragging
        }).setView([initialLat, initialLng], 13);

        mapInstanceRef.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add initial marker with click handler
        const marker = L.marker([initialLat, initialLng], {
            draggable: true, // Make marker draggable
        }).addTo(map);

        markerRef.current = marker;

        // Handle marker drag events
        marker.on('dragend', (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            console.log("Marker dragged to:", position.lat, position.lng);

            // Call the callback
            onLocationSelect(position.lat, position.lng);
        });

        // Handle map clicks (but not on marker)
        map.on("click", (e) => {
            const { lat, lng } = e.latlng;

            console.log("Map clicked at:", lat, lng);

            // Update marker position
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            }

            // Call the callback
            onLocationSelect(lat, lng);
        });

        // Handle marker clicks
        marker.on('click', (e) => {
            const position = e.target.getLatLng();
            console.log("Marker clicked at:", position.lat, position.lng);

            // Show popup with current coordinates
            const popup = L.popup()
                .setLatLng(position)
                .setContent(`
          <div class="text-center">
            <strong>Current Location</strong><br>
            Lat: ${position.lat.toFixed(6)}<br>
            Lng: ${position.lng.toFixed(6)}<br>
            <small>Click elsewhere on map to move marker</small>
          </div>
        `)
                .openOn(map);

            // Close popup after 3 seconds
            setTimeout(() => {
                map.closePopup(popup);
            }, 3000);
        });

        // Add initial instruction popup
        //     const instructionPopup = L.popup()
        //         .setLatLng([initialLat, initialLng])
        //         .setContent(`
        //     <div class="text-center">
        //       <strong>Location Selector</strong><br>
        //       • Click anywhere on the map to place marker<br>
        //       • Drag the marker to move it<br>
        //       • Use mouse scroll to zoom<br>
        //       • Click the marker to see coordinates
        //     </div>
        //   `)
        //         .openOn(map);

        // Remove instruction popup after 5 seconds
        // setTimeout(() => {
        //     map.closePopup(instructionPopup);
        // }, 5000);

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

    return <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1000 }} />;
} 