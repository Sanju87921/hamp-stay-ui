import { auth } from "@/auth";
import { getOwnerResortsAction } from "@/actions/resorts";
import { redirect } from "next/navigation";
import { InventoryClient } from "./InventoryClient";

import { db } from "@/lib/db";

export default async function InventoryPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "RESORT_OWNER") {
    redirect("/dashboard");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  const resorts = await getOwnerResortsAction(session.user.id);

  return <InventoryClient resorts={resorts} user={user as any} />;
}
