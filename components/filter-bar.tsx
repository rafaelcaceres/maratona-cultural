"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type EventType =
  | "show"
  | "exhibition"
  | "screening"
  | "workshop"
  | "performance"
  | "other";

type Section = "principal" | "eventos_parceiros" | "programacao_off";

interface FilterBarProps {
  activeDate: string;
  onDateChange: (date: string) => void;
  activeType: EventType | null;
  onTypeChange: (type: EventType | null) => void;
  activeSection: Section | null;
  onSectionChange: (section: Section | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const DAYS = [
  { date: "2026-03-20", label: "20", day: "Sex" },
  { date: "2026-03-21", label: "21", day: "Sáb" },
  { date: "2026-03-22", label: "22", day: "Dom" },
  { date: "2026-03-23", label: "23", day: "Seg" },
];

const EVENT_TYPES: { value: EventType; label: string; color: string }[] = [
  { value: "show", label: "Shows", color: "bg-festival-terracotta" },
  { value: "exhibition", label: "Exposições", color: "bg-festival-teal" },
  { value: "screening", label: "Cinema", color: "bg-festival-purple" },
  { value: "workshop", label: "Oficinas", color: "bg-festival-gold" },
  { value: "performance", label: "Performances", color: "bg-festival-blue" },
  { value: "other", label: "Outros", color: "bg-festival-stone" },
];

const SECTIONS: { value: Section; label: string }[] = [
  { value: "principal", label: "Principal" },
  { value: "eventos_parceiros", label: "Parceiros" },
  { value: "programacao_off", label: "Prog. Off" },
];

export function FilterBar({
  activeDate,
  onDateChange,
  activeType,
  onTypeChange,
  activeSection,
  onSectionChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border">
      {/* Day tabs */}
      <div className="flex border-b border-border">
        {DAYS.map(({ date, label, day }) => (
          <button
            key={date}
            onClick={() => onDateChange(date)}
            className={cn(
              "flex-1 flex flex-col items-center py-3 text-center transition-colors",
              activeDate === date
                ? "bg-festival-black text-festival-cream"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <span
              className="leading-none"
              style={{
                fontFamily: "var(--font-bebas-neue)",
                fontSize: "2rem",
              }}
            >
              {label}
            </span>
            <span className="mt-0.5 text-xs uppercase tracking-wider opacity-70">
              {day}
            </span>
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar evento ou artista..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-sm border border-input bg-transparent py-2 pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Type filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <FilterPill
            active={activeType === null}
            onClick={() => onTypeChange(null)}
          >
            Todos
          </FilterPill>
          {EVENT_TYPES.map(({ value, label, color }) => (
            <FilterPill
              key={value}
              active={activeType === value}
              onClick={() => onTypeChange(activeType === value ? null : value)}
              dot={color}
            >
              {label}
            </FilterPill>
          ))}
        </div>

        {/* Section filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <FilterPill
            active={activeSection === null}
            onClick={() => onSectionChange(null)}
          >
            Todas as seções
          </FilterPill>
          {SECTIONS.map(({ value, label }) => (
            <FilterPill
              key={value}
              active={activeSection === value}
              onClick={() =>
                onSectionChange(activeSection === value ? null : value)
              }
            >
              {label}
            </FilterPill>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap",
        active
          ? "border-festival-black bg-festival-black text-festival-cream"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
      )}
    >
      {dot && (
        <span className={cn("h-2 w-2 rounded-full shrink-0", dot)} />
      )}
      {children}
    </button>
  );
}
