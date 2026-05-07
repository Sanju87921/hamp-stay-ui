import { auth } from "@/auth";
import { DashboardLayout } from "../DashboardLayout";
import { redirect } from "next/navigation";
import { getOwnerAnalyticsAction } from "@/actions/analytics";
import { OwnerAnalytics } from "@/components/dashboard/OwnerAnalytics";
import { Calendar } from "lucide-react";

export default async function EarningsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RESORT_OWNER") {
    redirect("/dashboard");
  }

  const analyticsData = await getOwnerAnalyticsAction();

  return (
    <DashboardLayout role="RESORT_OWNER" user={session.user}>
      <div className="max-w-6xl pb-20">
        <header className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-950 mb-2">Financial Intelligence</h1>
          <p className="text-navy-950/50">Strategic overview of your HampiStays portfolio revenue and performance.</p>
        </header>

        {analyticsData ? (
          <OwnerAnalytics data={analyticsData} />
        ) : (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-sand-300 text-center">
            <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-sand-400" />
            </div>
            <h2 className="text-xl font-serif font-bold text-navy-950 mb-2">Awaiting Data</h2>
            <p className="text-navy-950/50 max-w-md mx-auto">Analytics will appear here once you receive your first confirmed booking.</p>
          </div>
        )}

        {/* Payout Table Section */}
        <div className="mt-12 bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-sand-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-serif font-bold text-navy-950">Payout Log</h2>
              <p className="text-xs text-navy-950/40">History of transfers to your bank account.</p>
            </div>
            <button className="px-4 py-2 border border-sand-200 rounded-full text-[10px] font-bold text-navy-950/60 uppercase tracking-widest hover:bg-sand-50 transition-colors">
              Export Statement
            </button>
          </div>
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-sand-400" />
            </div>
            <p className="text-sm text-navy-950/40 italic">No payout records found in your account.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
