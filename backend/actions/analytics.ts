"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { startOfMonth, endOfMonth, subMonths, format, startOfToday } from "date-fns";

export async function getOwnerAnalyticsAction() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RESORT_OWNER") return null;

  try {
    const ownerId = session.user.id;
    const now = new Date();
    
    // 1. Fetch all resorts and bookings for the last 6 months
    const sixMonthsAgo = subMonths(now, 6);

    const resorts = await db.resort.findMany({
      where: { ownerId },
      include: {
        bookings: {
          where: {
            createdAt: { gte: sixMonthsAgo },
            status: { in: ["CONFIRMED", "COMPLETED"] }
          }
        }
      }
    });

    // 2. Aggregate Revenue by Month
    const monthlyData: Record<string, { month: string, revenue: number, bookings: number }> = {};
    
    for (let i = 0; i <= 5; i++) {
      const monthDate = subMonths(now, i);
      const monthKey = format(monthDate, "MMM yyyy");
      monthlyData[monthKey] = { month: monthKey, revenue: 0, bookings: 0 };
    }

    resorts.forEach(resort => {
      resort.bookings.forEach(booking => {
        const monthKey = format(new Date(booking.createdAt), "MMM yyyy");
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].revenue += booking.ownerEarnings;
          monthlyData[monthKey].bookings += 1;
        }
      });
    });

    // Convert to sorted array for charts
    const revenueChart = Object.values(monthlyData).reverse();

    // 3. Property Performance
    const propertyPerformance = resorts.map(resort => ({
      name: resort.name,
      revenue: resort.bookings.reduce((sum, b) => sum + b.ownerEarnings, 0),
      bookings: resort.bookings.length,
      rating: resort.rating
    })).sort((a, b) => b.revenue - a.revenue);

    // 4. Summary Metrics
    const totalRevenue = resorts.reduce((sum, r) => 
      sum + r.bookings.reduce((bSum, b) => bSum + b.ownerEarnings, 0), 0
    );
    const totalBookings = resorts.reduce((sum, r) => sum + r.bookings.length, 0);
    
    // 5. Today's Status
    const today = startOfToday();
    const activeStays = await db.booking.count({
      where: {
        resort: { ownerId },
        status: "CONFIRMED",
        checkIn: { lte: now },
        checkOut: { gte: now }
      }
    });

    return {
      revenueChart,
      propertyPerformance,
      metrics: {
        totalRevenue,
        totalBookings,
        activeStays,
        resortCount: resorts.length
      }
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}
