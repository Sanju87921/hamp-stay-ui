// ============================================================
// ResortDetail Page — /resorts/:slug
// Full resort detail: photo gallery, amenities, policies,
// sticky booking widget, nearby attractions.
// ============================================================

import { useState } from "react";
import { useParams, useSearchParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, MapPin, CheckCircle, XCircle,
  Wifi, Coffee, Car, Dumbbell, Waves,
} from "lucide-react";
import { getResortBySlug } from "../data/resorts";
import { BookingWidget } from "../components/resorts/BookingWidget";
import { AttractionsGuide } from "../components/resorts/AttractionsGuide";
import { ResortMap } from "../components/resorts/ResortMap";

const AMENITY_ICON: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-5 h-5" />,
  Restaurant: <Coffee className="w-5 h-5" />,
  Parking: <Car className="w-5 h-5" />,
  Gym: <Dumbbell className="w-5 h-5" />,
  Pool: <Waves className="w-5 h-5" />,
};

export function ResortDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [galleryIdx, setGalleryIdx] = useState(0);

  const resort = slug ? getResortBySlug(slug) : undefined;
  if (!resort) return <Navigate to="/resorts" replace />;

  const images = resort.images;
  const checkIn = searchParams.get("checkIn") ?? undefined;
  const checkOut = searchParams.get("checkOut") ?? undefined;
  const adults = Number(searchParams.get("adults") ?? 2);

  return (
    <div className="min-h-screen bg-sand-50 pt-20">
      {/* Back */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        <Link
          to="/resorts"
          className="inline-flex items-center gap-2 text-navy-950/60 hover:text-navy-900 font-semibold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Resorts
        </Link>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[420px] md:h-[560px] rounded-3xl overflow-hidden">
          {/* Hero image */}
          <div
            className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer overflow-hidden"
            onClick={() => setGalleryIdx(0)}
          >
            <img
              src={images[galleryIdx] ?? images[0]}
              alt={resort.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Thumbnails */}
          {images.slice(1, 5).map((img, i) => (
            <div
              key={img}
              className="hidden md:block relative cursor-pointer overflow-hidden"
              onClick={() => setGalleryIdx(i + 1)}
            >
              <img
                src={img}
                alt={`${resort.name} photo ${i + 2}`}
                className={`w-full h-full object-cover hover:scale-105 transition-transform duration-700 ${galleryIdx === i + 1 ? "ring-4 ring-gold-500" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="container mx-auto px-4 md:px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Details */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-navy-950/50 mb-2">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-medium">
                  {resort.location.area}, Hampi — {resort.location.distanceFromCenterKm} km from city centre
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy-950 mb-3 leading-tight">
                {resort.name}
              </h1>

              <p className="text-lg text-gold-600 font-medium italic mb-4">{resort.tagline}</p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(resort.rating) ? "fill-gold-500 text-gold-500" : "text-stone-200"}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-navy-950">{resort.rating}</span>
                <span className="text-navy-950/50 text-sm">({resort.reviewCount} reviews)</span>
                {resort.isVerified && (
                  <div className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </div>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold font-serif text-navy-950 mb-4">About this property</h2>
              <p className="text-navy-900 leading-relaxed text-lg">{resort.description}</p>
            </section>

            {/* Amenities */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold font-serif text-navy-950 mb-5">What's included</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {resort.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-sand-100 shadow-sm"
                  >
                    <span className="text-gold-500">
                      {AMENITY_ICON[amenity] ?? <CheckCircle className="w-5 h-5" />}
                    </span>
                    <span className="text-navy-950 font-medium text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Policies */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold font-serif text-navy-950 mb-5">Property Rules</h2>
              <div className="bg-white rounded-3xl border border-sand-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-navy-800/40 uppercase tracking-widest mb-1">Check-in</p>
                  <p className="font-semibold text-navy-950">{resort.policies.checkIn}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-800/40 uppercase tracking-widest mb-1">Check-out</p>
                  <p className="font-semibold text-navy-950">{resort.policies.checkOut}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-800/40 uppercase tracking-widest mb-1">Min. Stay</p>
                  <p className="font-semibold text-navy-950">{resort.policies.minNights} night{resort.policies.minNights !== 1 ? "s" : ""}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-800/40 uppercase tracking-widest mb-1">Pets</p>
                  <div className={`flex items-center gap-1.5 font-semibold ${resort.policies.petsAllowed ? "text-green-700" : "text-red-600"}`}>
                    {resort.policies.petsAllowed
                      ? <><CheckCircle className="w-4 h-4" /> Allowed</>
                      : <><XCircle className="w-4 h-4" /> Not allowed</>
                    }
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-navy-800/40 uppercase tracking-widest mb-1">Cancellation</p>
                  <p className="text-navy-900">{resort.policies.cancellation}</p>
                </div>
              </div>
            </section>

            {/* Map */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold font-serif text-navy-950 mb-5">Location</h2>
              <div className="h-64 rounded-3xl overflow-hidden border border-sand-200">
                <ResortMap resorts={[resort]} className="w-full h-full" />
              </div>
            </section>

            {/* Nearby Attractions */}
            <AttractionsGuide attractions={resort.nearbyAttractions} />
          </div>

          {/* Right: Sticky Booking Widget */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="sticky top-24">
              <BookingWidget
                resort={resort}
                initialCheckIn={checkIn}
                initialCheckOut={checkOut}
                initialAdults={adults}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
