

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { restaurants, Restaurant } from '@/lib/restaurants';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { FavoriteButton } from '@/components/favorite-button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type RestaurantPageProps = {
  params: {
    id: string;
  };
};

const getRestaurant = (id: string): Restaurant | undefined => {
  return restaurants.find((r) => r.id === id);
};

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = getRestaurant(params.id);

  if (!restaurant) {
    notFound();
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}%2C+${encodeURIComponent(restaurant.address)}`;

  return (
    <div className="bg-background min-h-screen">
      <main className="pb-16">
        <div className="relative h-[60vh] md:h-[75vh] w-full">
          <Image
              src={restaurant.heroImage.imageUrl}
              alt={restaurant.name}
              fill
              className="object-cover"
              priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
             <Button asChild variant="ghost" size="icon" className="text-white hover:bg-black/20 hover:text-white">
                <Link href="/">
                    <ArrowLeft className="h-6 w-6" />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <FavoriteButton restaurantId={restaurant.id} />
          </div>

          <div className="absolute bottom-0 left-0 p-8 text-white z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-headline">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-xl md:text-2xl text-primary-foreground/80">{restaurant.cuisine}</p>
               <Badge 
                className={cn(
                  "text-base",
                  restaurant.category === 'Veg' && 'bg-green-600/90 text-white',
                  restaurant.category === 'Non-Veg' && 'bg-red-600/90 text-white',
                  restaurant.category === 'Mixed' && 'bg-yellow-600/90 text-white'
                )}
              >
                {restaurant.category}
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 mt-12 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold font-headline mb-4">About</h2>
              <p className="text-lg leading-relaxed text-foreground/80">
                {restaurant.description}
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-col gap-2">
                <Button asChild size="lg" className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="mr-2 h-5 w-5" />
                        Get Directions
                    </a>
                </Button>
                 <Button asChild size="lg" variant="outline" className="w-full md:w-auto">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Star className="mr-2 h-5 w-5" />
                        View Reviews on Google
                    </a>
                </Button>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold font-headline mb-6 text-center">Gallery</h2>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {restaurant.gallery.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                    <div className="p-1">
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden shadow-lg">
                           <Image
                            src={image.imageUrl}
                            alt={image.description}
                            data-ai-hint={image.imageHint}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                           />
                        </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-14" />
              <CarouselNext className="mr-14" />
            </Carousel>
          </div>
        </div>
      </main>
    </div>
  );
}

    