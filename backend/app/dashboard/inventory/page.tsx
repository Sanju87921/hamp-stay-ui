import { auth } from "@/auth";
import { getOwnerResortsAction } from "@/actions/resorts";
import { redirect } from "next/navigation";
import { InventoryClient } from "./InventoryClient";

export default async function InventoryPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "RESORT_OWNER") {
    redirect("/dashboard");
  }

  const resorts = await getOwnerResortsAction(session.user.id);

  return <InventoryClient resorts={resorts} user={session.user} />;
}
