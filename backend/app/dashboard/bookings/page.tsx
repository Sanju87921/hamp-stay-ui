import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TravellerView } from "../TravellerView";
import { getTravellerBookingsAction } from "@/actions/bookings";

export default async function BookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "RESORT_OWNER") {
    redirect("/dashboard/resorts");
  }

  const bookings = await getTravellerBookingsAction();
  return <TravellerView user={session.user} initialBookings={bookings} />;
}
