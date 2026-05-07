"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendNotificationAction } from "./notifications";

export async function createBookingAction(data: {
  resortId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
}) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "Please log in to book" };
  }

  try {
    const { resortId, checkIn, checkOut, guests, nights, pricePerNight } = data;
    
    const subtotal = pricePerNight * nights;
    const commissionRate = 15; // 15% platform fee
    const commissionAmount = (subtotal * commissionRate) / 100;
    const ownerEarnings = subtotal - commissionAmount;

    const booking = await db.booking.create({
      data: {
        resortId,
        travellerId: session.user.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        nights,
        pricePerNight,
        subtotal,
        commissionRate,
        commissionAmount,
        ownerEarnings,
        totalPrice: subtotal, // In this model, subtotal is what traveller pays
        status: "PENDING",
      },
    });

    // Notify the Owner
    const resort = await db.resort.findUnique({
      where: { id: resortId },
      select: { ownerId: true, name: true }
    });

    if (resort) {
      await sendNotificationAction({
        userId: resort.ownerId,
        type: "BOOKING",
        title: "New Booking Received!",
        message: `You have a new reservation request for ${resort.name}.`,
        link: "/dashboard",
        channels: ["IN_APP", "EMAIL", "WHATSAPP"]
      });
    }

    revalidatePath("/dashboard");
    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function getTravellerBookingsAction() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const userId = session.user.id;
    const bookings = await db.booking.findMany({
      where: { travellerId: userId },
      include: {
        resort: {
          select: { name: true, images: true, location: true }
        }
      },
      orderBy: { checkIn: 'desc' }
    });
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function cancelBookingAction(bookingId: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { resort: { select: { ownerId: true, name: true } } }
    });

    if (!booking) return { success: false, error: "Booking not found" };
    if (booking.travellerId !== session.user.id && booking.resort.ownerId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await db.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    });

    // Notify other party
    const targetUserId = session.user.id === booking.travellerId ? booking.resort.ownerId : booking.travellerId;
    const initiator = session.user.id === booking.travellerId ? "The guest" : "The resort owner";

    await sendNotificationAction({
      userId: targetUserId,
      type: "WARNING",
      title: "Booking Cancelled",
      message: `${initiator} has cancelled the reservation for ${booking.resort.name}.`,
      channels: ["IN_APP", "EMAIL"]
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Cancellation error:", error);
    return { success: false, error: "Failed to cancel booking" };
  }
}
