export function Footer() {
  return (
    <footer className="bg-festival-black text-festival-cream">
      {/* Color stripe — mirrors the hero bottom */}
      <div className="flex h-3">
        <div className="flex-1 bg-festival-red" />
        <div className="flex-1 bg-festival-gold" />
        <div className="flex-1 bg-festival-teal" />
        <div className="flex-1 bg-white/60" />
        <div className="flex-1 bg-festival-blue" />
      </div>

      {/* Film strip */}
      <div className="flex h-10 items-center bg-white/5">
        <div className="flex w-full items-center justify-around px-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-5 w-3 rounded-sm bg-white/10" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-12 md:px-12">
        {/* Festival title */}
        <div className="mb-10 flex flex-col items-center gap-1 text-center">
          <p
            className="text-xs uppercase tracking-[0.25em] text-festival-gold"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Florianópolis · SC · 2026
          </p>
          <h2
            className="leading-none text-festival-cream"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              letterSpacing: "0.02em",
            }}
          >
            28ª Maratona Cultural
          </h2>
          <p className="text-xs text-white/30 tracking-widest uppercase">
            20 — 23 de Março
          </p>
        </div>

        {/* Divider */}
        <div className="mx-auto mb-10 flex max-w-xs items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <div className="h-1 w-1 rounded-full bg-festival-gold" />
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Feito pela Taller */}
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-xs uppercase tracking-[0.2em] text-white/40"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            site não oficial, feito pela
          </p>
          <a
            href="https://taller.net.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            <img
              src="https://cdn.prod.website-files.com/63e266beded5dd88df2551cb/63e2685a1c65a3fc73ace6b6_Logotype.svg"
              alt="Taller"
              className="h-6 w-auto brightness-0 invert"
            />
          </a>
        </div>
      </div>

      {/* Film strip bottom */}
      <div className="flex h-10 items-center bg-white/5">
        <div className="flex w-full items-center justify-around px-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-5 w-3 rounded-sm bg-white/10" />
          ))}
        </div>
      </div>
    </footer>
  );
}
