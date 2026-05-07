import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ExperiencesClient } from "./ExperiencesClient";

export const metadata = { title: "Experiences — HampiStays" };

export default function ExperiencesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow"><ExperiencesClient /></main>
      <Footer />
    </div>
  );
}
