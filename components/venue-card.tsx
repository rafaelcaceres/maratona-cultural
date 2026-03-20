"use client";

import { MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EventCard } from "./event-card";
import { cn } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";
import type { FavoriteItem } from "@/hooks/use-favorites";

type Classification =
  | "livre"
  | "12 anos"
  | "14 anos"
  | "16 anos"
  | "18 anos";

type Section =
  | "principal"
  | "eventos_parceiros"
  | "programacao_off";

type EventDoc = Doc<"events">;

interface VenueCardProps {
  venue: Doc<"venues">;
  events: EventDoc[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favoritedIds?: Set<string>;
  onToggleFavorite?: (item: FavoriteItem) => void;
}

const SECTION_LABELS: Record<Section, string> = {
  principal: "Principal",
  eventos_parceiros: "Parceiro",
  programacao_off: "Prog. Off",
};

const SECTION_STYLES: Record<Section, string> = {
  principal: "border-festival-red text-festival-red",
  eventos_parceiros: "border-festival-gold text-festival-earth",
  programacao_off: "border-festival-stone text-festival-stone",
};

const SECTION_TOP_BORDER: Record<Section, string> = {
  principal: "border-t-2 border-t-festival-red",
  eventos_parceiros: "border-t-2 border-t-festival-gold",
  programacao_off: "border-t-2 border-t-festival-stone",
};

const VENUE_NAME_COLOR: Record<Section, string> = {
  principal: "text-festival-red",
  eventos_parceiros: "text-foreground",
  programacao_off: "text-foreground",
};

const CLASSIFICATION_STYLES: Record<Classification, string> = {
  livre: "border-festival-teal/50 text-festival-teal",
  "12 anos": "border-festival-gold/50 text-festival-earth",
  "14 anos": "border-festival-gold/50 text-festival-earth",
  "16 anos": "border-festival-terracotta/50 text-festival-terracotta",
  "18 anos": "border-festival-purple/50 text-festival-purple",
};

export function VenueCard({ venue, events, open, onOpenChange, favoritedIds, onToggleFavorite }: VenueCardProps) {
  const section = venue.section as Section;
  const classification = venue.classification as Classification;

  return (
    <div className={cn("border border-border bg-card", SECTION_TOP_BORDER[section])}>
      <Accordion
        type="single"
        collapsible
        value={open ? "venue" : ""}
        onValueChange={(v) => onOpenChange(v === "venue")}
      >
        <AccordionItem value="venue" className="border-0">
          <AccordionTrigger className="w-full px-4 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
            <div className="min-w-0 flex-1 text-left">
              <h3
                className={cn("text-lg leading-tight uppercase", VENUE_NAME_COLOR[section])}
                style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.05em" }}
              >
                {venue.name}
              </h3>

              <div className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(venue.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {venue.address}
                </a>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider",
                    SECTION_STYLES[section]
                  )}
                >
                  {SECTION_LABELS[section]}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider",
                    CLASSIFICATION_STYLES[classification]
                  )}
                >
                  {classification === "livre" ? "Livre" : `+${classification.replace(" anos", "")}`}
                </span>
                <span className="inline-flex items-center rounded-sm border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  {events.length} {events.length === 1 ? "evento" : "eventos"}
                </span>
              </div>
            </div>
          </AccordionTrigger>

          {events.length > 0 && (
            <AccordionContent className="pb-0">
              <div className="border-t border-border divide-y divide-border/50">
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
                    eventId={event._id}
                    isFavorite={favoritedIds?.has(event._id)}
                    onToggleFavorite={
                      onToggleFavorite
                        ? (eventId) =>
                            onToggleFavorite({
                              eventId,
                              title: event.title,
                              type: event.type,
                              date: event.date,
                              timeStart: event.timeStart,
                              timeEnd: event.timeEnd,
                              price: event.price,
                              venueName: venue.name,
                              venueAddress: venue.address,
                            })
                        : undefined
                    }
                  />
                ))}
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
