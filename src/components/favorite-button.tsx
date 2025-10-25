"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  restaurantId: string;
  className?: string;
};

export function FavoriteButton({ restaurantId, className }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite, isLoaded } = useFavorites();
  const { toast } = useToast();

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="icon" disabled className={className}>
        <Heart className="h-6 w-6" />
      </Button>
    );
  }

  const isFavorited = isFavorite(restaurantId);

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorited) {
      removeFavorite(restaurantId);
      toast({
        title: "Removed from favorites.",
      });
    } else {
      addFavorite(restaurantId);
      toast({
        title: "Added to favorites!",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      className={cn("text-white hover:text-red-500 hover:bg-black/20", className)}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={cn(
          "h-6 w-6 transition-colors",
          isFavorited ? "fill-red-500 text-red-500" : "text-white"
        )}
      />
    </Button>
  );
}
