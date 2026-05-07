"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { sendNotificationAction } from "./notifications";
import { revalidatePath } from "next/cache";

export async function createIssueAction(data: {
  title: string;
  description: string;
  resortId?: string;
  bookingId?: string;
}) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const issue = await db.issue.create({
      data: {
        ...data,
        userId: session.user.id,
        status: "OPEN"
      }
    });

    // 1. Notify Super Admin (DevOS)
    const admins = await db.user.findMany({
      where: { role: "SUPER_ADMIN" },
      select: { id: true }
    });

    for (const admin of admins) {
      await sendNotificationAction({
        userId: admin.id,
        type: "ERROR",
        title: "New Support Ticket",
        message: `Issue reported: ${data.title}`,
        link: "/admin-x7k/support",
        channels: ["IN_APP", "EMAIL"]
      });
    }

    // 2. Notify Resort Owner (if applicable)
    if (data.resortId) {
      const resort = await db.resort.findUnique({
        where: { id: data.resortId },
        select: { ownerId: true, name: true }
      });

      if (resort) {
        await sendNotificationAction({
          userId: resort.ownerId,
          type: "WARNING",
          title: "Guest Reported an Issue",
          message: `A guest reported a problem with ${resort.name}: ${data.title}`,
          link: "/dashboard",
          channels: ["IN_APP", "EMAIL", "WHATSAPP"]
        });
      }
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating issue:", error);
    return { success: false, error: "Failed to create support ticket" };
  }
}

export async function getIssuesAction() {
  const session = await auth();
  if (!session?.user) return [];

  try {
    const where: any = {};
    if (session.user.role === "TRAVELLER") where.userId = session.user.id;
    if (session.user.role === "RESORT_OWNER") where.resort = { ownerId: session.user.id };

    const issues = await db.issue.findMany({
      where,
      include: {
        resort: { select: { name: true } },
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return issues;
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
}
