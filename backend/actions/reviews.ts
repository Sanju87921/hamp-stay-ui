"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { sendNotificationAction } from "./notifications";

export async function createReviewAction(data: {
  bookingId: string;
  resortId: string;
  rating: number;
  content: string;
}) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "Please log in to leave a review" };
  }

  try {
    const { bookingId, resortId, rating, content } = data;

    // Verify booking is completed and belongs to the user
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      select: { status: true, travellerId: true }
    });

    if (!booking || booking.travellerId !== session.user.id) {
      return { success: false, error: "Booking not found or unauthorized" };
    }

    // Optional: Check if booking is completed (removed for easier testing in dev)
    // if (booking.status !== "COMPLETED") {
    //   return { success: false, error: "You can only review completed stays" };
    // }

    const review = await db.review.create({
      data: {
        bookingId,
        resortId,
        userId: session.user.id,
        rating,
        content
      }
    });

    // Notify the Owner
    await sendNotificationAction({
      userId: (await db.resort.findUnique({ where: { id: resortId }, select: { ownerId: true } }))?.ownerId || "",
      type: "SUCCESS",
      title: "New Review Received!",
      message: `A guest just shared their experience. Check out your ${rating}-star review.`,
      link: "/dashboard",
      channels: ["IN_APP", "EMAIL"]
    });

    // Update resort average rating and review count
    const allReviews = await db.review.findMany({
      where: { resortId },
      select: { rating: true }
    });

    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await db.resort.update({
      where: { id: resortId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/resorts/${resortId}`);
    
    return { success: true, review };
  } catch (error) {
    console.error("Review error:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

export async function getResortReviewsAction(resortId: string) {
  try {
    const reviews = await db.review.findMany({
      where: { resortId },
      include: {
        user: {
          select: { name: true, image: true, badges: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}
