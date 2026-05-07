// ============================================================
// HampiStays — Resort Data
// Real Hampi resorts with accurate pricing (2024–2025) and 
// authentic Hampi/Karnataka landscape photos from Unsplash.
// To connect to Supabase, replace this file's exports with API
// calls — all consumers stay unchanged.
// ============================================================

import type { Resort } from "../types/resort";

export const RESORTS: Resort[] = [
  {
    id: "res-001",
    slug: "evolve-back-kamalapura",
    name: "Evolve Back Kamalapura Palace",
    tagline: "Where the Vijayanagara Empire Meets World-Class Luxury",
    description:
      "Nestled against the dramatic backdrop of Hampi's boulder-strewn landscape, Evolve Back Kamalapura Palace is the pinnacle of luxury heritage stays. Each villa blends ancient Dravidian architecture with contemporary comfort — private plunge pools, handcrafted interiors, and a dedicated butler service ensure an unmatched experience. A CGH Earth property.",
    type: "luxury",
    location: {
      area: "Kamalapura",
      district: "Vijayanagara",
      state: "Karnataka",
      lat: 15.3238,
      lng: 76.4575,
      distanceFromCenterKm: 4.2,
    },
    images: [
      // Tungabhadra River aerial with ancient city — Hampi landscape
      "https://images.unsplash.com/photo-1636903684031-e187417f3e77?auto=format&fit=crop&q=80&w=2000",
      // Virupaksha Temple Tower
      "https://images.unsplash.com/photo-1591536098930-d571deee309a?auto=format&fit=crop&q=80&w=2000",
      // Coracle ride on Tungabhadra
      "https://images.unsplash.com/flagged/photo-1582271542392-c4ca315c0663?auto=format&fit=crop&q=80&w=2000",
      // Ancient stone pillars
      "https://images.unsplash.com/photo-1708668984945-309e431c61f0?auto=format&fit=crop&q=80&w=2000",
      // Hampi boulders landscape
      "https://images.unsplash.com/photo-1596018382916-56d2e341d784?auto=format&fit=crop&q=80&w=2000",
    ],
    amenities: ["Pool", "Spa", "Restaurant", "Bar", "WiFi", "Air Conditioning", "Airport Transfer", "Yoga"],
    rating: 4.9,
    reviewCount: 248,
    pricePerNight: 31000,
    roomTypes: [
      {
        id: "rt-001-1",
        name: "Nivasa Heritage Villa",
        description: "A grand villa with private plunge pool and panoramic heritage views of Hampi ruins.",
        pricePerNight: 31000,
        capacity: 2,
        amenities: ["Pool", "Air Conditioning", "WiFi"],
        images: ["https://images.unsplash.com/photo-1636903684031-e187417f3e77?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 5,
      },
      {
        id: "rt-001-2",
        name: "Jal Mahal Suite",
        description: "The ultimate indulgence — an overwater suite with a dedicated butler and infinity pool.",
        pricePerNight: 47000,
        capacity: 4,
        amenities: ["Pool", "Spa", "Air Conditioning", "WiFi", "Airport Transfer"],
        images: ["https://images.unsplash.com/photo-1591536098930-d571deee309a?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 2,
      },
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 48 hours before check-in. 100% charge after that.",
      petsAllowed: false,
      smokingAllowed: false,
      minNights: 2,
      maxNights: 30,
    },
    nearbyAttractions: [
      { name: "Virupaksha Temple", type: "temple", distanceKm: 4.5, description: "The most sacred and oldest active temple in Hampi, dedicated to Lord Shiva. A UNESCO World Heritage Site.", imageUrl: "https://images.unsplash.com/photo-1591536098930-d571deee309a?auto=format&fit=crop&q=80&w=1280" },
      { name: "Hampi Bazaar", type: "market", distanceKm: 4.8, description: "A vibrant ancient bazaar street lined with stalls selling traditional crafts, spices, and souvenirs." },
      { name: "Vittala Temple & Stone Chariot", type: "temple", distanceKm: 5.9, description: "Famous for its iconic stone chariot and musical pillars that produce harmonic sounds when tapped.", imageUrl: "https://images.unsplash.com/photo-1722934804353-0d9f6a55ab5e?auto=format&fit=crop&q=80&w=1280" },
      { name: "Tungabhadra River", type: "activity", distanceKm: 3.2, description: "Take a traditional coracle boat ride on the sacred river at sunset. A truly magical experience." },
      { name: "Matanga Hill", type: "viewpoint", distanceKm: 5.1, description: "A must-do sunrise trek offering a 360° panoramic view of the entire Hampi landscape." },
    ],
    isFeatured: true,
    isVerified: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "res-002",
    slug: "hampis-boulders-resort",
    name: "Hampi's Boulders Resort & Spa",
    tagline: "Serenity at the Edge of the Sacred Tungabhadra",
    description:
      "Built harmoniously between the ancient granite boulders of the Tungabhadra riverbank, Hampi's Boulders Resort offers an eco-conscious retreat without compromising on comfort. Cascading gardens, an Ayurvedic spa, and open-air yoga pavilions make this a sanctuary for the soul. Cottages are nestled directly into the boulders for an immersive experience.",
    type: "eco",
    location: {
      area: "Nimbapura, Tungabhadra Riverbank",
      district: "Vijayanagara",
      state: "Karnataka",
      lat: 15.3380,
      lng: 76.4610,
      distanceFromCenterKm: 2.1,
    },
    images: [
      // Hampi boulders and river landscape
      "https://images.unsplash.com/photo-1581488613801-68d36242d412?auto=format&fit=crop&q=80&w=2000",
      // Hampi landscape with ruins
      "https://images.unsplash.com/photo-1596018382916-56d2e341d784?auto=format&fit=crop&q=80&w=2000",
      // Coracle on Tungabhadra
      "https://images.unsplash.com/flagged/photo-1582271542392-c4ca315c0663?auto=format&fit=crop&q=80&w=2000",
    ],
    amenities: ["River View", "Spa", "Yoga", "Organic Food", "WiFi", "Cycling", "Guided Tours"],
    rating: 4.8,
    reviewCount: 312,
    pricePerNight: 9500,
    roomTypes: [
      {
        id: "rt-002-1",
        name: "Boulder Cottage",
        description: "A natural stone cottage nestled between ancient granite boulders with river views.",
        pricePerNight: 9500,
        capacity: 2,
        amenities: ["WiFi", "River View"],
        images: ["https://images.unsplash.com/photo-1581488613801-68d36242d412?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 8,
      },
      {
        id: "rt-002-2",
        name: "Riverside Suite",
        description: "A spacious suite with a private deck extending directly over the Tungabhadra.",
        pricePerNight: 15000,
        capacity: 3,
        amenities: ["WiFi", "River View", "Spa"],
        images: ["https://images.unsplash.com/photo-1596018382916-56d2e341d784?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 3,
      },
    ],
    policies: {
      checkIn: "1:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 72 hours before check-in.",
      petsAllowed: false,
      smokingAllowed: false,
      minNights: 1,
      maxNights: 20,
    },
    nearbyAttractions: [
      { name: "Virupaksha Temple", type: "temple", distanceKm: 2.3, description: "The most sacred and oldest active temple in Hampi, dedicated to Lord Shiva." },
      { name: "Coracle Boat Ride", type: "activity", distanceKm: 0.2, description: "Right on your doorstep — hop onto a traditional round coracle boat and explore the river islands." },
      { name: "Hippie Island (Virupapur Gadde)", type: "activity", distanceKm: 1.5, description: "A bohemian island across the river with cafés, guesthouses, and a relaxed backpacker vibe." },
    ],
    isFeatured: true,
    isVerified: true,
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "res-003",
    slug: "heritage-resort-hampi",
    name: "Heritage Resort Hampi",
    tagline: "Authentic Hampi Living, Thoughtfully Curated",
    description:
      "Heritage Resort Hampi is a well-established 4-star property that celebrates local Vijayanagara architecture and sustainable living. Hand-woven textiles, farm-to-table meals, and guided heritage walks give guests an intimate, authentic connection to the ancient city. Located close to the Lotus Mahal and the Royal Enclosure.",
    type: "heritage",
    location: {
      area: "Kamalapura Road",
      district: "Vijayanagara",
      state: "Karnataka",
      lat: 15.3450,
      lng: 76.4700,
      distanceFromCenterKm: 3.5,
    },
    images: [
      // Virupaksha Temple — the landmark of Hampi
      "https://images.unsplash.com/photo-1591536098930-d571deee309a?auto=format&fit=crop&q=80&w=2000",
      // Lotus Mahal ancient palace architecture
      "https://images.unsplash.com/photo-1642516863984-68fdeea5ba64?auto=format&fit=crop&q=80&w=2000",
      // Aerial view of Hampi with river
      "https://images.unsplash.com/photo-1636903684031-e187417f3e77?auto=format&fit=crop&q=80&w=2000",
    ],
    amenities: ["Heritage View", "Organic Food", "Guided Tours", "WiFi", "Campfire", "Cycling", "Restaurant"],
    rating: 4.6,
    reviewCount: 189,
    pricePerNight: 7500,
    roomTypes: [
      {
        id: "rt-003-1",
        name: "Heritage Room",
        description: "A cozy room with traditional décor and views of the resort's heritage gardens.",
        pricePerNight: 7500,
        capacity: 2,
        amenities: ["WiFi", "Heritage View"],
        images: ["https://images.unsplash.com/photo-1591536098930-d571deee309a?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 10,
      },
      {
        id: "rt-003-2",
        name: "Heritage Suite",
        description: "A spacious suite with a private sit-out and panoramic Hampi landscape views.",
        pricePerNight: 14000,
        capacity: 3,
        amenities: ["WiFi", "Heritage View", "Restaurant"],
        images: ["https://images.unsplash.com/photo-1642516863984-68fdeea5ba64?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 4,
      },
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "10:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in.",
      petsAllowed: false,
      smokingAllowed: false,
      minNights: 1,
      maxNights: 14,
    },
    nearbyAttractions: [
      { name: "Lotus Mahal", type: "ruins", distanceKm: 1.2, description: "A beautiful two-storey pavilion that was part of the royal enclosure of the Vijayanagara Empire.", imageUrl: "https://images.unsplash.com/photo-1642516863984-68fdeea5ba64?auto=format&fit=crop&q=80&w=1280" },
      { name: "Elephant Stables", type: "ruins", distanceKm: 1.3, description: "An imposing series of domed chambers that once housed the royal war elephants." },
      { name: "Queen's Bath", type: "ruins", distanceKm: 2.1, description: "An ornate bathing complex with Indo-Islamic architectural elements built for the royal family." },
    ],
    isFeatured: false,
    isVerified: true,
    createdAt: "2024-03-05T10:00:00Z",
  },
  {
    id: "res-004",
    slug: "clarks-inn-hampi",
    name: "Clarks Inn Hampi",
    tagline: "Comfortable, Central, and Completely Hassle-Free",
    description:
      "A reliable and well-located 3-star hotel near Kamalapura, Clarks Inn Hampi is the go-to choice for travellers seeking modern comforts at accessible prices. Clean rooms, a good restaurant serving local Karnataka cuisine, and a rooftop with iconic boulder views make it a popular mid-range choice.",
    type: "budget",
    location: {
      area: "Kamalapura",
      district: "Vijayanagara",
      state: "Karnataka",
      lat: 15.3260,
      lng: 76.4590,
      distanceFromCenterKm: 4.0,
    },
    images: [
      // Sule Bazaar ancient ruins
      "https://images.unsplash.com/photo-1588319648913-0ff4b76a9fed?auto=format&fit=crop&q=80&w=2000",
      // Hampi boulder landscape
      "https://images.unsplash.com/photo-1596018382916-56d2e341d784?auto=format&fit=crop&q=80&w=2000",
      // Tungabhadra river bank
      "https://images.unsplash.com/photo-1581488613801-68d36242d412?auto=format&fit=crop&q=80&w=2000",
    ],
    amenities: ["Rooftop", "WiFi", "Restaurant", "Parking", "Air Conditioning"],
    rating: 4.2,
    reviewCount: 420,
    pricePerNight: 3500,
    roomTypes: [
      {
        id: "rt-004-1",
        name: "Standard Room",
        description: "A clean and comfortable room with all modern amenities and AC.",
        pricePerNight: 3500,
        capacity: 2,
        amenities: ["WiFi", "Air Conditioning"],
        images: ["https://images.unsplash.com/photo-1588319648913-0ff4b76a9fed?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 15,
      },
      {
        id: "rt-004-2",
        name: "Deluxe Rooftop Room",
        description: "An upgraded room with rooftop terrace access and panoramic boulder views.",
        pricePerNight: 5000,
        capacity: 2,
        amenities: ["WiFi", "Air Conditioning", "Rooftop"],
        images: ["https://images.unsplash.com/photo-1596018382916-56d2e341d784?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 5,
      },
    ],
    policies: {
      checkIn: "12:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in.",
      petsAllowed: false,
      smokingAllowed: false,
      minNights: 1,
      maxNights: 30,
    },
    nearbyAttractions: [
      { name: "Virupaksha Temple", type: "temple", distanceKm: 4.0, description: "The living temple of Hampi — an active place of worship since the 7th century." },
      { name: "Royal Enclosure", type: "ruins", distanceKm: 1.5, description: "The ceremonial heart of the Vijayanagara Empire, housing the King's Audience Hall and secret chambers." },
    ],
    isFeatured: false,
    isVerified: true,
    createdAt: "2024-04-20T10:00:00Z",
  },
  {
    id: "res-005",
    slug: "hampi-boutique-villa",
    name: "Hampi Boutique Villa",
    tagline: "Designer Comfort in a Living Heritage Setting",
    description:
      "A carefully restored boutique property in the heart of Hampi village, just a short walk from Virupaksha Temple. Just 8 rooms, each uniquely designed using local crafts and traditional Karnataka materials. The property features a celebrated South Indian kitchen, a rooftop terrace with heritage views, and curated sunrise tours to Matanga Hill.",
    type: "boutique",
    location: {
      area: "Hampi Village",
      district: "Vijayanagara",
      state: "Karnataka",
      lat: 15.3350,
      lng: 76.4620,
      distanceFromCenterKm: 0.8,
    },
    images: [
      // Stone chariot at Vittala temple
      "https://images.unsplash.com/photo-1722934804353-0d9f6a55ab5e?auto=format&fit=crop&q=80&w=2000",
      // Temple architecture
      "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&q=80&w=2000",
      // Lotus Mahal heritage architecture
      "https://images.unsplash.com/photo-1642516863984-68fdeea5ba64?auto=format&fit=crop&q=80&w=2000",
    ],
    amenities: ["Rooftop", "Heritage View", "Restaurant", "Guided Tours", "WiFi"],
    rating: 4.7,
    reviewCount: 97,
    pricePerNight: 11000,
    roomTypes: [
      {
        id: "rt-005-1",
        name: "Artisan Room",
        description: "Uniquely decorated by a different local artisan — no two rooms are the same.",
        pricePerNight: 11000,
        capacity: 2,
        amenities: ["WiFi", "Heritage View"],
        images: ["https://images.unsplash.com/photo-1722934804353-0d9f6a55ab5e?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 6,
      },
      {
        id: "rt-005-2",
        name: "Rooftop Heritage Suite",
        description: "A premium suite with exclusive rooftop access and direct Virupaksha Temple views.",
        pricePerNight: 18000,
        capacity: 2,
        amenities: ["WiFi", "Heritage View", "Rooftop", "Restaurant"],
        images: ["https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&q=80&w=2000"],
        availableCount: 2,
      },
    ],
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 5 days before check-in. 50% charge within 5 days.",
      petsAllowed: false,
      smokingAllowed: false,
      minNights: 2,
      maxNights: 21,
    },
    nearbyAttractions: [
      { name: "Virupaksha Temple", type: "temple", distanceKm: 0.9, description: "Walk to the heart of Hampi's spiritual life — the magnificent 7th-century Virupaksha Temple.", imageUrl: "https://images.unsplash.com/photo-1591536098930-d571deee309a?auto=format&fit=crop&q=80&w=1280" },
      { name: "Hemakuta Hill", type: "viewpoint", distanceKm: 1.1, description: "A collection of early Jain temples and a spectacular sunrise/sunset viewpoint above the bazaar." },
      { name: "Vittala Temple", type: "temple", distanceKm: 3.2, description: "The famed stone chariot and musical pillars — the icon of Hampi.", imageUrl: "https://images.unsplash.com/photo-1722934804353-0d9f6a55ab5e?auto=format&fit=crop&q=80&w=1280" },
    ],
    isFeatured: true,
    isVerified: true,
    createdAt: "2024-05-01T10:00:00Z",
  },
];

// ============================================================
// Utility: get one resort by slug
// ============================================================
export function getResortBySlug(slug: string): Resort | undefined {
  return RESORTS.find((r) => r.slug === slug);
}
