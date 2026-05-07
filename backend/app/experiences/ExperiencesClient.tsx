"use client";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Clock,
  Users,
  Star,
  MapPin,
  ArrowRight,
  Camera,
  Compass,
  Sunrise,
  Palette,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface Experience {
  id: number;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  groupSize: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  highlights: string[];
  icon: React.ElementType;
  category: string;
}

const experiences: Experience[] = [
  {
    id: 1,
    title: "Heritage Cycle Tour",
    tagline: "Explore ruins at ground level",
    description:
      "Pedal through the ancient bazaar, the Royal Enclosure, and forgotten village paths that no car can reach. Accompanied by a certified heritage guide, you'll discover inscriptions, sculptures, and stories hidden in plain sight across the UNESCO World Heritage Site.",
    duration: "Full Day (6–7 hrs)",
    groupSize: "2–8 guests",
    rating: 4.9,
    reviews: 187,
    price: "₹2,500",
    image:
      "https://images.unsplash.com/photo-1588319648913-0ff4b76a9fed?q=80&w=2070&auto=format&fit=crop",
    highlights: [
      "Royal Enclosure & Mahanavami Dibba",
      "Achyutaraya Temple complex",
      "Hampi Bazaar & Virupaksha Temple",
      "Local village lunch included",
    ],
    icon: Compass,
    category: "Heritage",
  },
  {
    id: 2,
    title: "Boulder Sunrise Trek",
    tagline: "360° panorama at dawn",
    description:
      "Rise before dawn and trek to the summit of Matanga Hill for the most breathtaking panoramic view in all of Hampi. Watch as the ancient ruins glow golden in the first light while your guide narrates the legends of the Vijayanagara empire.",
    duration: "2–3 hours",
    groupSize: "2–6 guests",
    rating: 4.9,
    reviews: 243,
    price: "₹1,800",
    image:
      "https://images.unsplash.com/photo-1596018382916-56d2e341d784?q=80&w=2070&auto=format&fit=crop",
    highlights: [
      "Pre-dawn pickup from your resort",
      "Guided ascent with headlamps",
      "360° sunrise panorama from summit",
      "Hot chai & breakfast at the top",
    ],
    icon: Sunrise,
    category: "Adventure",
  },
  {
    id: 3,
    title: "Archaeology Deep Dive",
    tagline: "With a field archaeologist",
    description:
      "Join a private tour led by a practicing field archaeologist to explore lesser-known sites: the Queen's Bath, Elephant Stables, the underground Prasanna Virupaksha temple, and hidden inscriptions that reveal the daily life of a 15th-century empire.",
    duration: "3–4 hours",
    groupSize: "2–4 guests",
    rating: 4.8,
    reviews: 156,
    price: "₹3,500",
    image:
      "https://images.unsplash.com/photo-1642516863984-68fdeea5ba64?q=80&w=2070&auto=format&fit=crop",
    highlights: [
      "Queen's Bath & Elephant Stables",
      "Underground temple exploration",
      "Decoding ancient Kannada inscriptions",
      "Exclusive access to restricted zones",
    ],
    icon: Camera,
    category: "Heritage",
  },
  {
    id: 4,
    title: "Coracle Ride on Tungabhadra",
    tagline: "Drift through ancient waters",
    description:
      "Glide across the Tungabhadra River in a traditional round coracle boat, passing boulder formations, riverside temples, and ancient bathing ghats. The sunset version includes a riverside bonfire dinner with local Kalyani cuisine.",
    duration: "1.5–2 hours",
    groupSize: "2–4 guests",
    rating: 4.7,
    reviews: 312,
    price: "₹1,200",
    image:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop",
    highlights: [
      "Traditional round coracle boat",
      "Riverside temple views",
      "Sunset & golden hour timing",
      "Optional bonfire dinner add-on",
    ],
    icon: Waves,
    category: "Nature",
  },
  {
    id: 5,
    title: "Royal Hampi Cooking Class",
    tagline: "Taste the Vijayanagara empire",
    description:
      "Learn to cook authentic North Karnataka cuisine with a local chef in a traditional kitchen. From Jolada Rotti to Ennegayi, discover recipes passed down through generations of Hampi families. Includes a full sit-down meal of your creations.",
    duration: "3 hours",
    groupSize: "2–6 guests",
    rating: 4.8,
    reviews: 98,
    price: "₹2,000",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2000",
    highlights: [
      "Local market visit for ingredients",
      "Traditional wood-fire cooking",
      "5-course Karnataka thali preparation",
      "Recipe booklet to take home",
    ],
    icon: UtensilsCrossed,
    category: "Cultural",
  },
  {
    id: 6,
    title: "Stone Carving Workshop",
    tagline: "Create like the ancients",
    description:
      "Work alongside a master stone carver descended from Vijayanagara artisans. Learn basic techniques of soapstone carving and create your own miniature sculpture inspired by the temple motifs that surround you. A truly hands-on heritage experience.",
    duration: "2–3 hours",
    groupSize: "2–4 guests",
    rating: 4.9,
    reviews: 67,
    price: "₹2,800",
    image:
      "https://images.unsplash.com/photo-1591536098930-d571deee309a?auto=format&fit=crop&q=80&w=2000",
    highlights: [
      "Learn from a master artisan",
      "Soapstone carving techniques",
      "Create your own sculpture",
      "Take your creation home",
    ],
    icon: Palette,
    category: "Cultural",
  },
];


export function ExperiencesClient() {
  return (
    <main className="min-h-screen bg-sand-50">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gold-200/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sunset-200/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-sunset-100/60 backdrop-blur-md border border-sunset-200/60 rounded-full px-5 py-2 mb-6">
              <Compass className="w-4 h-4 text-sunset-600" />
              <span className="text-xs font-bold tracking-widest uppercase text-sunset-700">
                Immersive Activities
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-navy-950 mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Curated{" "}
            <span className="text-gold-600 italic">Experiences</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-navy-800/60 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Go beyond accommodation. Our signature experiences are curated by
            local experts — archaeologists, artisans, and adventure guides — to
            grant you exclusive access to the soul of Hampi.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {[
              { value: "6", label: "Experiences" },
              { value: "4.8★", label: "Avg Rating" },
              { value: "1,000+", label: "Guests Served" },
              { value: "100%", label: "Locally Led" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-navy-950 font-serif">
                  {stat.value}
                </p>
                <p className="text-xs text-navy-800/40 font-semibold mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── EXPERIENCE CARDS ── */}
      <section className="container mx-auto px-4 md:px-6 pb-28">
        <div className="space-y-12 max-w-6xl mx-auto">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={`group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-xl border border-sand-200/50 shadow-sm hover:shadow-luxury transition-all duration-500 ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`relative aspect-[4/3] lg:aspect-auto overflow-hidden ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <img
                  src={exp.image}
                  alt={exp.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-white tracking-wider uppercase">
                    <exp.icon className="w-3.5 h-3.5" />
                    {exp.category}
                  </span>
                </div>

                {/* Price badge */}
                <div className="absolute bottom-6 left-6">
                  <span className="bg-navy-950/80 backdrop-blur-md text-white font-bold text-lg px-5 py-2 rounded-xl">
                    {exp.price}
                    <span className="text-sand-200/60 text-sm font-medium">
                      {" "}/ person
                    </span>
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                <span className="text-gold-600 text-xs font-bold tracking-widest uppercase mb-3">
                  {exp.tagline}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy-950 mb-4">
                  {exp.title}
                </h3>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
                  <span className="flex items-center gap-1.5 text-navy-800/50">
                    <Clock className="w-4 h-4" />
                    {exp.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-navy-800/50">
                    <Users className="w-4 h-4" />
                    {exp.groupSize}
                  </span>
                  <span className="flex items-center gap-1.5 text-navy-800/50">
                    <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                    <span className="font-bold text-navy-950">
                      {exp.rating}
                    </span>
                    <span>({exp.reviews})</span>
                  </span>
                </div>

                <p className="text-navy-800/60 leading-relaxed text-[15px] mb-6">
                  {exp.description}
                </p>

                {/* Highlights */}
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-3">
                    Highlights
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {exp.highlights.map((hl) => (
                      <li
                        key={hl}
                        className="flex items-center gap-2 text-sm text-navy-800/60"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                        {hl}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-navy-950 hover:bg-gold-500 text-white hover:text-navy-950 font-bold px-6 py-3.5 rounded-full transition-all duration-300 text-sm tracking-wider uppercase self-start shadow-sm hover:shadow-gold"
                >
                  Reserve Experience
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 bg-sand-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-200/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <MapPin className="w-8 h-8 text-gold-500 mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-950 mb-4">
              Can't Decide?{" "}
              <span className="text-gold-600 italic">We'll Help</span>
            </h2>
            <p className="text-navy-800/60 max-w-xl mx-auto leading-relaxed mb-8">
              Our concierge team can craft a custom itinerary combining multiple
              experiences tailored to your interests, schedule, and group size.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-gold hover:shadow-gold-lg uppercase tracking-wider text-sm"
            >
              Talk to Our Concierge
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
