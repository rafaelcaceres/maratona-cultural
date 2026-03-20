"use client";

import { Heart } from "lucide-react";

interface FavoritesFabProps {
  count: number;
  onClick: () => void;
}

export function FavoritesFab({ count, onClick }: FavoritesFabProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Minha programação${count > 0 ? ` (${count})` : ""}`}
      className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-festival-black text-festival-cream shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      <Heart
        className="h-6 w-6"
        fill={count > 0 ? "currentColor" : "none"}
        strokeWidth={count > 0 ? 0 : 2}
      />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-festival-red text-[10px] font-bold text-festival-cream">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
