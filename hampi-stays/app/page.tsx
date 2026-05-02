import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Statistics } from "@/components/Statistics";
import { FeaturedResorts } from "@/components/FeaturedResorts";
import { Experiences } from "@/components/Experiences";
import { Testimonials } from "@/components/Testimonials";
import { CTASection } from "@/components/CTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Statistics />
        <FeaturedResorts />
        <Experiences />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
