import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  heroImage: ImagePlaceholder;
  gallery: ImagePlaceholder[];
}

const findImage = (id: string): ImagePlaceholder => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (!image) {
        // Fallback for missing images to prevent crashes
        console.error(`Image with id ${id} not found`);
        return {
          id: 'fallback',
          description: 'Image not found',
          imageUrl: 'https://placehold.co/800x600?text=Image+Not+Found',
          imageHint: 'placeholder'
        };
    }
    return image;
}

const allRestaurants: Restaurant[] = [
  {
    id: 'verde-bistro',
    name: 'Verde Bistro',
    cuisine: 'Californian',
    description: 'A bright, airy bistro focusing on fresh, locally-sourced ingredients. Perfect for brunch, lunch, and light dinners.',
    address: '123 Meadow Lane, Sunnyville, CA 94087',
    location: { lat: 37.403, lng: -122.083 },
    heroImage: findImage('verde-hero'),
    gallery: [
      findImage('verde-gallery-1'),
      findImage('verde-gallery-2'),
    ],
  },
  {
    id: 'ember-and-ash',
    name: 'Ember & Ash',
    cuisine: 'Steakhouse',
    description: 'A modern steakhouse with a rustic feel, known for its wood-fired grill and premium cuts of meat.',
    address: '456 Oak Street, Redwood City, CA 94063',
    location: { lat: 37.485, lng: -122.232 },
    heroImage: findImage('ember-hero'),
    gallery: [
      findImage('ember-gallery-1'),
      findImage('ember-gallery-2'),
    ],
  },
  {
    id: 'azure-seafood',
    name: 'Azure Seafood',
    cuisine: 'Seafood',
    description: 'An upscale seafood restaurant offering stunning waterfront views and the freshest catches of the day.',
    address: '789 Bayside Blvd, Marina Del Rey, CA 90292',
    location: { lat: 33.980, lng: -118.451 },
    heroImage: findImage('azure-hero'),
    gallery: [
      findImage('azure-gallery-1'),
      findImage('azure-gallery-2'),
    ],
  },
  {
    id: 'terra-cotta',
    name: 'Terra Cotta',
    cuisine: 'Italian',
    description: 'A cozy, traditional Italian trattoria serving handmade pasta and classic dishes in a warm, inviting atmosphere.',
    address: '101 Vineyard Ave, Napa, CA 94559',
    location: { lat: 38.297, lng: -122.285 },
    heroImage: findImage('terra-hero'),
    gallery: [
      findImage('terra-gallery-1'),
      findImage('terra-gallery-2'),
    ],
  },
  {
    id: 'kayaloram-grand',
    name: 'Kayaloram Grand',
    cuisine: 'Kerala Seafood',
    description: 'A beautiful restaurant on the backwaters serving authentic Kerala seafood delicacies.',
    address: 'Fort Kochi, Kochi, Kerala 682001, India',
    location: { lat: 9.965, lng: 76.243 },
    heroImage: findImage('kayaloram-hero'),
    gallery: [
      findImage('kayaloram-gallery-1'),
      findImage('kayaloram-gallery-2'),
    ],
  },
  {
    id: 'malabar-kitchen',
    name: 'Malabar Kitchen',
    cuisine: 'South Indian',
    description: 'Experience the rich and diverse flavors of Malabar cuisine, from delicious biryanis to traditional thalis.',
    address: 'Panampilly Nagar, Kochi, Kerala 682036, India',
    location: { lat: 9.96, lng: 76.29 },
    heroImage: findImage('malabar-hero'),
    gallery: [
      findImage('malabar-gallery-1'),
      findImage('malabar-gallery-2'),
    ],
  },
];

export const restaurants: Restaurant[] = allRestaurants.filter(r => r.address.includes('Kochi'));