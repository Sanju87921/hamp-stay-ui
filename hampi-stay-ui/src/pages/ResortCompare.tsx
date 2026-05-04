// ============================================================
// ResortCompare Page — /resorts/compare?ids=res-001,res-002
// Side-by-side comparison of 2–3 resorts.
// ============================================================

import { useMemo } from "react";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, CheckCircle, XCircle } from "lucide-react";
import { RESORTS } from "../data/resorts";
import type { Amenity } from "../types/resort";

const ALL_AMENITIES: Amenity[] = [
  "Pool", "Spa", "WiFi", "Restaurant", "Bar", "Yoga",
  "River View", "Heritage View", "Guided Tours", "Cycling",
  "Organic Food", "Campfire", "Rooftop", "Air Conditioning",
];

export function ResortCompare() {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get("ids") ?? "";
  const ids = idParam.split(",").filter(Boolean).slice(0, 3);

  const resorts = useMemo(
    () => ids.map((id) => RESORTS.find((r) => r.id === id)).filter(Boolean) as typeof RESORTS,
    [ids]
  );

  if (resorts.length < 2) return <Navigate to="/resorts" replace />;

  const colWidth = resorts.length === 2 ? "w-1/2" : "w-1/3";

  return (
    <div className="min-h-screen bg-sand-50 pt-20">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Back */}
        <Link
          to="/resorts"
          className="inline-flex items-center gap-2 text-navy-950/60 hover:text-navy-900 font-semibold text-sm transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Resorts
        </Link>

        <h1 className="text-4xl font-serif font-bold text-navy-950 mb-8">Compare Properties</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-sand-100 overflow-hidden">
          {/* Header Row */}
          <div className="flex border-b border-sand-100">
            <div className="w-44 flex-shrink-0 bg-sand-50 p-4 border-r border-sand-100" />
            {resorts.map((resort) => (
              <div key={resort.id} className={`${colWidth} flex-1 p-5 border-r border-sand-100 last:border-r-0`}>
                <img
                  src={resort.images[0]}
                  alt={resort.name}
                  className="w-full h-36 object-cover rounded-2xl mb-4"
                />
                <Link to={`/resorts/${resort.slug}`}>
                  <h3 className="font-bold font-serif text-navy-950 text-lg leading-snug hover:text-gold-600 transition-colors">
                    {resort.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 text-navy-950/50 mt-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />
                  <span className="text-xs font-medium">{resort.location.area}</span>
                </div>
                <Link
                  to={`/resorts/${resort.slug}`}
                  className="block text-center text-sm font-bold py-2.5 px-4 bg-gold-600 hover:bg-gold-700 text-white rounded-xl transition-colors"
                >
                  View Resort
                </Link>
              </div>
            ))}
          </div>

          {/* Rows */}
          {[
            {
              label: "Rating",
              render: (r: typeof RESORTS[0]) => (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                  <span className="font-bold text-navy-950">{r.rating}</span>
                  <span className="text-navy-950/50 text-xs">({r.reviewCount})</span>
                </div>
              ),
            },
            {
              label: "Starting Price",
              render: (r: typeof RESORTS[0]) => (
                <div>
                  <span className="font-bold text-navy-950 text-lg">₹{r.pricePerNight.toLocaleString("en-IN")}</span>
                  <span className="text-navy-950/50 text-xs">/night</span>
                </div>
              ),
            },
            {
              label: "Type",
              render: (r: typeof RESORTS[0]) => (
                <span className="capitalize font-semibold text-navy-900">{r.type}</span>
              ),
            },
            {
              label: "Check-in",
              render: (r: typeof RESORTS[0]) => <span className="text-navy-900 font-medium">{r.policies.checkIn}</span>,
            },
            {
              label: "Check-out",
              render: (r: typeof RESORTS[0]) => <span className="text-navy-900 font-medium">{r.policies.checkOut}</span>,
            },
            {
              label: "Min. Nights",
              render: (r: typeof RESORTS[0]) => <span className="text-navy-900 font-medium">{r.policies.minNights}</span>,
            },
            {
              label: "Pets",
              render: (r: typeof RESORTS[0]) =>
                r.policies.petsAllowed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                ),
            },
            ...ALL_AMENITIES.map((amenity) => ({
              label: amenity,
              render: (r: typeof RESORTS[0]) =>
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
