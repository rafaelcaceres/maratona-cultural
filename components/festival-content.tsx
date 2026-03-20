"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FilterBar } from "./filter-bar";
import { VenueCard } from "./venue-card";
import { SectionDivider } from "./section-divider";
import { FeirasSection } from "./feiras-section";
import { Skeleton } from "./ui/skeleton";
import { EventCard } from "./event-card";
import { FavoritesSheet } from "./favorites-sheet";
import { FavoritesFab } from "./favorites-fab";
import { useFavorites } from "@/hooks/use-favorites";
import type { Doc } from "@/convex/_generated/dataModel";

type EventType =
  | "show"
  | "exhibition"
  | "screening"
  | "workshop"
  | "performance"
  | "other";

type Section = "principal" | "eventos_parceiros" | "programacao_off";

const SECTION_ORDER: Section[] = [
  "principal",
  "eventos_parceiros",
  "programacao_off",
];

export function FestivalContent() {
  const [activeDate, setActiveDate] = useState("2026-03-20");
  const [activeType, setActiveType] = useState<EventType | null>(null);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedVenues, setCollapsedVenues] = useState<Set<string>>(new Set());
  const [favSheetOpen, setFavSheetOpen] = useState(false);
  const [isChangingDate, setIsChangingDate] = useState(false);

  const { favorites, toggleFavorite, removeFavorite, count: favCount } = useFavorites();
  const favoritedIds = useMemo(() => new Set(favorites.map((f) => f.eventId)), [favorites]);

  // Reset to all open when date changes
  useEffect(() => {
    setCollapsedVenues(new Set());
  }, [activeDate]);

  const handleVenueToggle = useCallback((venueId: string, open: boolean) => {
    setCollapsedVenues((prev) => {
      const next = new Set(prev);
      if (open) next.delete(venueId);
      else next.add(venueId);
      return next;
    });
  }, []);

  // Fetch venues
  const allVenues = useQuery(api.venues.listByDate, {
    date: activeDate,
  });

  // Fetch events for all venues in this date
  const allEvents = useQuery(api.events.listByDate, {
    date: activeDate,
    type: activeType ?? undefined,
  });

  // Clear loading state once data for the new date arrives
  useEffect(() => {
    if (isChangingDate && allVenues !== undefined && allEvents !== undefined) {
      setIsChangingDate(false);
    }
  }, [isChangingDate, allVenues, allEvents]);

  // Fetch feiras
  const feiras = useQuery(api.feiras.listByDate, {
    date: activeDate,
  });

  // Search results (only when query is set) — sem filtro de data para buscar em todos os dias
  const searchResults = useQuery(
    api.events.searchEvents,
    searchQuery.trim().length >= 2
      ? { queryText: searchQuery }
      : "skip"
  );

  // Group search results by date → venue, ordered by date ascending
  const searchByDate = useMemo(() => {
    if (!searchResults) return null;
    const sorted = [...searchResults].sort((a, b) => a.date.localeCompare(b.date));

    const dateMap = new Map<string, Map<string, { venue: Doc<"venues"> | null; events: Doc<"events">[] }>>();
    for (const result of sorted) {
      const venueKey = result.venueId ?? "no-venue";
      if (!dateMap.has(result.date)) dateMap.set(result.date, new Map());
      const venueMap = dateMap.get(result.date)!;
      const existing = venueMap.get(venueKey);
      if (existing) {
        existing.events.push(result);
      } else {
        venueMap.set(venueKey, { venue: result.venue ?? null, events: [result] });
      }
    }

    return Array.from(dateMap.entries()).map(([date, venueMap]) => ({
      date,
      label: new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
        weekday: "long", day: "numeric", month: "long",
      }),
      venues: Array.from(venueMap.values()),
    }));
  }, [searchResults]);

  // Group events by venueId
  const eventsByVenue = useMemo(() => {
    const map = new Map<string, Doc<"events">[]>();
    if (!allEvents) return map;
    for (const event of allEvents) {
      const arr = map.get(event.venueId) ?? [];
      arr.push(event);
      map.set(event.venueId, arr);
    }
    return map;
  }, [allEvents]);

  // Filter and group venues by section
  const venuesBySection = useMemo(() => {
    if (!allVenues) return null;

    let venues = allVenues;

    // Filter by section
    if (activeSection) {
      venues = venues.filter((v) => v.section === activeSection);
    }

    // If type filter active, only show venues that have events of that type
    if (activeType && allEvents) {
      const venueIdsWithType = new Set(allEvents.map((e) => e.venueId));
      venues = venues.filter((v) => venueIdsWithType.has(v._id));
    }

    // Group by section
    const grouped = new Map<Section, typeof venues>();
    for (const section of SECTION_ORDER) {
      const sectionVenues = venues.filter((v) => v.section === section);
      if (sectionVenues.length > 0) {
        grouped.set(section, sectionVenues);
      }
    }
    return grouped;
  }, [allVenues, allEvents, activeSection, activeType]);

  const allCollapsed = !!allVenues?.length && allVenues.every((v) => collapsedVenues.has(v._id));

  const isLoading = allVenues === undefined || allEvents === undefined || isChangingDate;
  const isSearchMode = searchQuery.trim().length >= 2;

  return (
    <div>
      <FilterBar
        activeDate={activeDate}
        onDateChange={(date) => {
          if (date !== activeDate) {
            setIsChangingDate(true);
            setActiveDate(date);
          }
        }}
        activeType={activeType}
        onTypeChange={setActiveType}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="px-4 py-6 md:px-8 lg:px-12 max-w-5xl mx-auto">
        {/* Search mode */}
        {isSearchMode && (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              {searchResults
                ? `${searchResults.length} resultado${searchResults.length !== 1 ? "s" : ""} para "${searchQuery}"`
                : "Buscando..."}
            </p>
            {searchResults === undefined ? (
              <LoadingSkeleton />
            ) : searchResults.length === 0 ? (
              <EmptyState message="Nenhum evento encontrado." />
            ) : (
              <div className="space-y-8">
                {searchByDate!.map(({ date, label, venues }) => (
                  <div key={date}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </p>
                    <div className="space-y-2">
                      {venues.map(({ venue, events }, i) =>
                        venue ? (
                          <VenueCard
                            key={venue._id}
                            venue={venue}
                            events={events}
                            open
                            onOpenChange={() => {}}
                            favoritedIds={favoritedIds}
                            onToggleFavorite={toggleFavorite}
                          />
                        ) : (
                          <div key={`no-venue-${i}`} className="divide-y divide-border border border-border">
                            {events.map((event) => (
                              <EventCard
                                key={event._id}
                                timeStart={event.timeStart}
                                timeEnd={event.timeEnd}
                                title={event.title}
                                description={event.description}
                                curadoria={event.curadoria}
                                origin={event.origin}
                                type={event.type}
                                price={event.price}
                              />
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Normal venue listing */}
        {!isSearchMode && (
          <>
            {isLoading ? (
              <LoadingSkeleton />
            ) : venuesBySection && venuesBySection.size > 0 ? (
              <div className="space-y-8">
                {/* Expand / Collapse all */}
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      allCollapsed
                        ? setCollapsedVenues(new Set())
                        : setCollapsedVenues(new Set(allVenues!.map((v) => v._id)))
                    }
                    className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                  >
                    {allCollapsed ? "Expandir tudo" : "Colapsar tudo"}
                  </button>
                </div>

                {SECTION_ORDER.map((section) => {
                  const venues = venuesBySection.get(section);
                  if (!venues || venues.length === 0) return null;
                  return (
                    <div key={section}>
                      <SectionDivider section={section} count={venues.length} />
                      <div className="mt-3 space-y-2">
                        {venues.map((venue) => (
                          <VenueCard
                            key={venue._id}
                            venue={venue}
                            events={eventsByVenue.get(venue._id) ?? []}
                            open={!collapsedVenues.has(venue._id)}
                            onOpenChange={(o) => handleVenueToggle(venue._id, o)}
                            favoritedIds={favoritedIds}
                            onToggleFavorite={toggleFavorite}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Feiras at the end */}
                {feiras && feiras.length > 0 && !activeType && !activeSection && (
                  <FeirasSection feiras={feiras} />
                )}
              </div>
            ) : (
              <EmptyState message="Nenhum evento encontrado para este filtro." />
            )}
          </>
        )}
      </div>

      <FavoritesFab count={favCount} onClick={() => setFavSheetOpen(true)} />
      <FavoritesSheet
        open={favSheetOpen}
        onOpenChange={setFavSheetOpen}
        favorites={favorites}
        onRemove={removeFavorite}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Section divider skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded-none" />
        <Skeleton className="h-4 w-32 rounded-none" />
        <div className="flex-1 h-px bg-border" />
        <Skeleton className="h-3 w-12 rounded-none" />
      </div>

      {/* Venue cards skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-48 rounded-none" />
                <Skeleton className="h-3 w-64 rounded-none" />
              </div>
              <Skeleton className="h-4 w-4 rounded-none ml-4 shrink-0" />
            </div>
            {/* Expanded events preview for first card */}
            {i === 0 && (
              <div className="border-t border-border divide-y divide-border">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-start gap-3 px-4 py-3">
                    <Skeleton className="h-6 w-12 rounded-none shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-40 rounded-none" />
                      <Skeleton className="h-3 w-56 rounded-none" />
                    </div>
                    <Skeleton className="h-4 w-10 rounded-none shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 text-center text-muted-foreground">
      <p
        className="text-3xl"
        style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.05em" }}
      >
        {message}
      </p>
    </div>
  );
}
