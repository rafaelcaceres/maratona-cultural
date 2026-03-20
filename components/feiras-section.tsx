import { Clock, MapPin } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

interface FeirasSectionProps {
  feiras: Doc<"feiras">[];
}

export function FeirasSection({ feiras }: FeirasSectionProps) {
  if (feiras.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center gap-4">
        <div className="h-1 w-6 bg-festival-gold" />
        <h2
          className="text-2xl text-foreground uppercase"
          style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.05em" }}
        >
          Feiras da Cidade
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Prefeitura Municipal de Florianópolis — Classificação: livre
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {feiras.map((feira) => (
          <div
            key={feira._id}
            className="border-l-4 border-l-festival-gold bg-card border border-border p-3"
          >
            <p
              className="text-sm font-semibold uppercase leading-tight"
              style={{ letterSpacing: "0.03em" }}
            >
              {feira.name}
            </p>
            <div className="mt-1.5 flex flex-col gap-0.5">
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(feira.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {feira.address}
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 shrink-0" />
                <span>
                  {feira.timeStart}—{feira.timeEnd}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
