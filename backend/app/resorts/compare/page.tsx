import React, { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CompareClient } from "./CompareClient";
import { getResortsByIdsAction } from "@/actions/resorts";

export const metadata = { title: "Compare Resorts — HampiStays" };

interface Props {
  searchParams: { ids?: string };
}

export default async function ComparePage({ searchParams }: Props) {
  const { ids: idsString } = await searchParams;
  const ids = (idsString ?? "").split(",").filter(Boolean).slice(0, 3);
  
  const resorts = ids.length >= 2 ? await getResortsByIdsAction(ids) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="p-20 text-center font-serif text-xl text-navy-950">Preparing comparison...</div>}>
          <CompareClient resorts={resorts} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
