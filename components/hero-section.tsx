export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-festival-black text-festival-cream">
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />

      <div className="relative px-6 pt-20 pb-0 md:px-12 lg:px-20">
        {/* Year badge */}
        <div className="mb-6 inline-flex items-center gap-3">
          <div className="h-px w-8 bg-festival-terracotta" />
          <span className="font-space-grotesk text-xs uppercase tracking-[0.2em] text-festival-terracotta">
            Florianópolis · 2026
          </span>
        </div>

        {/* Main title */}
        <h1
          className="leading-none text-festival-cream"
          style={{
            fontFamily: "var(--font-bebas-neue), serif",
            fontSize: "clamp(4rem, 14vw, 12rem)",
            letterSpacing: "0.01em",
          }}
        >
          <span className="block">MARATONA</span>
          <span className="block text-festival-terracotta">DE ARTE</span>
          <span className="block">E CULTURA</span>
        </h1>

        {/* Meta row */}
        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-festival-earth/30 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-festival-earth">Período</p>
            <p
              className="text-2xl text-festival-cream"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              20 a 23 de Março
            </p>
          </div>
          <div className="h-8 w-px bg-festival-earth/30" />
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-festival-earth">Edição</p>
            <p
              className="text-2xl text-festival-cream"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              28ª Maratona Cultural
            </p>
          </div>
          <div className="h-8 w-px bg-festival-earth/30" />
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-festival-earth">Cidade</p>
            <p
              className="text-2xl text-festival-cream"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              Florianópolis · SC
            </p>
          </div>
        </div>
      </div>

      {/* Color stripe band at bottom */}
      <div className="mt-10 flex h-4">
        <div className="flex-1 bg-festival-terracotta" />
        <div className="flex-1 bg-festival-gold" />
        <div className="flex-1 bg-festival-teal" />
        <div className="flex-1 bg-festival-purple" />
        <div className="flex-1 bg-festival-blue" />
      </div>
    </section>
  );
}
