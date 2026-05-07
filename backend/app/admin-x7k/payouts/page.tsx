import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPendingPayoutsAction } from "@/actions/payments";
import { PayoutsClient } from "./PayoutsClient";

export default async function PayoutsPage() {
  const session = await auth();

  // Strict role check
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const result = await getPendingPayoutsAction();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-slate-500 mb-8">{result.error || "You do not have permission to access this page."}</p>
          <a href="/admin-x7k" className="px-6 py-3 bg-indigo-600 rounded-xl font-bold">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  return <PayoutsClient pendingPayouts={result.data || []} />;
}

export const metadata = {
  title: "Payout Management | HampiStays DevOS",
  description: "Manual payout management for HampiStays Super Admin.",
};
