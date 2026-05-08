"use client";

import { useState } from "react";
import { Shield, CreditCard, Building2, Landmark, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { submitVerificationAction } from "@/actions/owner";

interface VerificationClientProps {
  initialStatus: "NOT_SUBMITTED" | "PENDING" | "VERIFIED" | "REJECTED";
  adminNotes?: string | null;
}

export function VerificationClient({ initialStatus, adminNotes }: VerificationClientProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    panNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    gstNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitVerificationAction(formData);

    if (result.success) {
      setSuccess(true);
      setStatus("PENDING");
    } else {
      setError(result.error || "Failed to submit verification");
    }
    setLoading(false);
  };

  if (status === "VERIFIED") {
    return (
      <div className="bg-white rounded-3xl border border-sand-200 p-12 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-navy-950 mb-2">Verified Partner</h2>
        <p className="text-navy-950/50 max-w-md mx-auto mb-8">
          Your identity and financial details have been verified. You can now receive payouts directly to your bank account.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">
          Status: Verified
        </div>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="bg-white rounded-3xl border border-sand-200 p-12 text-center">
        <div className="w-20 h-20 bg-gold-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-gold-600" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-navy-950 mb-2">Verification Pending</h2>
        <p className="text-navy-950/50 max-w-md mx-auto mb-8">
          Our compliance team is currently reviewing your documents. This usually takes 24-48 hours.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-700 rounded-full text-xs font-bold uppercase tracking-widest">
          Status: Under Review
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden">
      <div className="p-8 border-b border-sand-100 bg-sand-50/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-navy-950 rounded-2xl flex items-center justify-center text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-navy-950">Identity & Payouts</h2>
            <p className="text-xs text-navy-950/50">Complete your verification to start hosting at HampiStays.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {status === "REJECTED" && (
          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Verification Rejected
            </h3>
            <p className="text-xs text-red-600/80 leading-relaxed">
              Reason: {adminNotes || "Please verify your bank details and resubmit."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Identity Section */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-navy-950/40 uppercase tracking-[0.2em]">Identity Details</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-navy-950/60 ml-1">PAN Card Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className="h-4 w-4 text-navy-950/20" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="ABCDE1234F"
                  className="block w-full pl-11 pr-4 py-3 bg-sand-50 border border-sand-200 rounded-2xl text-sm text-navy-950 placeholder:text-navy-950/20 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-navy-950/60 ml-1">GST Number (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-navy-950/20" />
                </div>
                <input
                  type="text"
                  placeholder="GST Identification Number"
                  className="block w-full pl-11 pr-4 py-3 bg-sand-50 border border-sand-200 rounded-2xl text-sm text-navy-950 placeholder:text-navy-950/20 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </div>

          {/* Bank Section */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-navy-950/40 uppercase tracking-[0.2em]">Bank Account Details</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-navy-950/60 ml-1">Bank Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Landmark className="h-4 w-4 text-navy-950/20" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Bank"
                  className="block w-full pl-11 pr-4 py-3 bg-sand-50 border border-sand-200 rounded-2xl text-sm text-navy-950 placeholder:text-navy-950/20 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy-950/60 ml-1">Account Number</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="block w-full px-4 py-3 bg-sand-50 border border-sand-200 rounded-2xl text-sm text-navy-950 placeholder:text-navy-950/20 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy-950/60 ml-1">IFSC Code</label>
                <input
                  type="text"
                  required
                  placeholder="HDFC0001234"
                  className="block w-full px-4 py-3 bg-sand-50 border border-sand-200 rounded-2xl text-sm text-navy-950 placeholder:text-navy-950/20 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-sand-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-[10px] text-navy-950/40 leading-relaxed max-w-sm italic">
            By submitting, you agree to our financial verification process. Your data is encrypted and stored securely using industry-standard protocols.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-navy-950 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-navy-950 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-navy-950/10"
          >
            {loading ? "Encrypting..." : "Submit for Verification"}
          </button>
        </div>
      </form>
    </div>
  );
}
