
"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '@/lib/restaurants';

const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
  restaurants: Restaurant[];
  className?: string;
}

export function RestaurantMap({ restaurants, className }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const routingControlRef = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current || !containerRef.current) return;
        
        import('leaflet-routing-machine').then(routing => {
             if (!mapRef.current) {
                const latitudes = restaurants.map(r => r.location.lat);
                const longitudes = restaurants.map(r => r.location.lng);
                const centerLat = latitudes.length > 0 ? latitudes.reduce((a, b) => a + b, 0) / latitudes.length : 9.967;
                const centerLng = longitudes.length > 0 ? longitudes.reduce((a, b) => a + b, 0) / longitudes.length : 76.242;
                const center: [number, number] = [centerLat, centerLng];

                const map = L.map(containerRef.current!, {
                    zoomControl: false
                }).setView(center, 10);
                mapRef.current = map;
                
                L.control.zoom({ position: 'bottomright' }).addTo(map);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                }).addTo(map);

                restaurants.forEach(restaurant => {
                    const popupContent = `
                        <div class="font-bold text-lg mb-1">${restaurant.name}</div>
                        <p class="!m-0 text-sm text-muted-foreground">${restaurant.cuisine}</p>
                        <div class="flex flex-col gap-1 mt-3">
                            <a href="/restaurants/${restaurant.id}" class="text-primary hover:underline" style="font-size: 0.9rem;">View Details</a>
                            <button onclick="window.showDirections(${restaurant.location.lat}, ${restaurant.location.lng})" class="text-primary hover:underline text-left" style="font-size: 0.9rem; background: none; border: none; padding: 0; cursor: pointer;">Get Directions</button>
                        </div>
                    `;
                    L.marker([restaurant.location.lat, restaurant.location.lng], { icon: defaultIcon })
                        .addTo(map)
                        .bindPopup(popupContent);
                });

                if (restaurants.length > 0) {
                    const bounds = L.latLngBounds(restaurants.map(r => [r.location.lat, r.location.lng]));
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
             }
        });
        
        (window as any).showDirections = (lat: number, lng: number) => {
            const map = mapRef.current;
            if (!map || !L.Routing) return;

            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
            
            navigator.geolocation.getCurrentPosition(position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                const control = L.Routing.control({
                    waypoints: [
                        L.latLng(userLat, userLng),
                        L.latLng(lat, lng)
                    ],
                    routeWhileDragging: true,
                    show: true, // Make sure the route is visible
                    lineOptions: {
                        styles: [{ color: '#1d4ed8', opacity: 0.8, weight: 6 }]
                    },
                     createMarker: function(i: number, waypoint: any, n: number) {
                        // Only add marker for the destination
                        if (i === n - 1) {
                            return L.marker(waypoint.latLng, { icon: defaultIcon });
                        }
                        return false;
                    }
                }).addTo(map);
                
                routingControlRef.current = control;

            }, (error) => {
                console.error("Error getting user location", error);
                alert("Could not get your location. Please ensure you have location services enabled.");
            });
        };


        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            delete (window as any).showDirections;
        };
    }, [restaurants]);

    return <div ref={containerRef} className={className} />;
}
