import { HeroSection } from "@/components/hero-section";
import { FestivalContent } from "@/components/festival-content";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FestivalContent />
    </main>
  );
}
