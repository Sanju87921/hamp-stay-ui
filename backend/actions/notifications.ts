"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "BOOKING" | "PAYMENT" | "SYSTEM";

export async function sendNotificationAction({
  userId,
  type,
  title,
  message,
  link,
  channels = ["IN_APP"]
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  channels?: ("IN_APP" | "EMAIL" | "WHATSAPP")[];
}) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true }
    });

    if (!user) return { success: false, error: "User not found" };

    // 1. In-App Notification
    if (channels.includes("IN_APP")) {
      await db.notification.create({
        data: { userId, type, title, message, link }
      });
    }

    // 2. Email (Stub for Resend)
    if (channels.includes("EMAIL")) {
      console.log(`[EMAIL] Sending to ${user.email}: ${title} - ${message}`);
      // await resend.emails.send({ ... })
    }

    // 3. WhatsApp (Stub for Interakt/Twilio)
    if (channels.includes("WHATSAPP") && user.phone) {
      console.log(`[WHATSAPP] Sending to ${user.phone}: ${title} - ${message}`);
      // await whatsappProvider.send({ ... })
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

export async function getNotificationsAction() {
  const session = await auth();
  if (!session?.user) return [];

  try {
    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationAsReadAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const notification = await db.notification.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!notification || notification.userId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db.notification.update({
      where: { id },
      data: { isRead: true }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false };
  }
}

export async function markAllAsReadAction() {
  const session = await auth();
  if (!session?.user) return { success: false };

  try {
    await db.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error marking all as read:", error);
    return { success: false };
  }
}
