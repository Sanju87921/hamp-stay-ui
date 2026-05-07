"use client";

import React, { useState } from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { createReviewAction } from "@/actions/reviews";
import { cn } from "@/utils/cn";

interface ReviewFormProps {
  bookingId: string;
  resortId: string;
  resortName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ bookingId, resortId, resortName, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (content.length < 10) {
      setError("Please share a bit more about your stay (min 10 characters)");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createReviewAction({
        bookingId,
        resortId,
        rating,
        content
      });

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || "Failed to submit review");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-sand-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-navy-950 text-xl">How was your stay?</h3>
          <p className="text-sm text-navy-950/50">Sharing your experience at {resortName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-xs font-bold text-navy-950/40 uppercase tracking-widest mb-3">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors duration-200",
                    (hoveredRating || rating) >= star 
                      ? "fill-gold-400 text-gold-400" 
                      : "text-sand-200 fill-transparent"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-bold text-navy-950/40 uppercase tracking-widest mb-3">Your Experience</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you love? How was the service, the food, and the vibes?"
            className="w-full h-32 px-4 py-3 rounded-2xl border border-sand-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 outline-none transition-all resize-none text-sm text-navy-950 placeholder:text-navy-950/20"
          />
        </div>

        {error && (
          <p className="text-xs font-bold text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-xl">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest text-navy-950/50 hover:bg-sand-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-navy-950 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-navy-900 transition-all shadow-lg shadow-navy-950/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "Post Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
