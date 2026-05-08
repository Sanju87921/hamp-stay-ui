"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { encrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

export async function submitVerificationAction(data: {
  panNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  gstNumber?: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "RESORT_OWNER") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Encrypt all sensitive fields
    const encryptedData = {
      panNumber: encrypt(data.panNumber),
      bankName: encrypt(data.bankName),
      accountNumber: encrypt(data.accountNumber),
      ifscCode: encrypt(data.ifscCode),
      gstNumber: data.gstNumber ? encrypt(data.gstNumber) : null,
    };

    await db.ownerProfile.upsert({
      where: { userId: session.user.id },
      update: {
        ...encryptedData,
        status: "PENDING",
      },
      create: {
        userId: session.user.id,
        ...encryptedData,
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error submitting verification:", error);
    return { success: false, error: "Failed to submit verification" };
  }
}

export async function getOwnerProfileAction() {
  const session = await auth();
  if (!session?.user) return null;

  try {
    const profile = await db.ownerProfile.findUnique({
      where: { userId: session.user.id },
    });
    return profile;
  } catch (error) {
    console.error("Error fetching owner profile:", error);
    return null;
  }
}
