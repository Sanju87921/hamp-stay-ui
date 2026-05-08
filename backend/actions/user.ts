"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfileAction(data: {
  name?: string;
  phone?: string;
  avatar?: string;
}) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
      }
    });

    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/settings");
    
    return { 
      success: true, 
      user: {
        name: updatedUser.name,
      } 
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function changePasswordAction(data: {
  currentPassword?: string;
  newPassword?: string;
}) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || !user.passwordHash) {
      return { success: false, error: "User not found or using OAuth" };
    }

    // Secure comparison
    const isValid = await bcrypt.compare(data.currentPassword || "", user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Current password incorrect" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword || "", 12);

    await db.user.update({
      where: { id: session.user.id },
      data: { passwordHash: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Failed to change password" };
  }
}
