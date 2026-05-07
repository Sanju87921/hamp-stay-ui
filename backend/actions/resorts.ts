"use server";

import { db } from "@/lib/db";
import type { Resort, FilterState, SortOption, SearchParams } from "@/types/resort";
import { sendNotificationAction } from "./notifications";
import { revalidatePath } from "next/cache";

export async function getResortsAction(options: {
  search?: Partial<SearchParams>;
  filters?: Partial<FilterState>;
  sort?: SortOption;
} = {}) {
  try {
    const { search, filters, sort = "popularity" } = options;

    // Build the "where" clause for Prisma
    const where: any = {
      status: "ACTIVE",
    };

    if (search?.location) {
      where.OR = [
        { name: { contains: search.location, mode: "insensitive" } },
        {
          location: {
            path: ["area"],
            string_contains: search.location,
          },
        },
      ];
    }

    if (filters?.types && filters.types.length > 0) {
      where.type = { in: filters.types };
    }

    if (filters?.minRating) {
      where.rating = { gte: filters.minRating };
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.pricePerNight = {
        gte: filters.minPrice ?? 0,
        lte: filters.maxPrice ?? 1000000,
      };
    }

    if (filters?.amenities && filters.amenities.length > 0) {
      where.amenities = { hasEvery: filters.amenities };
    }

    // Availability Filtering
    if (search?.checkIn && search?.checkOut) {
      const start = new Date(search.checkIn);
      const end = new Date(search.checkOut);
      
      // Find resorts that are BLOCKED during this range
      const blockedResorts = await db.availability.findMany({
        where: {
          isBlocked: true,
          date: {
            gte: start,
            lte: end
          }
        },
        select: { resortId: true }
      });

      const blockedIds = Array.from(new Set(blockedResorts.map(b => b.resortId)));
      
      if (blockedIds.length > 0) {
        where.id = { ...((where.id as Record<string, unknown>) || {}), notIn: blockedIds };
      }
    }

    // Sorting
    let orderBy: any = { reviewCount: "desc" };
    if (sort === "price_asc") orderBy = { pricePerNight: "asc" };
    if (sort === "price_desc") orderBy = { pricePerNight: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    const resorts = await db.resort.findMany({
      where,
      orderBy,
      include: {
        roomTypes: true,
      },
    });

    return {
      resorts: resorts as unknown as Resort[],
      total: resorts.length,
      maxPrice: 60000, // Placeholder or calculate from DB
    };
  } catch (error) {
    console.error("Error fetching resorts:", error);
    return { resorts: [], total: 0, maxPrice: 60000 };
  }
}

export async function getResortBySlugAction(slug: string) {
  try {
    const resort = await db.resort.findUnique({
      where: { slug },
      include: {
        roomTypes: true,
      },
    });
    return resort as unknown as Resort | null;
  } catch (error) {
    console.error("Error fetching resort by slug:", error);
    return null;
  }
}

export async function getResortsByIdsAction(ids: string[]) {
  try {
    const resorts = await db.resort.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        roomTypes: true,
      },
    });
    // Sort to match the order of IDs passed
    return ids
      .map((id) => resorts.find((r) => r.id === id))
      .filter(Boolean) as unknown as Resort[];
  } catch (error) {
    console.error("Error fetching resorts by IDs:", error);
    return [];
  }
}

export async function createResortAction(data: any) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const ownerId = session.user.id;
    const { roomTypes, ...resortData } = data;
    
    // Create slug from name
    const slug = resortData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const resort = await db.resort.create({
      data: {
        ...resortData,
        slug,
        ownerId,
        status: "DRAFT",
        roomTypes: {
          create: roomTypes
        }
      },
      include: {
        roomTypes: true
      }
    });

    return { success: true, resort };
  } catch (error) {
    console.error("Error creating resort:", error);
    return { success: false, error: "Failed to create resort" };
  }
}

export async function getOwnerResortsAction(ownerId: string) {
  try {
    const resorts = await db.resort.findMany({
      where: { ownerId },
      include: {
        roomTypes: true,
        bookings: {
          where: { status: "CONFIRMED" }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return resorts;
  } catch (error) {
    console.error("Error fetching owner resorts:", error);
    return [];
  }
}

export async function approveResortAction(resortId: string) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized. Admin only." };
  }

  try {
    const resort = await db.resort.update({
      where: { id: resortId },
      data: { 
        status: "ACTIVE",
        isVerified: true
      }
    });

    // Notify the Owner
    await sendNotificationAction({
      userId: resort.ownerId,
      type: "SUCCESS",
      title: "Property Approved!",
      message: `Congratulations! ${resort.name} is now live and verified on HampiStays.`,
      link: "/dashboard/resorts",
      channels: ["IN_APP", "EMAIL", "WHATSAPP"]
    });

    return { success: true, resort };
  } catch (error) {
    console.error("Error approving resort:", error);
    return { success: false, error: "Failed to approve resort" };
  }
}

export async function rejectResortAction(resortId: string) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    return { success: false, error: "Unauthorized. Admin only." };
  }

  try {
    const resort = await db.resort.update({
      where: { id: resortId },
      data: { status: "SUSPENDED" }
    });

    // Notify the Owner
    await sendNotificationAction({
      userId: resort.ownerId,
      type: "WARNING",
      title: "Property Action Required",
      message: `Your listing for ${resort.name} has been suspended. Please check your email for details.`,
      link: "/dashboard/resorts",
      channels: ["IN_APP", "EMAIL"]
    });

    return { success: true, resort };
  } catch (error) {
    console.error("Error rejecting resort:", error);
    return { success: false, error: "Failed to reject resort" };
  }
}

export async function toggleAvailabilityAction(resortId: string, date: string, isBlocked: boolean, reason?: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    // Ownership check
    const resort = await db.resort.findUnique({
      where: { id: resortId },
      select: { ownerId: true }
    });

    if (!resort || resort.ownerId !== session.user.id) {
      return { success: false, error: "Unauthorized. You do not own this resort." };
    }

    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    if (isBlocked) {
      await db.availability.upsert({
        where: {
          resortId_date: {
            resortId,
            date: formattedDate
          }
        },
        update: { isBlocked: true, reason },
        create: {
          resortId,
          date: formattedDate,
          isBlocked: true,
          reason
        }
      });
    } else {
      await db.availability.delete({
        where: {
          resortId_date: {
            resortId,
            date: formattedDate
          }
        }
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error toggling availability:", error);
    return { success: false, error: "Failed to update availability" };
  }
}

export async function getResortAvailabilityAction(resortId: string) {
  try {
    const availability = await db.availability.findMany({
      where: { resortId, isBlocked: true },
      select: { date: true, reason: true }
    });
    return availability;
  } catch (error) {
    console.error("Error fetching availability:", error);
    return [];
  }
}
