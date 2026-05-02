import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center pt-24 bg-sand-50">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-forest-950 font-bold mb-4">{title}</h1>
        <p className="text-stone-600">Coming soon.</p>
      </div>
    </div>
  );
}

export default function ResortsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PlaceholderPage title="Our Resorts" />
      </main>
      <Footer />
    </div>
  );
}
