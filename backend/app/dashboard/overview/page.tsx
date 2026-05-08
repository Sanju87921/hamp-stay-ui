import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { OwnerView } from "../OwnerView";
import { getOwnerResortsAction } from "@/actions/resorts";

export default async function OwnerOverviewPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "RESORT_OWNER") {
    redirect("/dashboard/bookings");
  }

  const resorts = await getOwnerResortsAction(session.user.id);
  return <OwnerView user={session.user} initialResorts={resorts} />;
}
