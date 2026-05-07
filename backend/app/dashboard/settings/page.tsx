import { auth } from "@/auth";
import { DashboardLayout } from "../DashboardLayout";
import { SettingsClient } from "./SettingsClient";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  return (
    <DashboardLayout role={session.user.role} user={session.user}>
      <div className="pb-20">
        <header className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-950 mb-2">Account Control</h1>
          <p className="text-navy-950/50">Manage your personal information and security preferences.</p>
        </header>
        
        {user && <SettingsClient user={user} />}
      </div>
    </DashboardLayout>
  );
}
