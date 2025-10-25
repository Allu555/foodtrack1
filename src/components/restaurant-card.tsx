import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { type Restaurant } from '@/lib/restaurants';
import { FavoriteButton } from './favorite-button';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  return (
    <Card className={cn("overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border-0 shadow-md", className)}>
      <CardContent className="p-0 relative">
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
        </div>
        <FavoriteButton restaurantId={restaurant.id} className="absolute top-2 right-2" />
      </CardContent>
      <CardFooter className="p-4 flex-col items-start mt-auto">
        <h3 className="font-bold text-lg font-headline">{restaurant.name}</h3>
        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
      </CardFooter>
    </Card>
  );
}
