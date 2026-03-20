import { Heart } from "lucide-react";
import { formatTimeRange } from "@/lib/time";
import { EventTypeBadge } from "./event-type-badge";
import { cn } from "@/lib/utils";

type EventType =
  | "show"
  | "exhibition"
  | "screening"
  | "workshop"
  | "performance"
  | "other";

interface EventCardProps {
  timeStart?: string | null;
  timeEnd?: string | null;
  title: string;
  description?: string | null;
  curadoria?: string | null;
  origin?: string | null;
  type: EventType;
  price?: string | null;
  className?: string;
  eventId?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (eventId: string) => void;
}

const TYPE_BORDER: Record<EventType, string> = {
  show: "border-l-festival-terracotta",
  exhibition: "border-l-festival-teal",
  screening: "border-l-festival-purple",
  workshop: "border-l-festival-gold",
  performance: "border-l-festival-blue",
  other: "border-l-festival-stone",
};

export function EventCard({
  timeStart,
  timeEnd,
  title,
  description,
  curadoria,
  origin,
  type,
  price,
  className,
  eventId,
  isFavorite = false,
  onToggleFavorite,
}: EventCardProps) {
  const timeLabel = formatTimeRange(timeStart, timeEnd);

  return (
    <div
      className={cn(
        "flex gap-3 border-l-4 py-3 pl-4 pr-3",
        TYPE_BORDER[type],
        className
      )}
    >
      {/* Time pill */}
      {timeLabel && (
        <div className="shrink-0">
          <span
            className="inline-block rounded-sm bg-festival-black px-2 py-0.5 text-xs font-semibold text-festival-cream"
            style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.85rem", letterSpacing: "0.03em" }}
          >
            {timeLabel}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start gap-2">
          <EventTypeBadge type={type} />
          <p className="font-semibold text-foreground leading-tight">{title}</p>
        </div>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {curadoria && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Curadoria: {curadoria}
          </p>
        )}
        {origin && (
          <p className="mt-0.5 text-xs italic text-muted-foreground">{origin}</p>
        )}
      </div>

      {/* Price + Favorite */}
      {(price || (eventId && onToggleFavorite)) && (
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          {price && (
            <span className="rounded-sm border border-festival-teal px-2 py-0.5 text-xs text-festival-teal">
              {price}
            </span>
          )}
          {eventId && onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(eventId)}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              className="rounded-sm p-1.5 transition-colors hover:bg-muted/50"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite
                    ? "fill-festival-red text-festival-red"
                    : "text-muted-foreground hover:text-festival-red"
                )}
                fill={isFavorite ? "currentColor" : "none"}
                strokeWidth={isFavorite ? 0 : 2}
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
