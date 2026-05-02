/**
 * prisma/seed.ts — Sample data for local development
 * Run: npm run db:seed
 */

import { PrismaClient, Role, ResortStatus } from "@prisma/client";
import { createHash } from "crypto";

const db = new PrismaClient();

// Simple hash for dev — use bcrypt in production (Phase 2)
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clear existing data ──────────────────────────────────
  await db.review.deleteMany();
  await db.payment.deleteMany();
  await db.booking.deleteMany();
  await db.availability.deleteMany();
  await db.resort.deleteMany();
  await db.user.deleteMany();

  // ── Create Users ─────────────────────────────────────────
  const admin = await db.user.create({
    data: {
      email: "admin@hampistays.com",
      name: "Super Admin",
      passwordHash: hashPassword("Admin@123"),
      role: Role.SUPER_ADMIN,
      isVerified: true,
    },
  });

  const owner1 = await db.user.create({
    data: {
      email: "owner@evolve.com",
      name: "Rajan Sharma",
      passwordHash: hashPassword("Owner@123"),
      role: Role.RESORT_OWNER,
      phone: "+91 98765 11111",
      isVerified: true,
    },
  });

  const owner2 = await db.user.create({
    data: {
      email: "owner@heritage.com",
      name: "Priya Nair",
      passwordHash: hashPassword("Owner@123"),
      role: Role.RESORT_OWNER,
      phone: "+91 98765 22222",
      isVerified: true,
    },
  });

  const traveller1 = await db.user.create({
    data: {
      email: "traveller@gmail.com",
      name: "Arjun Mehta",
      passwordHash: hashPassword("Travel@123"),
      role: Role.TRAVELLER,
      phone: "+91 98765 33333",
      isVerified: true,
    },
  });

  // ── Create Resorts ────────────────────────────────────────
  const resort1 = await db.resort.create({
    data: {
      name: "Evolve Back Kamalapura Palace",
      slug: "evolve-back-kamalapura",
      description:
        "An extraordinary luxury resort that draws on the ruins of the great Vijayanagara Empire for its inspiration. Nestled within the UNESCO World Heritage Site of Hampi, every detail is a tribute to the royal heritage.",
      shortDesc: "Luxury palace resort inside the UNESCO World Heritage Site.",
      location: "Kamalapura, Hampi",
      address: "Kamalapura Village, Hampi, Karnataka 583239",
      latitude: 15.3273,
      longitude: 76.4619,
      pricePerNight: 29000,
      maxGuests: 4,
      images: [
        "https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=2070",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
      ],
      amenities: ["Private Pool", "Spa", "Fine Dining", "Butler Service", "Heritage Tours"],
      status: ResortStatus.ACTIVE,
      isFeatured: true,
      commissionRate: 10, // Featured = 10%
      rating: 4.9,
      reviewCount: 124,
      ownerId: owner1.id,
    },
  });

  const resort2 = await db.resort.create({
    data: {
      name: "Heritage Resort Hampi",
      slug: "heritage-resort-hampi",
      description:
        "A serene eco-resort that celebrates the natural and cultural landscape of Hampi. Built with sustainable materials, it offers an authentic experience without compromising on comfort.",
      shortDesc: "Eco-friendly resort with guided heritage experiences.",
      location: "Hospet Road, Hampi",
      address: "Hospet Road, Near Virupaksha Temple, Hampi, Karnataka 583239",
      latitude: 15.335,
      longitude: 76.4602,
      pricePerNight: 18000,
      maxGuests: 3,
      images: [
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070",
      ],
      amenities: ["Eco-friendly", "Guided Tours", "Organic Food", "Yoga Deck"],
      status: ResortStatus.ACTIVE,
      isFeatured: false,
      commissionRate: 7,
      rating: 4.7,
      reviewCount: 89,
      ownerId: owner2.id,
    },
  });

  // ── Create a sample Booking ───────────────────────────────
  const checkIn = new Date("2025-06-15");
  const checkOut = new Date("2025-06-18");
  const nights = 3;
  const pricePerNight = resort1.pricePerNight;
  const subtotal = pricePerNight * nights;
  const commissionRate = resort1.commissionRate;
  const commissionAmount = (subtotal * commissionRate) / 100;

  await db.booking.create({
    data: {
      checkIn,
      checkOut,
      guests: 2,
      nights,
      pricePerNight,
      subtotal,
      commissionRate,
      commissionAmount,
      ownerEarnings: subtotal - commissionAmount,
      totalPrice: subtotal,
      status: "CONFIRMED",
      travellerId: traveller1.id,
      resortId: resort1.id,
    },
  });

  console.log("✅ Seed complete!");
  console.log(`   👤 Admin: admin@hampistays.com / Admin@123`);
  console.log(`   🏨 Owner 1: owner@evolve.com / Owner@123`);
  console.log(`   🏨 Owner 2: owner@heritage.com / Owner@123`);
  console.log(`   ✈️  Traveller: traveller@gmail.com / Travel@123`);
  console.log(`   🏝️  Resorts: ${resort1.name}, ${resort2.name}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
