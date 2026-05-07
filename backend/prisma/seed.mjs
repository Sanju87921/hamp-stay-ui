/**
 * prisma/seed.mjs — Sample data for local development
 * Run: node prisma/seed.mjs
 */

import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const db = new PrismaClient();

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data (safe order — respect FK constraints)
  await db.review.deleteMany();
  await db.payment.deleteMany();
  await db.booking.deleteMany();
  await db.availability.deleteMany();
  await db.resort.deleteMany();
  await db.user.deleteMany();

  // ── Users ──────────────────────────────────────────────────
  const admin = await db.user.create({
    data: {
      email: "admin@hampistays.com",
      name: "Super Admin",
      passwordHash: hashPassword("Admin@123"),
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });

  const owner1 = await db.user.create({
    data: {
      email: "owner@evolve.com",
      name: "Rajan Sharma",
      passwordHash: hashPassword("Owner@123"),
      role: "RESORT_OWNER",
      phone: "+91 98765 11111",
      isVerified: true,
    },
  });

  const owner2 = await db.user.create({
    data: {
      email: "owner@heritage.com",
      name: "Priya Nair",
      passwordHash: hashPassword("Owner@123"),
      role: "RESORT_OWNER",
      phone: "+91 98765 22222",
      isVerified: true,
    },
  });

  const traveller = await db.user.create({
    data: {
      email: "traveller@gmail.com",
      name: "Arjun Mehta",
      passwordHash: hashPassword("Travel@123"),
      role: "TRAVELLER",
      phone: "+91 98765 33333",
      isVerified: true,
    },
  });

  console.log(`   ✅ 4 users created`);

  // ── Resorts ────────────────────────────────────────────────
  const resort1 = await db.resort.create({
    data: {
      name: "Evolve Back Kamalapura Palace",
      slug: "evolve-back-kamalapura",
      description: "An extraordinary luxury resort drawing on the ruins of the great Vijayanagara Empire. Nestled within the UNESCO World Heritage Site of Hampi.",
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
      status: "ACTIVE",
      isFeatured: true,
      commissionRate: 10,
      rating: 4.9,
      reviewCount: 124,
      ownerId: owner1.id,
    },
  });

  const resort2 = await db.resort.create({
    data: {
      name: "Heritage Resort Hampi",
      slug: "heritage-resort-hampi",
      description: "A serene eco-resort celebrating the natural and cultural landscape of Hampi. Built with sustainable materials for authentic experiences.",
      shortDesc: "Eco-friendly resort with guided heritage experiences.",
      location: "Hospet Road, Hampi",
      address: "Hospet Road, Near Virupaksha Temple, Hampi, Karnataka 583239",
      latitude: 15.335,
      longitude: 76.4602,
      pricePerNight: 18000,
      maxGuests: 3,
      images: ["https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070"],
      amenities: ["Eco-friendly", "Guided Tours", "Organic Food", "Yoga Deck"],
      status: "ACTIVE",
      isFeatured: false,
      commissionRate: 7,
      rating: 4.7,
      reviewCount: 89,
      ownerId: owner2.id,
    },
  });

  console.log(`   ✅ 2 resorts created`);

  // ── Booking with commission math ───────────────────────────
  const nights = 3;
  const pricePerNight = resort1.pricePerNight;
  const subtotal = pricePerNight * nights;            // ₹87,000
  const commissionRate = resort1.commissionRate;       // 10%
  const commissionAmount = (subtotal * commissionRate) / 100; // ₹8,700
  const ownerEarnings = subtotal - commissionAmount;   // ₹78,300

  const booking = await db.booking.create({
    data: {
      checkIn: new Date("2025-06-15"),
      checkOut: new Date("2025-06-18"),
      guests: 2,
      nights,
      pricePerNight,
      subtotal,
      commissionRate,
      commissionAmount,
      ownerEarnings,
      totalPrice: subtotal,
      status: "CONFIRMED",
      travellerId: traveller.id,
      resortId: resort1.id,
    },
  });

  console.log(`   ✅ 1 booking created`);
  console.log(`      Stay: ${nights} nights @ ₹${pricePerNight.toLocaleString("en-IN")}/night`);
  console.log(`      Total: ₹${booking.totalPrice.toLocaleString("en-IN")}`);
  console.log(`      Platform commission (${commissionRate}%): ₹${commissionAmount.toLocaleString("en-IN")}`);
  console.log(`      Owner earns: ₹${ownerEarnings.toLocaleString("en-IN")}`);

  // ── Final count ────────────────────────────────────────────
  const counts = {
    users: await db.user.count(),
    resorts: await db.resort.count(),
    bookings: await db.booking.count(),
  };

  console.log(`\n✅ Seed complete! DB has: ${counts.users} users | ${counts.resorts} resorts | ${counts.bookings} bookings`);
  console.log(`\n   🔑 Test credentials:`);
  console.log(`   Admin      → admin@hampistays.com   /  Admin@123`);
  console.log(`   Owner 1    → owner@evolve.com       /  Owner@123`);
  console.log(`   Owner 2    → owner@heritage.com     /  Owner@123`);
  console.log(`   Traveller  → traveller@gmail.com    /  Travel@123`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
