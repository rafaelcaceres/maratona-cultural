import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EventType =
  | "show"
  | "exhibition"
  | "screening"
  | "workshop"
  | "performance"
  | "other";

const TYPE_LABELS: Record<EventType, string> = {
  show: "Show",
  exhibition: "Exposição",
  screening: "Cinema",
  workshop: "Oficina",
  performance: "Performance",
  other: "Evento",
};

interface EventTypeBadgeProps {
  type: EventType;
  className?: string;
}

export function EventTypeBadge({ type, className }: EventTypeBadgeProps) {
  return (
    <Badge variant={type} className={cn("shrink-0", className)}>
      {TYPE_LABELS[type]}
    </Badge>
  );
}
