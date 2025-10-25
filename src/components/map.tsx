
"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '@/lib/restaurants';

// Orange marker icon
const orangeIcon = L.divIcon({
    html: `
        <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style="color: #F59E0B;"
        >
            <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5-1.12 2.5-2.5 2.5z"
                fill="currentColor"
            />
             <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5-1.12 2.5-2.5 2.5z"
                fill="black"
                opacity="0.15"
            />
        </svg>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
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
        const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
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
            L.marker([restaurant.location.lat, restaurant.location.lng], { icon: orangeIcon })
                .addTo(map)
                .bindPopup(popupContent);
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [restaurants]);

    return <div ref={containerRef} className={className} />;
}
