"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EventCard } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { timeStringToMinutes } from "@/lib/time";

export default function VenuePage({
  params,
}: {
  params: { id: string };
}) {
  const venue = useQuery(api.venues.getVenue, {
    id: params.id as Id<"venues">,
  });

  const events = useQuery(api.events.listByVenue, {
    venueId: params.id as Id<"venues">,
  });

  if (venue === undefined || events === undefined) {
    return (
      <div className="min-h-screen p-6 max-w-3xl mx-auto">
        <Skeleton className="mb-6 h-8 w-32" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-2 h-4 w-48" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (venue === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Local não encontrado.</p>
      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) =>
      timeStringToMinutes(a.timeStart) - timeStringToMinutes(b.timeStart)
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-festival-black text-festival-cream px-6 py-10 md:px-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-festival-earth hover:text-festival-cream transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Programação
        </Link>

        <h1
          className="leading-none text-festival-cream"
          style={{
            fontFamily: "var(--font-bebas-neue)",
            fontSize: "clamp(2rem, 6vw, 4rem)",
            letterSpacing: "0.03em",
          }}
        >
          {venue.name}
        </h1>

        <div className="mt-3 flex items-start gap-2 text-sm text-festival-earth">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(venue.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {venue.address}
          </a>
        </div>

        <div className="mt-4 flex gap-2 text-xs uppercase tracking-wider">
          <span className="rounded-sm border border-festival-earth/40 px-2 py-1 text-festival-earth">
            {venue.classification === "livre" ? "Livre" : `+${venue.classification.replace(" anos", "")} anos`}
          </span>
          <span className="rounded-sm border border-festival-earth/40 px-2 py-1 text-festival-earth">
            {venue.section === "principal"
              ? "Programação Principal"
              : venue.section === "eventos_parceiros"
              ? "Evento Parceiro"
              : "Programação Off"}
          </span>
        </div>
      </div>

      {/* Color stripe */}
      <div className="flex h-1">
        <div className="flex-1 bg-festival-terracotta" />
        <div className="flex-1 bg-festival-gold" />
        <div className="flex-1 bg-festival-teal" />
      </div>

      {/* Events */}
      <div className="px-6 py-8 md:px-12 max-w-3xl">
        <h2
          className="mb-4 text-xl uppercase text-foreground"
          style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.05em" }}
        >
          Programação ({sortedEvents.length} evento{sortedEvents.length !== 1 ? "s" : ""})
        </h2>

        {sortedEvents.length === 0 ? (
          <p className="text-muted-foreground">Nenhum evento cadastrado.</p>
        ) : (
          <div className="divide-y divide-border border border-border">
            {sortedEvents.map((event) => (
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
        )}
      </div>
    </div>
  );
}
