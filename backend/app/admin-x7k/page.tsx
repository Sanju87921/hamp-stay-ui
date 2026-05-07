import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminAnalytics } from "./AdminAnalytics";
import { db } from "@/lib/db";

export default async function AdminPage() {
  const session = await auth();

  // Strict role check for the hidden portal
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Fetch platform-wide stats for the developer
  const stats = {
    totalUsers: await db.user.count(),
    totalResorts: await db.resort.count(),
    activeBookings: await db.booking.count({ where: { status: "CONFIRMED" } }),
    totalRevenue: await db.booking.aggregate({
      _sum: { totalPrice: true },
    }).then(res => res._sum.totalPrice || 0),
    resortTypes: await db.resort.groupBy({
      by: ['type'],
      _count: true,
    }),
    recentUsers: await db.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { name: true, email: true, role: true, createdAt: true }
    }),
    averageRating: await db.resort.aggregate({
      _avg: { rating: true }
    }).then(res => res._avg.rating || 0),
    pendingResorts: await db.resort.findMany({
      where: { status: "DRAFT" },
      include: { owner: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    }),
  };

  return <AdminAnalytics stats={stats} user={session.user} />;
}
