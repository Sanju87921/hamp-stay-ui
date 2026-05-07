import { PrismaClient, Prisma } from "@prisma/client";
import { RESORTS } from "../lib/data/resorts";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // 1. Create a default owner/admin
  const adminEmail = "admin@hampistays.com";
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "HampiStays Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });

  console.log(`Admin created: ${admin.email}`);

  // 2. Clear existing resorts and room types (though db push --force-reset already did this)
  // 3. Seed Resorts
  for (const resortData of RESORTS) {
    const { roomTypes, ...resortFields } = resortData;

    const resort = await prisma.resort.upsert({
      where: { slug: resortFields.slug },
      update: {},
      create: {
        id: resortFields.id,
        name: resortFields.name,
        slug: resortFields.slug,
        tagline: resortFields.tagline,
        description: resortFields.description,
        type: resortFields.type,
        location: resortFields.location as unknown as Prisma.InputJsonValue,
        pricePerNight: resortFields.pricePerNight,
        images: resortFields.images,
        amenities: resortFields.amenities,
        policies: resortFields.policies as unknown as Prisma.InputJsonValue,
        nearbyAttractions: resortFields.nearbyAttractions as unknown as Prisma.InputJsonValue,
        status: "ACTIVE",
        isFeatured: resortFields.isFeatured,
        isVerified: resortFields.isVerified,
        rating: resortFields.rating,
        reviewCount: resortFields.reviewCount,
        ownerId: admin.id,
        roomTypes: {
          create: roomTypes.map((rt) => ({
            id: rt.id,
            name: rt.name,
            description: rt.description,
            pricePerNight: rt.pricePerNight,
            capacity: rt.capacity,
            amenities: rt.amenities,
            images: rt.images,
            availableCount: rt.availableCount,
          })),
        },
      },
    });

    console.log(`Seeded resort: ${resort.name}`);
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
