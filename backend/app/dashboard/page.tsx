import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TravellerView } from "./TravellerView";
import { OwnerView } from "./OwnerView";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  // Role-based Gateway Redirection
  if (role === "SUPER_ADMIN") {
    redirect("/admin-x7k");
  }

  if (role === "RESORT_OWNER") {
    redirect("/dashboard/resorts");
  }

  // Default: Travellers go straight to browsing resorts
  redirect("/resorts");
}
