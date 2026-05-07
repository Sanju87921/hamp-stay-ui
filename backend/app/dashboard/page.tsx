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

  if (role === "RESORT_OWNER") {
    const { getOwnerResortsAction } = await import("@/actions/resorts");
    const resorts = await getOwnerResortsAction(session.user.id);
    return <OwnerView user={session.user} initialResorts={resorts} />;
  }

  // Default to Traveller view
  const { getTravellerBookingsAction } = await import("@/actions/bookings");
  const bookings = await getTravellerBookingsAction();
  return <TravellerView user={session.user} initialBookings={bookings} />;
}
