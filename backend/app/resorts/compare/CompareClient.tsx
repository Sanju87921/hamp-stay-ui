"use client";

import Link from 'next/link';
import { ArrowLeft, Star, MapPin, CheckCircle, XCircle } from "lucide-react";
import type { Amenity, Resort } from "@/types/resort";

const ALL_AMENITIES: Amenity[] = [
  "Pool", "Spa", "WiFi", "Restaurant", "Bar", "Yoga",
  "River View", "Heritage View", "Guided Tours", "Cycling",
  "Organic Food", "Campfire", "Rooftop", "Air Conditioning",
];

interface Props {
  resorts: Resort[];
}

export function CompareClient({ resorts }: Props) {
  const colWidth = resorts.length === 2 ? "w-1/2" : "w-1/3";

  if (resorts.length < 2) {
    return (
      <div className="min-h-screen bg-sand-50 pt-32 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif font-bold text-navy-950 mb-4">Not enough resorts to compare</h2>
        <Link href="/resorts" className="text-gold-600 font-bold hover:underline">
          Go back to listing
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 pt-20">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Link
          href="/resorts"
          className="inline-flex items-center gap-2 text-navy-950/60 hover:text-navy-900 font-semibold text-sm transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Resorts
        </Link>

        <h1 className="text-4xl font-serif font-bold text-navy-950 mb-8">Compare Properties</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-sand-100 overflow-hidden">
          <div className="flex border-b border-sand-100">
            <div className="w-44 flex-shrink-0 bg-sand-50 p-4 border-r border-sand-100" />
            {resorts.map((resort) => (
              <div key={resort.id} className={`${colWidth} flex-1 p-5 border-r border-sand-100 last:border-r-0`}>
                <img
                  src={resort.images[0]}
                  alt={resort.name}
                  className="w-full h-36 object-cover rounded-2xl mb-4"
                />
                <Link href={`/resorts/${resort.slug}`}>
                  <h3 className="font-bold font-serif text-navy-950 text-lg leading-snug hover:text-gold-600 transition-colors">
                    {resort.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 text-navy-950/50 mt-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />
                  <span className="text-xs font-medium">{resort.location.area}</span>
                </div>
                <Link
                  href={`/resorts/${resort.slug}`}
                  className="block text-center text-sm font-bold py-2.5 px-4 bg-gold-600 hover:bg-gold-700 text-white rounded-xl transition-colors"
                >
                  View Resort
                </Link>
              </div>
            ))}
          </div>

          {[
            {
              label: "Rating",
              render: (r: Resort) => (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                  <span className="font-bold text-navy-950">{r.rating}</span>
                  <span className="text-navy-950/50 text-xs">({r.reviewCount})</span>
                </div>
              ),
            },
            {
              label: "Starting Price",
              render: (r: Resort) => (
                <div>
                  <span className="font-bold text-navy-950 text-lg">₹{r.pricePerNight.toLocaleString("en-IN")}</span>
                  <span className="text-navy-950/50 text-xs">/night</span>
                </div>
              ),
            },
            {
              label: "Type",
              render: (r: Resort) => (
                <span className="capitalize font-semibold text-navy-900">{r.type}</span>
              ),
            },
            {
              label: "Check-in",
              render: (r: Resort) => <span className="text-navy-900 font-medium">{r.policies.checkIn}</span>,
            },
            {
              label: "Check-out",
              render: (r: Resort) => <span className="text-navy-900 font-medium">{r.policies.checkOut}</span>,
            },
            {
              label: "Min. Nights",
              render: (r: Resort) => <span className="text-navy-900 font-medium">{r.policies.minNights}</span>,
            },
            {
              label: "Pets",
              render: (r: Resort) =>
                r.policies.petsAllowed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                ),
            },
            ...ALL_AMENITIES.map((amenity) => ({
              label: amenity,
              render: (r: Resort) =>
                r.amenities.includes(amenity) ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-navy-800/30" />
                ),
            })),
          ].map((row, i) => (
            <div
              key={row.label}
              className={`flex border-b border-sand-100 last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-sand-50/50"}`}
            >
              <div className="w-44 flex-shrink-0 px-4 py-4 border-r border-sand-100 flex items-center">
                <span className="text-xs font-bold text-navy-950/50 uppercase tracking-wider">{row.label}</span>
              </div>
              {resorts.map((resort) => (
                <div
                  key={resort.id}
                  className={`${colWidth} flex-1 px-5 py-4 border-r border-sand-100 last:border-r-0 flex items-center`}
                >
                  {row.render(resort)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
