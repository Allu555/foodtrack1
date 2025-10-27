




import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { restaurants, Restaurant } from '@/lib/restaurants';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Phone, Star, ShoppingCart, Instagram, Facebook } from 'lucide-react';
import { FavoriteButton } from '@/components/favorite-button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { AnalyzeImageDialog } from '@/components/analyze-image-dialog';

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
                  restaurant.category === 'Veg' && 'bg-green-700 text-green-50 border-green-600',
                  restaurant.category === 'Non-Veg' && 'bg-red-700 text-red-50 border-red-600',
                  restaurant.category === 'Mixed' && 'bg-yellow-700 text-yellow-50 border-yellow-600'
                )}
              >
                {restaurant.category}
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 mt-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold font-headline mb-4">About</h2>
              <p className="text-lg leading-relaxed text-foreground/80 mb-8">
                {restaurant.description}
              </p>
              
               <div className="mt-12">
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
                        <div className="p-1 group relative">
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
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <AnalyzeImageDialog imageUrl={image.imageUrl} />
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

            <div className="md:col-span-1">
               <h2 className="text-3xl font-bold font-headline mb-4">Details</h2>
               <div className="flex flex-col gap-4 rounded-lg border p-4 bg-card/50">
                  <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 mt-1 text-primary"/>
                      <div>
                          <p className="font-semibold text-lg">Address</p>
                          <p className="text-foreground/80">{restaurant.address}</p>
                      </div>
                  </div>
                  <Separator />
                   <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 mt-1 text-primary"/>
                      <div>
                          <p className="font-semibold text-lg">Phone</p>
                          <a href={`tel:${restaurant.phone}`} className="text-foreground/80 hover:underline">{restaurant.phone}</a>
                      </div>
                  </div>
                  <Separator />
                   <div className="flex items-start gap-4">
                      <Star className="h-6 w-6 mt-1 text-primary"/>
                      <div>
                          <p className="font-semibold text-lg">Reviews</p>
                          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:underline">View on Google Maps</a>
                      </div>
                  </div>
               </div>
                <div className="mt-6 flex flex-col gap-2">
                    <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <MapPin className="mr-2 h-5 w-5" />
                            Get Directions
                        </a>
                    </Button>
                    {restaurant.orderOnlineUrl && (
                        <Button asChild size="lg" className="w-full">
                            <a href={restaurant.orderOnlineUrl} target="_blank" rel="noopener noreferrer">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Order Online
                            </a>
                        </Button>
                    )}
                </div>

                {(restaurant.instagramUrl || restaurant.facebookUrl) && (
                  <div className="mt-8">
                     <h3 className="text-2xl font-bold font-headline mb-4 text-center">Follow Us</h3>
                     <div className="flex justify-center gap-4">
                        {restaurant.instagramUrl && (
                          <Button asChild variant="ghost" size="icon">
                            <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer">
                              <Instagram className="h-7 w-7 text-primary" />
                              <span className="sr-only">Instagram</span>
                            </a>
                          </Button>
                        )}
                        {restaurant.facebookUrl && (
                           <Button asChild variant="ghost" size="icon">
                            <a href={restaurant.facebookUrl} target="_blank" rel="noopener noreferrer">
                              <Facebook className="h-7 w-7 text-primary" />
                              <span className="sr-only">Facebook</span>
                            </a>
                          </Button>
                        )}
                     </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
