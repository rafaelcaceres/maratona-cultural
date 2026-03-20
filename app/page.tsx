import { HeroSection } from "@/components/hero-section";
import { FestivalContent } from "@/components/festival-content";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FestivalContent />
      <Footer />
    </main>
  );
}
