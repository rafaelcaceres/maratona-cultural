import { cn } from "@/lib/utils";

type Section = "principal" | "eventos_parceiros" | "programacao_off";

const SECTION_INFO: Record<Section, { label: string; color: string; textColor: string }> = {
  principal: { label: "Programação Principal", color: "bg-festival-red", textColor: "text-festival-red" },
  eventos_parceiros: { label: "Eventos Parceiros", color: "bg-festival-gold", textColor: "text-foreground" },
  programacao_off: { label: "Programação Off", color: "bg-festival-stone", textColor: "text-foreground" },
};

interface SectionDividerProps {
  section: Section;
  count: number;
}

export function SectionDivider({ section, count }: SectionDividerProps) {
  const info = SECTION_INFO[section];
  return (
    <div className="flex items-center gap-4 py-2">
      <div className={cn("h-1 w-6 shrink-0", info.color)} />
      <h2
        className={cn("text-2xl uppercase", info.textColor)}
        style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.05em" }}
      >
        {info.label}
      </h2>
      <span className="text-xs text-muted-foreground">({count} locais)</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
