"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FilterBar } from "./filter-bar";
import { VenueCard } from "./venue-card";
import { SectionDivider } from "./section-divider";
import { FeirasSection } from "./feiras-section";
import { Skeleton } from "./ui/skeleton";
import { EventCard } from "./event-card";
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

  // Fetch venues
  const allVenues = useQuery(api.venues.listByDate, {
    date: activeDate,
  });

  // Fetch events for all venues in this date
  const allEvents = useQuery(api.events.listByDate, {
    date: activeDate,
    type: activeType ?? undefined,
  });

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

  const isLoading = allVenues === undefined || allEvents === undefined;
  const isSearchMode = searchQuery.trim().length >= 2;

  return (
    <div>
      <FilterBar
        activeDate={activeDate}
        onDateChange={setActiveDate}
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
                          <VenueCard key={venue._id} venue={venue} events={events} defaultOpen />
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
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border border-border p-4 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-72" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
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
