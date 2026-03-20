"use client";

import { Heart, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EventCard } from "./event-card";
import type { FavoriteItem } from "@/hooks/use-favorites";

interface FavoritesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favorites: FavoriteItem[];
  onRemove: (eventId: string) => void;
}

const DATE_LABELS: Record<string, string> = {
  "2026-03-20": "Sexta, 20 de Março",
  "2026-03-21": "Sábado, 21 de Março",
  "2026-03-22": "Domingo, 22 de Março",
  "2026-03-23": "Segunda, 23 de Março",
};

export function FavoritesSheet({
  open,
  onOpenChange,
  favorites,
  onRemove,
}: FavoritesSheetProps) {
  // Group by date
  const byDate = favorites.reduce<Record<string, FavoriteItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md overflow-y-auto p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle
            className="flex items-center gap-2 text-2xl uppercase leading-none text-festival-black"
            style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.05em" }}
          >
            <Heart className="h-5 w-5 fill-festival-red text-festival-red" />
            Minha Programação
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            {favorites.length === 0
              ? "Nenhum evento salvo"
              : `${favorites.length} evento${favorites.length !== 1 ? "s" : ""} salvo${favorites.length !== 1 ? "s" : ""}`}
          </p>
        </SheetHeader>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 px-8 text-center text-muted-foreground">
            <Heart className="h-12 w-12 opacity-20" />
            <p
              className="text-2xl uppercase leading-tight"
              style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.05em" }}
            >
              Nenhum evento salvo ainda
            </p>
            <p className="text-sm">
              Toque no coração em qualquer evento para adicioná-lo aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-4">
            {dates.map((date) => (
              <div key={date} className="flex flex-col gap-2">
                <p
                  className="px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  {DATE_LABELS[date] ?? date}
                </p>
                <div className="flex flex-col gap-2">
                  {byDate[date].map((item) => (
                    <div
                      key={item.eventId}
                      className="relative group  border border-border bg-card shadow-sm overflow-hidden"
                    >
                      <EventCard
                        title={item.title}
                        type={item.type}
                        timeStart={item.timeStart}
                        timeEnd={item.timeEnd}
                        price={item.price}
                        venue={item.venueName ? { name: item.venueName, address: item.venueAddress } : null}
                      />
                      {/* Remove button */}
                      <button
                        onClick={() => onRemove(item.eventId)}
                        aria-label="Remover dos favoritos"
                        className="absolute right-2 top-2 rounded-sm p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-festival-red hover:bg-muted/50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
