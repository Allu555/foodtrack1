"use client";

import dynamic from 'next/dynamic';
import { Restaurant } from '@/lib/restaurants';

const DynamicMap = dynamic(() => import('@/components/map').then(mod => mod.RestaurantMap), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-muted/50 rounded-lg animate-pulse" />
});

interface MapSectionProps {
  restaurants: Restaurant[];
}

export function MapSection({ restaurants }: MapSectionProps) {
  return <DynamicMap restaurants={restaurants} className="h-[400px] w-full rounded-lg shadow-lg" />;
}
