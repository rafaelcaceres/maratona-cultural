"use client";

import { useState, useEffect, useCallback } from "react";

export type FavoriteEventType =
  | "show"
  | "exhibition"
  | "screening"
  | "workshop"
  | "performance"
  | "other";

export interface FavoriteItem {
  eventId: string;
  title: string;
  type: FavoriteEventType;
  date: string; // "2026-03-20"
  timeStart?: string;
  timeEnd?: string;
  price?: string;
  venueName: string;
  venueAddress: string;
}

const STORAGE_KEY = "maratona-favorites";

function sortFavorites(items: FavoriteItem[]): FavoriteItem[] {
  return [...items].sort((a, b) => {
    const dateDiff = a.date.localeCompare(b.date);
    if (dateDiff !== 0) return dateDiff;
    const aTime = a.timeStart ?? "99:99";
    const bTime = b.timeStart ?? "99:99";
    return aTime.localeCompare(bTime);
  });
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(sortFavorites(JSON.parse(raw)));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const persist = useCallback((items: FavoriteItem[]) => {
    const sorted = sortFavorites(items);
    setFavorites(sorted);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    } catch {
      // ignore storage errors
    }
  }, []);

  const isFavorite = useCallback(
    (eventId: string) => favorites.some((f) => f.eventId === eventId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.eventId === item.eventId);
        const next = exists
          ? prev.filter((f) => f.eventId !== item.eventId)
          : [...prev, item];
        const sorted = sortFavorites(next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        } catch {
          // ignore
        }
        return sorted;
      });
    },
    []
  );

  const removeFavorite = useCallback(
    (eventId: string) => {
      setFavorites((prev) => {
        const next = prev.filter((f) => f.eventId !== eventId);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    count: favorites.length,
  };
}
