"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Restaurant } from '@/lib/restaurants';
import Link from 'next/link';

// Fix for default icon not showing in React-Leaflet
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
    if (!restaurants || restaurants.length === 0) {
        return <div className={className}>No restaurants to display on map.</div>;
    }

    const latitudes = restaurants.map(r => r.location.lat);
    const longitudes = restaurants.map(r => r.location.lng);
    const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
    const center: [number, number] = [centerLat, centerLng];

    return (
        <MapContainer center={center} zoom={10} scrollWheelZoom={false} className={className}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {restaurants.map(restaurant => (
                <Marker key={restaurant.id} position={[restaurant.location.lat, restaurant.location.lng]}>
                    <Popup>
                        <div className="font-bold">{restaurant.name}</div>
                        <p>{restaurant.cuisine}</p>
                        <Link href={`/restaurants/${restaurant.id}`} className="text-primary hover:underline">
                        View Details
                        </Link>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
