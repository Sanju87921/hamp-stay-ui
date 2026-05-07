"use client";

import React from "react";
import { 
  ArrowLeft, 
  CreditCard, 
  Search, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Loader2,
  Banknote
} from "lucide-react";
import Link from "next/link";
import { markPayoutAsSentAction } from "@/actions/payments";
import { useRouter } from "next/navigation";

interface PayoutsClientProps {
  pendingPayouts: any[];
}

export function PayoutsClient({ pendingPayouts }: PayoutsClientProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("");

  const filtered = pendingPayouts.filter(p => 
    p.booking.resort.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.booking.resort.owner.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleMarkAsSent = async (paymentId: string) => {
    const reference = window.prompt("Enter Bank Transfer / UPI Reference ID:");
    if (!reference) return;

    setLoadingId(paymentId);
    try {
      const result = await markPayoutAsSentAction({
        paymentId,
        payoutReference: reference,
        payoutDate: new Date().toISOString(),
      });
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while marking payout as sent.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin-x7k" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <Banknote className="w-5 h-5 text-indigo-500" />
              <span className="font-bold tracking-tight text-white uppercase">Payout Management</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Manual Payouts</h1>
          <p className="text-slate-500 font-medium">Record and manage bank transfers to resort owners.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111114] border border-white/5 p-6 rounded-3xl shadow-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Pending</p>
            <p className="text-3xl font-bold text-white">₹{pendingPayouts.reduce((acc, curr) => acc + curr.payoutAmount, 0).toLocaleString()}</p>
          </div>
          <div className="bg-[#111114] border border-white/5 p-6 rounded-3xl shadow-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Items in Queue</p>
            <p className="text-3xl font-bold text-white">{pendingPayouts.length}</p>
          </div>
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl shadow-2xl">
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Platform Status</p>
            <p className="text-3xl font-bold text-indigo-400">OPERATIONAL</p>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-[#111114] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Pending Transfers
            </h3>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search resort or owner..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-white/5">
                  <th className="px-6 py-4 font-bold">Resort / Owner</th>
                  <th className="px-6 py-4 font-bold">Booking Details</th>
                  <th className="px-6 py-4 font-bold">Payout Amount</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                      No pending payouts matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{payment.booking.resort.name}</span>
                          <span className="text-xs text-slate-500">{payment.booking.resort.owner.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-300">₹{payment.amount.toLocaleString()} Total</span>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {payment.booking.id.slice(0,8)}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-white font-mono font-bold text-base">₹{payment.payoutAmount.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleMarkAsSent(payment.id)}
                          disabled={loadingId === payment.id}
                          className="px-4 py-2 rounded-xl bg-white text-navy-950 text-xs font-bold hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 ml-auto shadow-lg shadow-white/5"
                        >
                          {loadingId === payment.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Mark as Sent
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          <span>Manual Payout Engine v1.0.0</span>
          <span>Security Protocol: RSA-4096 Signed</span>
        </div>
      </main>
    </div>
  );
}
