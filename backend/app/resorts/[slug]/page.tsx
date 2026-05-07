import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getResortBySlugAction } from "@/actions/resorts";
import { ResortDetailClient } from "./ResortDetailClient";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resort = await getResortBySlugAction(slug);

  if (!resort) return { title: "Resort Not Found" };

  return {
    title: `${resort.name} — HampiStays`,
    description: resort.tagline || resort.description.substring(0, 160),
    openGraph: {
      title: `${resort.name} | Luxury Stay in Hampi`,
      description: resort.tagline || resort.description.substring(0, 160),
      images: resort.images?.[0] ? [{ url: resort.images[0] }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resort.name,
      description: resort.tagline || resort.description.substring(0, 160),
      images: resort.images?.[0] ? [resort.images[0]] : [],
    },
  };
}

// Next.js 15+ params are async
export default async function ResortDetailPage({ params }: Props) {
  const { slug } = await params;
  const resort = await getResortBySlugAction(slug);

  if (!resort) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-sand-50">
      <Navbar />
      <ResortDetailClient resort={resort} />
      <Footer />
    </div>
  );
}
