export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-festival-purple text-festival-cream">
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />

      {/* Geometric X pattern — decorative background, top-right */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.07]">
        <svg
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Large X from triangles */}
          <polygon points="80,40 320,40 200,200" fill="white" />
          <polygon points="80,460 320,460 200,300" fill="white" />
          <polygon points="40,80 40,420 200,250" fill="white" />
          <polygon points="360,80 360,420 200,250" fill="white" />
        </svg>
      </div>

      {/* Film strip — top */}
      <div className="relative flex h-10 items-center gap-0 bg-black/20">
        <div className="flex w-full items-center justify-around px-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-3 rounded-sm bg-white/15"
            />
          ))}
        </div>
      </div>

      <div className="relative px-6 pt-10 pb-0 md:px-12 lg:px-20">
        {/* Tagline */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className="text-xs uppercase tracking-[0.25em] text-festival-gold"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            MAIS ARTE » MAIS CIDADE » MAIS VIDA
          </span>
        </div>

        {/* Year badge */}
        <div className="mb-6 inline-flex items-center gap-3">
          <div className="h-px w-8 bg-festival-gold" />
          <span className="font-space-grotesk text-xs uppercase tracking-[0.2em] text-festival-gold">
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
          <span className="block text-festival-gold">CULTURAL</span>
          <span className="block"></span>
        </h1>

        {/* Meta row */}
        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/20 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/40">Período</p>
            <p
              className="text-2xl text-festival-cream"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              20 a 23 de Março
            </p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/40">Edição</p>
            <p
              className="text-2xl text-festival-cream"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              Maratona Cultural 2026
            </p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/40">Cidade</p>
            <p
              className="text-2xl text-festival-cream"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              Florianópolis · SC
            </p>
          </div>
        </div>
      </div>

      {/* Film strip — bottom */}
      <div className="relative mt-8 flex h-10 items-center gap-0 bg-black/20">
        <div className="flex w-full items-center justify-around px-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-3 rounded-sm bg-white/15"
            />
          ))}
        </div>
      </div>

      {/* Color stripe band at bottom */}
      <div className="flex h-3">
        <div className="flex-1 bg-festival-red" />
        <div className="flex-1 bg-festival-gold" />
        <div className="flex-1 bg-festival-teal" />
        <div className="flex-1 bg-white/60" />
        <div className="flex-1 bg-festival-blue" />
      </div>
    </section>
  );
}
