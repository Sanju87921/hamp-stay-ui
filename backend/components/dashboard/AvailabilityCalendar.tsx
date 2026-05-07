"use client";

import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, isSameDay } from "date-fns";
import { toggleAvailabilityAction, getResortAvailabilityAction } from "@/actions/resorts";
import { Loader2, ShieldAlert, Calendar as CalIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface AvailabilityCalendarProps {
  resortId: string;
}

export function AvailabilityCalendar({ resortId }: AvailabilityCalendarProps) {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchAvailability() {
      const data = await getResortAvailabilityAction(resortId);
      setBlockedDates(data.map((item: any) => new Date(item.date)));
      setIsLoading(false);
    }
    fetchAvailability();
  }, [resortId]);

  const handleDateClick = async (date: Date) => {
    const isAlreadyBlocked = blockedDates.some(d => isSameDay(d, date));
    setIsUpdating(date);

    try {
      const result = await toggleAvailabilityAction(
        resortId, 
        date.toISOString(), 
        !isAlreadyBlocked,
        "Owner Blocked"
      );

      if (result.success) {
        if (isAlreadyBlocked) {
          setBlockedDates(prev => prev.filter(d => !isSameDay(d, date)));
        } else {
          setBlockedDates(prev => [...prev, date]);
        }
      } else {
        alert("Failed to update availability");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-navy-200" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-serif font-bold text-navy-950 flex items-center gap-2">
            <CalIcon className="w-5 h-5 text-gold-500" />
            Inventory & Availability
          </h3>
          <p className="text-sm text-navy-950/50">Click any date to block or unblock it from traveller bookings.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sand-100" />
            <span className="text-navy-950/40">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-100" />
            <span className="text-red-500">Blocked</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="calendar-owner-management">
          <style>{`
            .rdp-owner {
              --rdp-accent-color: #ef4444;
              --rdp-accent-background-color: #fee2e2;
              --rdp-day-height: 48px;
              --rdp-day-width: 48px;
            }
            .rdp-owner .rdp-day_button {
              border-radius: 12px;
              transition: all 0.2s ease;
              border: 1px solid transparent;
            }
            .rdp-owner .rdp-day_button:hover:not(.rdp-selected .rdp-day_button) {
              background-color: #f8fafc;
              border-color: #e2e8f0;
              color: #0f172a;
            }
            .rdp-owner .rdp-selected .rdp-day_button {
              background-color: #fee2e2;
              color: #b91c1c;
              border-color: #fecaca;
              font-weight: 700;
            }
            .rdp-owner .rdp-today .rdp-day_button:not(.rdp-selected .rdp-day_button) {
              color: #d44c30;
              font-weight: 800;
              text-decoration: underline;
              text-underline-offset: 4px;
            }
            .rdp-owner .rdp-caption_label {
              font-family: var(--font-serif);
              font-size: 1.1rem;
              font-weight: 700;
              color: #072b1d;
            }
          `}</style>
          <DayPicker
            mode="multiple"
            selected={blockedDates}
            onDayClick={handleDateClick}
            className="rdp-owner"
            disabled={date => date < new Date(new Date().setHours(0,0,0,0))}
            modifiers={{
              updating: isUpdating ? [isUpdating] : []
            }}
            modifiersStyles={{
              updating: { opacity: 0.5, pointerEvents: 'none' }
            }}
          />
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-sand-50 rounded-2xl p-6 border border-sand-100">
            <h4 className="font-bold text-navy-950 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Management Logic
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-navy-950/70">
                <div className="w-5 h-5 rounded-full bg-white border border-sand-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                Blocking a date prevents any new bookings from starting or ending on that day.
              </li>
              <li className="flex gap-3 text-sm text-navy-950/70">
                <div className="w-5 h-5 rounded-full bg-white border border-sand-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                Existing confirmed bookings are NOT affected by manual blocks.
              </li>
              <li className="flex gap-3 text-sm text-navy-950/70">
                <div className="w-5 h-5 rounded-full bg-white border border-sand-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</div>
                We recommend blocking dates at least 48 hours in advance for maintenance.
              </li>
            </ul>
          </div>

          <div className="p-6 bg-navy-950 rounded-2xl text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-1">Current Sync Status</p>
            <p className="text-xl font-serif font-bold mb-4">Inventory Synchronized</p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LAST_SYNC: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
