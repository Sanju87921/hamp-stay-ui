import { Hero } from "../components/Hero";
import { FeaturedResorts } from "../components/FeaturedResorts";
import { Experiences } from "../components/Experiences";
import { Testimonials } from "../components/Testimonials";
import { Statistics } from "../components/Statistics";
import { CTASection } from "../components/CTASection";

export function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Statistics />
      <FeaturedResorts />
      <Experiences />
      <Testimonials />
      <CTASection />
    </main>
  );
}
