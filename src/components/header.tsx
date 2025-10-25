import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-headline tracking-tighter">
          Gastronome
        </Link>
        <nav>
          <Button asChild variant="ghost" size="icon">
            <Link href="/favorites">
              <Heart />
              <span className="sr-only">Favorites</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
