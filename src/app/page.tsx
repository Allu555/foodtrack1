import Link from 'next/link';
import { restaurants, type Restaurant } from '@/lib/restaurants';
import { Header } from '@/components/header';
import { RestaurantCard } from '@/components/restaurant-card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 font-headline">
          Discover Your Next Meal
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {restaurants.map((restaurant: Restaurant) => (
            <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`} className="group block">
               <RestaurantCard restaurant={restaurant} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
