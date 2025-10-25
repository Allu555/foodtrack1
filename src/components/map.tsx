
"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '@/lib/restaurants';

// Default icon setup to fix asset loading issue in Next.js
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;  
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});


interface MapProps {
  restaurants: Restaurant[];
  className?: string;
}

export function RestaurantMap({ restaurants, className }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapRef.current || !containerRef.current) return;

        const latitudes = restaurants.map(r => r.location.lat);
        const longitudes = restaurants.map(r => r.location.lng);
        const centerLat = latitudes.length > 0 ? latitudes.reduce((a, b) => a + b, 0) / latitudes.length : 9.967;
        const centerLng = longitudes.length > 0 ? longitudes.reduce((a, b) => a + b, 0) / longitudes.length : 76.242;
        const center: [number, number] = [centerLat, centerLng];

        const map = L.map(containerRef.current).setView(center, 10);
        mapRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        restaurants.forEach(restaurant => {
            const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.location.lat},${restaurant.location.lng}`;
            const popupContent = `
                <div class="font-bold">${restaurant.name}</div>
                <p class="!m-0">${restaurant.cuisine}</p>
                <div class="flex flex-col gap-1 mt-2">
                    <a href="/restaurants/${restaurant.id}" class="text-primary hover:underline" style="font-size: 0.875rem;">View Details</a>
                    <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline" style="font-size: 0.875rem;">View on Google Maps</a>
                </div>
            `;
            L.marker([restaurant.location.lat, restaurant.location.lng])
                .addTo(map)
                .bindPopup(popupContent);
        });

        if (restaurants.length > 0) {
            const bounds = L.latLngBounds(restaurants.map(r => [r.location.lat, r.location.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }


        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [restaurants]);

    return <div ref={containerRef} className={className} />;
}
