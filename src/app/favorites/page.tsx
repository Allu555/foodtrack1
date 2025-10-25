"use client";

import Link from 'next/link';
import { useFavorites } from '@/hooks/use-favorites';
import { restaurants } from '@/lib/restaurants';
import { RestaurantCard } from '@/components/restaurant-card';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 font-headline">
          Your Favorites
        </h1>
        
        {!isLoaded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted/50 rounded-lg aspect-[4/3] animate-pulse" />
            ))}
          </div>
        )}

        {isLoaded && favoriteRestaurants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {favoriteRestaurants.map(restaurant => (
              <div key={restaurant.id} className="group">
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        )}

        {isLoaded && favoriteRestaurants.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Nothing to see here... yet.</h2>
            <p className="text-muted-foreground mb-6">Start exploring to find and save your favorite spots.</p>
            <Button asChild>
              <Link href="/">Browse Restaurants</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
