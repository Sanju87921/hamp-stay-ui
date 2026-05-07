"use client";

import React from "react";
import { 
  BarChart3, 
  Users, 
  Hotel, 
  CreditCard, 
  Activity, 
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Star
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { approveResortAction, rejectResortAction } from "@/actions/resorts";
import { useRouter } from "next/navigation";

interface AdminAnalyticsProps {
  stats: any;
  user: any;
}

export function AdminAnalytics({ stats, user }: AdminAnalyticsProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setLoadingId(id);
    try {
      const result = action === 'approve' 
        ? await approveResortAction(id) 
        : await rejectResortAction(id);
      
      if (result.success) {
        router.refresh();
      } else {
        alert(`Failed to ${action} resort`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-white uppercase">HampiStays_DevOS v1.2</span>
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-slate-400">
              ENVIRONMENT: PRODUCTION
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white leading-none">{user.name}</span>
              <span className="text-[10px] text-indigo-400 font-mono tracking-tighter">AUTHENTICATED: DEV_ROOT</span>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Ecosystem Intelligence</h1>
            <p className="text-slate-500 font-medium">Real-time telemetry and management controls.</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/admin-x7k/payouts"
              className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-sm font-bold text-indigo-400 hover:bg-indigo-600/20 transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Financial Controls
            </Link>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
              Export Logs
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Core Systems: Optimal
            </div>
          </div>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            label="Total Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={CreditCard} 
            color="text-emerald-400" 
            trend="+12.5%"
          />
          <StatCard 
            label="Total Registrations" 
            value={stats.totalUsers} 
            icon={Users} 
            color="text-indigo-400" 
            trend="+8.2%"
          />
          <StatCard 
            label="Partner Resorts" 
            value={stats.totalResorts} 
            icon={Hotel} 
            color="text-amber-400" 
            trend="+2"
          />
          <StatCard 
            label="Platform Rating" 
            value={`${stats.averageRating.toFixed(1)} ★`} 
            icon={Star} 
            color="text-sky-400" 
            trend="Stable"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Work Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Approvals */}
            <div className="bg-[#111114] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-amber-500" />
                  Property Verification Queue
                  {stats.pendingResorts.length > 0 && (
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20">
                      {stats.pendingResorts.length} URGENT
                    </span>
                  )}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/5">
                      <th className="px-6 py-4 font-bold">Property</th>
                      <th className="px-6 py-4 font-bold">Owner</th>
                      <th className="px-6 py-4 font-bold">Submitted</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.pendingResorts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                          No pending properties in verification queue.
                        </td>
                      </tr>
                    ) : (
                      stats.pendingResorts.map((resort: any) => (
                        <tr key={resort.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-white font-bold">{resort.name}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{resort.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-slate-300">{resort.owner?.name}</span>
                              <span className="text-[10px] text-slate-500">{resort.owner?.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                            {new Date(resort.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleAction(resort.id, 'reject')}
                                disabled={loadingId === resort.id}
                                className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => handleAction(resort.id, 'approve')}
                                disabled={loadingId === resort.id}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-1"
                              >
                                {loadingId === resort.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Approve Listing"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-[#111114] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Recent Operator Access
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/5">
                      <th className="px-6 py-4 font-bold">Identity</th>
                      <th className="px-6 py-4 font-bold">Access Level</th>
                      <th className="px-6 py-4 font-bold">Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.recentUsers.map((u: any, i: number) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{u.name || "Anonymous"}</span>
                            <span className="text-xs text-slate-500">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 border rounded text-[10px] font-mono ${
                            u.role === 'SUPER_ADMIN' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                            u.role === 'RESORT_OWNER' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                            'bg-white/5 border-white/10 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-xl font-bold text-white mb-4 relative z-10">Platform Resilience</h3>
              <p className="text-indigo-100 text-sm mb-6 relative z-10 leading-relaxed">
                Automated neural backups are synced across all nodes. Last verification: T-04:22:11.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all active:scale-95 relative z-10">
                Trigger Manual Sync
              </button>
            </div>

            <div className="bg-[#111114] border border-white/5 rounded-3xl p-6 shadow-2xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                Resource Distribution
              </h3>
              <div className="space-y-5">
                {stats.resortTypes.map((type: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                      <span className="text-slate-500">{type.type}</span>
                      <span className="text-slate-300">{type._count}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                        style={{ width: `${(type._count / stats.totalResorts) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}

function StatCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-[#111114] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all hover:bg-white/[0.01] group shadow-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-white/5 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </div>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}
