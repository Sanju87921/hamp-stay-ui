"use client";

import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Calendar, MapPin, Hotel, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { ReviewForm } from "@/components/dashboard/ReviewForm";
import { motion, AnimatePresence } from "framer-motion";

export function TravellerView({ user, initialBookings = [] }: { user: any, initialBookings?: any[] }) {
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);
  
  const upcomingBookings = initialBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const pastBookings = initialBookings.filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED'); // Allow reviews for confirmed too for testing

  return (
    <DashboardLayout role="TRAVELLER" user={user}>
      <div className="max-w-4xl relative">
        <h1 className="text-3xl font-serif font-bold text-navy-950 mb-2">Welcome back, {user.name?.split(" ")[0]}!</h1>
        <p className="text-navy-950/50 mb-8">Ready for your next Hampi adventure?</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm">
            <p className="text-xs font-bold text-navy-800/40 uppercase tracking-widest mb-1">Total Trips</p>
            <p className="text-3xl font-serif font-bold text-navy-950">{initialBookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm">
            <p className="text-xs font-bold text-navy-800/40 uppercase tracking-widest mb-1">Reviews Left</p>
            <p className="text-3xl font-serif font-bold text-navy-950">
              {initialBookings.filter(b => b.review).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-sm">
            <p className="text-xs font-bold text-navy-800/40 uppercase tracking-widest mb-1">Saved Resorts</p>
            <p className="text-3xl font-serif font-bold text-navy-950">0</p>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-12">
          <h2 className="text-xl font-serif font-bold text-navy-950 mb-4">Upcoming Bookings</h2>
          {upcomingBookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-sand-300 p-12 text-center">
              <div className="w-16 h-16 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-sand-400" />
              </div>
              <h3 className="font-bold text-navy-950 mb-1">No upcoming stays</h3>
              <p className="text-sm text-navy-950/50 mb-6">Explore our curated collection of luxury resorts and book your stay.</p>
              <a href="/resorts" className="inline-flex px-6 py-3 bg-navy-950 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-gold-500 transition-all duration-300">Find a Resort</a>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking: any) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>

        {/* Past Bookings / Reviews */}
        <div>
          <h2 className="text-xl font-serif font-bold text-navy-950 mb-4">Past Stays & Reviews</h2>
          {pastBookings.length === 0 ? (
            <p className="text-sm text-navy-950/40 italic">No past stays recorded.</p>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking: any) => (
                <div key={booking.id} className="relative group">
                  <BookingCard booking={booking} />
                  {!booking.review && (
                    <button
                      onClick={() => setReviewBooking(booking)}
                      className="absolute right-4 bottom-4 px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Leave Review
                    </button>
                  )}
                  {booking.review && (
                    <div className="absolute right-4 bottom-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <Star className="w-3 h-3 fill-emerald-600" />
                      Reviewed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Modal */}
        <AnimatePresence>
          {reviewBooking && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setReviewBooking(null)}
                className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative z-10 w-full max-w-md"
              >
                <button
                  onClick={() => setReviewBooking(null)}
                  className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
                <ReviewForm
                  bookingId={reviewBooking.id}
                  resortId={reviewBooking.resortId}
                  resortName={reviewBooking.resort.name}
                  onSuccess={() => {
                    setReviewBooking(null);
                    window.location.reload(); // Refresh to show new state
                  }}
                  onCancel={() => setReviewBooking(null)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function BookingCard({ booking }: { booking: any }) {
  return (
    <div className="bg-white p-4 rounded-3xl border border-sand-200 shadow-sm flex flex-col md:flex-row gap-6 hover:border-gold-300 transition-colors">
      <div className="w-full md:w-32 h-24 bg-sand-100 rounded-2xl relative overflow-hidden flex-shrink-0">
        {booking.resort.images?.[0] ? (
          <Image src={booking.resort.images[0]} alt={booking.resort.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full"><Hotel className="w-8 h-8 text-sand-300" /></div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-navy-950">{booking.resort.name}</h3>
            <p className="text-xs text-navy-950/50 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {(booking.resort.location as any)?.area || "Hampi"}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {booking.status}
          </span>
        </div>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-[10px] font-bold text-navy-800/40 uppercase tracking-widest mb-0.5">Check In</p>
            <p className="text-sm font-semibold text-navy-950">{new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-navy-800/40 uppercase tracking-widest mb-0.5">Check Out</p>
            <p className="text-sm font-semibold text-navy-950">{new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-navy-800/40 uppercase tracking-widest mb-0.5">Total</p>
            <p className="text-sm font-bold text-navy-950">₹{booking.totalPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
