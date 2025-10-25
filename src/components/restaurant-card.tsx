
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { type Restaurant } from '@/lib/restaurants';
import { FavoriteButton } from './favorite-button';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}%2C+${encodeURIComponent(restaurant.address)}`;

  return (
    <Card className={cn("overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border-0 shadow-md", className)}>
      <CardContent className="p-0 relative">
        <Link href={`/restaurants/${restaurant.id}`} className="group/image block">
          <div className="aspect-[4/3] relative w-full">
            <Image
              src={restaurant.heroImage.imageUrl}
              alt={restaurant.heroImage.description}
              data-ai-hint={restaurant.heroImage.imageHint}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             <Badge 
              className={cn(
                "absolute bottom-2 left-2",
                restaurant.category === 'Veg' && 'bg-green-600/90 text-white',
                restaurant.category === 'Non-Veg' && 'bg-red-600/90 text-white',
                restaurant.category === 'Mixed' && 'bg-yellow-600/90 text-white'
              )}
            >
              {restaurant.category}
            </Badge>
          </div>
        </Link>
        <FavoriteButton restaurantId={restaurant.id} className="absolute top-2 right-2" />
      </CardContent>
      <CardFooter className="p-4 flex-col items-start mt-auto">
        <Link href={`/restaurants/${restaurant.id}`} className="block w-full">
          <h3 className="font-bold text-lg font-headline hover:underline">{restaurant.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
        <Button asChild size="sm" variant="outline" className="mt-4 w-full">
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            <MapPin className="mr-2" />
            View on Map
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

    