"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function register(formData: any) {
  const { name, email, password, role } = formData;

  if (!name || !email || !password || !role) {
    return { error: "Missing fields" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const prismaRole = role === "owner" ? "RESORT_OWNER" : "TRAVELLER";

    await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: prismaRole,
      },
    });

    // Auto sign in after registration
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (error: any) {
    // If it's a redirect error, let Next.js handle it
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Registration error on server:", error);
    return { error: "Something went wrong during registration." };
  }
}

export async function login(formData: any) {
  const { email, password } = formData;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error("Auth error in login action:", error.type, error.message);
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    // If it's a redirect error, let Next.js handle it
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Unexpected error in login action:", error);
    return { error: "Something went wrong." };
  }
}
