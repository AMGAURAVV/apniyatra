"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Receipt,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Booking } from "@/lib/types";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a full environment, fetch from /api/v1/bookings/?user_id=1
    // For instant demonstration, show mock bookings + any local session bookings
    const sampleBookings: Booking[] = [
      {
        id: 1,
        booking_reference: "AY-2026-RAJ942",
        user_id: 1,
        booking_date: "2026-03-12T10:00:00Z",
        travel_date: "2026-03-15T09:00:00Z",
        travelers_count: 2,
        total_amount: 1600,
        currency: "INR",
        status: "confirmed",
        notes: "Pickup near Amer Fort parking. Interested in royal mirror legends.",
        service: {
          id: 1,
          name: "Amer Fort & Old City Secret Courtyards Tour",
          provider_name: "Rajesh Kumar — Heritage Storyteller",
          service_type: "guide",
          category: "guides",
          description: "Licensed Rajasthan guide uncovering secret courtyards and folklore.",
          location: "Amer & Old City, Jaipur",
          city: "Jaipur",
          state: "Rajasthan",
          price_amount: 800,
          price_unit: "per person",
          rating: 4.9,
          reviews_count: 312,
          is_verified: true,
          contact_phone: "+91 94140 11223",
        },
      },
      {
        id: 2,
        booking_reference: "AY-2026-VIK381",
        user_id: 1,
        booking_date: "2026-03-13T14:30:00Z",
        travel_date: "2026-03-16T08:00:00Z",
        travelers_count: 1,
        total_amount: 800,
        currency: "INR",
        status: "confirmed",
        notes: "Royal Enfield Classic 350 for 2 days. Helmets included.",
        service: {
          id: 2,
          name: "Royal Enfield Classic 350 Rental",
          provider_name: "Vikram Rentals",
          service_type: "bike_rental",
          category: "rentals",
          description: "Well-maintained Royal Enfield Classic 350 and Honda Activa scooters.",
          location: "MI Road, Jaipur",
          city: "Jaipur",
          state: "Rajasthan",
          price_amount: 400,
          price_unit: "per day",
          rating: 4.7,
          reviews_count: 240,
          is_verified: true,
          contact_phone: "+91 98290 55443",
        },
      },
    ];
    setBookings(sampleBookings);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
          Travel Reservations
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A2118]">
          My Bookings & Vouchers
        </h1>
        <p className="text-sm sm:text-base text-[#5B4C3F] max-w-2xl leading-relaxed">
          Manage your verified local service reservations, view digital ticket vouchers, and check travel dates.
        </p>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="p-6 md:p-8 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#F4ECDD] text-[#C1502E]">
                  {b.booking_reference}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="capitalize">{b.status}</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#2A2118]">
                {b.service?.name || "Local Experience Booking"}
              </h2>

              <p className="text-xs text-[#5B4C3F]">
                Provider: <strong>{b.service?.provider_name}</strong> · {b.service?.location}
              </p>

              {b.notes && (
                <p className="text-xs text-[#8A7A6B] italic bg-[#FBF6ED] p-2.5 rounded-xl border border-[#E7DCC9]">
                  Note: &ldquo;{b.notes}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-[#5B4C3F] pt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-[#C1502E]" />
                  <span>Travel Date: {b.travel_date.slice(0, 10)}</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-[#C1502E]" />
                  <span>Travelers / Quantity: {b.travelers_count}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-[#E7DCC9] pt-4 md:pt-0 md:pl-8 space-y-4">
              <div>
                <span className="text-xs text-[#8A7A6B] block md:text-right">Total Paid</span>
                <span className="font-serif text-3xl font-bold text-[#C1502E]">
                  ₹{b.total_amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Showing voucher for ${b.booking_reference}`)}
                  className="px-5 py-2 rounded-full bg-[#2A2118] text-white text-xs font-semibold hover:bg-[#C1502E] transition"
                >
                  View Voucher
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C1502E] text-white text-sm font-semibold hover:bg-[#9C3D22] transition"
        >
          <span>Explore More Services</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
