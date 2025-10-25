"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '@/lib/restaurants';
import Link from 'next/link';

// Fix for default icon not showing in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapProps {
  restaurants: Restaurant[];
  className?: string;
}

export function RestaurantMap({ restaurants, className }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapRef.current || !containerRef.current) return; // Initialize map only once

        const latitudes = restaurants.map(r => r.location.lat);
        const longitudes = restaurants.map(r => r.location.lng);
        const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
        const center: [number, number] = [centerLat, centerLng];

        const map = L.map(containerRef.current).setView(center, 10);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

        // Cleanup function to run when component unmounts
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [restaurants]); // Only re-run if restaurants change, but guard ensures it only runs once

    return <div ref={containerRef} className={className} />;
}
