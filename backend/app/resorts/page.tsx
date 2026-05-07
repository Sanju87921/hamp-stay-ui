import React, { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ResortsClient from "./ResortsClient";

export const metadata = { title: "Resorts — HampiStays" };
export default function ResortsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-sand-50">
      <Navbar />
      <main className="flex-grow pt-20">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <ResortsClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
