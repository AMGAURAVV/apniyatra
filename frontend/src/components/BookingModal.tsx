"use client";

import React, { useState } from "react";
import { X, Calendar, Users, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { Service, Booking } from "@/lib/types";
import { submitBooking } from "@/lib/api";

interface BookingModalProps {
  service: Service | null;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export default function BookingModal({ service, onClose, onSuccess }: BookingModalProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [travelers, setTravelers] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  if (!service) return null;

  const totalAmount = service.price_amount * travelers;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitBooking({
        user_id: 1, // Default traveler
        service_id: service.id,
        travel_date: new Date(date).toISOString(),
        travelers_count: travelers,
        total_amount: totalAmount,
        notes,
      });
      setCompletedBooking(res);
      onSuccess(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FBF6ED] rounded-3xl max-w-lg w-full overflow-hidden border border-[#E7DCC9] shadow-2xl relative text-[#2A2118]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E7DCC9] bg-[#F4ECDD]">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#C1502E]">
              Reserve Service
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2A2118] line-clamp-1">
              {service.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E7DCC9] flex items-center justify-center text-[#2A2118] hover:bg-[#C1502E] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {completedBooking ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#2A2118]">
                Yatra Booking Confirmed!
              </h4>
              <p className="text-sm text-[#5B4C3F]">
                Your reference code is{" "}
                <span className="font-mono font-bold text-[#C1502E] bg-[#F4ECDD] px-2 py-1 rounded">
                  {completedBooking.booking_reference}
                </span>
              </p>
              <div className="p-4 rounded-xl bg-white border border-[#E7DCC9] text-left text-xs space-y-1.5 text-[#5B4C3F]">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="font-semibold text-[#2A2118]">{service.provider_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-semibold text-[#2A2118]">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travelers / Units:</span>
                  <span className="font-semibold text-[#2A2118]">{travelers}</span>
                </div>
                <div className="flex justify-between border-t border-[#E7DCC9] pt-1.5 font-bold text-sm text-[#2A2118]">
                  <span>Total:</span>
                  <span className="text-[#C1502E]">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full mt-4 py-3 rounded-full bg-[#C1502E] text-white font-semibold hover:bg-[#9C3D22] transition"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E7DCC9]">
                <ShieldCheck className="w-5 h-5 text-[#3E5C3A]" />
                <div className="text-xs">
                  <span className="font-semibold text-[#2A2118] block">Direct Local Provider</span>
                  <span className="text-[#8A7A6B]">
                    100% of the price goes to {service.provider_name}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A7A6B] uppercase mb-1">
                  Travel / Booking Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E7DCC9] bg-white text-sm text-[#2A2118] outline-none focus:border-[#C1502E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A7A6B] uppercase mb-1">
                  Number of Travelers / Quantity
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E7DCC9] bg-white text-sm text-[#2A2118] outline-none focus:border-[#C1502E]"
                  />
                  <span className="text-xs text-[#8A7A6B] whitespace-nowrap">
                    @ ₹{service.price_amount} {service.price_unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A7A6B] uppercase mb-1">
                  Special Requests / Pickup Location
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hotel pickup in Amer at 9:00 AM..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DCC9] bg-white text-sm text-[#2A2118] outline-none focus:border-[#C1502E]"
                />
              </div>

              <div className="pt-2 border-t border-[#E7DCC9] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8A7A6B] block">Total Amount</span>
                  <span className="font-serif text-2xl font-bold text-[#C1502E]">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-full bg-[#C1502E] text-white font-semibold hover:bg-[#9C3D22] transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Confirming..." : "Confirm Booking"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
