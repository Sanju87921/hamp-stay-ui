"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../DashboardLayout";
import { AvailabilityCalendar } from "@/components/dashboard/AvailabilityCalendar";
import { Hotel, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export function InventoryClient({ resorts, user }: { resorts: any[], user: any }) {
  const [selectedResortId, setSelectedResortId] = useState<string | null>(
    resorts.length > 0 ? resorts[0].id : null
  );

  return (
    <DashboardLayout role="RESORT_OWNER" user={user}>
      <div className="max-w-5xl">
        <h1 className="text-3xl font-serif font-bold text-navy-950 mb-2">Inventory Management</h1>
        <p className="text-navy-950/50 mb-8">Control your property availability and block dates for maintenance or private events.</p>

        {resorts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-sand-300 p-12 text-center">
            <h3 className="font-bold text-navy-950 mb-1">No resorts found</h3>
            <p className="text-sm text-navy-950/50">You need to add a property before you can manage its inventory.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Resort Selector */}
            <div className="flex flex-wrap gap-4">
              {resorts.map((resort) => (
                <button
                  key={resort.id}
                  onClick={() => setSelectedResortId(resort.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300",
                    selectedResortId === resort.id
                      ? "bg-navy-950 text-white border-navy-950 shadow-lg shadow-navy-950/20"
                      : "bg-white text-navy-950 border-sand-200 hover:border-gold-300 shadow-sm"
                  )}
                >
                  <Hotel className={cn("w-5 h-5", selectedResortId === resort.id ? "text-gold-500" : "text-navy-300")} />
                  <span className="font-bold text-sm">{resort.name}</span>
                  {selectedResortId === resort.id && <ChevronRight className="w-4 h-4 ml-2 opacity-50" />}
                </button>
              ))}
            </div>

            {/* Calendar View */}
            {selectedResortId && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <AvailabilityCalendar resortId={selectedResortId} />
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
