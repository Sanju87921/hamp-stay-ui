"use client";

import React from "react";
import { DashboardLayout } from "./DashboardLayout";
import { TrendingUp, Users, Hotel, Plus } from "lucide-react";
import Link from "next/link";

export function OwnerView({ user, initialResorts = [] }: { user: any, initialResorts?: any[] }) {
  const totalRevenue = initialResorts.reduce((acc, resort) => {
    const resortRevenue = resort.bookings?.reduce((bAcc: number, b: any) => bAcc + b.ownerEarnings, 0) || 0;
    return acc + resortRevenue;
  }, 0);

  const totalGuests = initialResorts.reduce((acc, resort) => {
    const resortGuests = resort.bookings?.reduce((bAcc: number, b: any) => bAcc + b.guests, 0) || 0;
    return acc + resortGuests;
  }, 0);

  return (
    <DashboardLayout role="RESORT_OWNER" user={user}>
      <div className="max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-navy-950 mb-2">Owner Dashboard</h1>
            <p className="text-navy-950/50">Manage your properties and track your earnings across Hampi.</p>
          </div>
          <Link
            href="/dashboard/resorts/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gold-500 transition-all duration-300 shadow-lg shadow-gold-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm">
            <div className="flex items-center gap-2 text-navy-800/40 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Total Revenue</span>
            </div>
            <p className="text-2xl font-serif font-bold text-navy-950">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm">
            <div className="flex items-center gap-2 text-navy-800/40 mb-2">
              <Hotel className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Total Resorts</span>
            </div>
            <p className="text-2xl font-serif font-bold text-navy-950">{initialResorts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm">
            <div className="flex items-center gap-2 text-navy-800/40 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Guests To Date</span>
            </div>
            <p className="text-2xl font-serif font-bold text-navy-950">{totalGuests}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm">
            <div className="flex items-center gap-2 text-navy-800/40 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-green-600">Active Status</span>
            </div>
            <p className="text-2xl font-serif font-bold text-green-700">Healthy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-sand-100 flex justify-between items-center">
              <h2 className="font-serif font-bold text-navy-950">Recent Bookings</h2>
              <button className="text-xs font-bold text-gold-600 uppercase tracking-wider hover:text-gold-700">View All</button>
            </div>
            <div className="p-12 text-center">
              {initialResorts.some(r => r.bookings?.length > 0) ? (
                <div className="space-y-4 text-left">
                  {/* Real bookings would be mapped here */}
                  <p className="text-sm text-navy-950/60">You have active bookings across your properties.</p>
                </div>
              ) : (
                <p className="text-sm text-navy-950/40 italic">No bookings recorded yet.</p>
              )}
            </div>
          </div>

          {/* My Properties Preview */}
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-sand-100 flex justify-between items-center">
              <h2 className="font-serif font-bold text-navy-950">My Properties</h2>
              <button className="text-xs font-bold text-gold-600 uppercase tracking-wider hover:text-gold-700">Manage</button>
            </div>
            <div className="p-6">
              {initialResorts.length > 0 ? (
                <div className="space-y-4">
                  {initialResorts.map((resort) => (
                    <div key={resort.id} className="flex items-center justify-between p-4 bg-sand-50 rounded-2xl border border-sand-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center text-gold-600">
                          <Hotel className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy-950 text-sm">{resort.name}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${
                            resort.status === 'ACTIVE' ? 'text-green-600' : 'text-gold-600'
                          }`}>
                            {resort.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-navy-950">₹{resort.pricePerNight}</p>
                        <p className="text-[10px] text-navy-950/40 uppercase tracking-widest">Per Night</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-sm text-navy-950/40 italic">You haven&apos;t added any properties yet.</p>
                  <Link href="/dashboard/resorts/new" className="inline-block mt-4 text-xs font-bold text-navy-950 underline hover:text-gold-600">
                    Get started by adding your first resort
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
