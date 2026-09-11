"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Star,
  Phone,
  Mail,
  MapPin,
  Compass,
  Bike,
  Car,
  Camera,
  Utensils,
  CheckCircle,
} from "lucide-react";
import { Service, Booking } from "@/lib/types";
import { fetchServices } from "@/lib/api";
import BookingModal from "@/components/BookingModal";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [recentBooking, setRecentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchServices(selectedCategory !== "all" ? selectedCategory : undefined);
      setServices(data);
      setLoading(false);
    }
    load();
  }, [selectedCategory]);

  const categories = [
    { id: "all", label: "All Services" },
    { id: "guides", label: "Heritage Guides" },
    { id: "rentals", label: "Vehicle & Gear Rentals" },
    { id: "experiences", label: "Workshops & Food" },
  ];

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "bike_rental":
        return <Bike className="w-4 h-4 text-[#C1502E]" />;
      case "car_rental":
        return <Car className="w-4 h-4 text-[#C1502E]" />;
      case "camera_rental":
        return <Camera className="w-4 h-4 text-[#C1502E]" />;
      case "cooking_class":
        return <Utensils className="w-4 h-4 text-[#C1502E]" />;
      default:
        return <Compass className="w-4 h-4 text-[#C1502E]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
          ApniYatra Marketplace
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A2118]">
          Local Services, Guides & Rentals
        </h1>
        <p className="text-sm sm:text-base text-[#5B4C3F] max-w-2xl leading-relaxed">
          Book directly with verified local professionals — licensed storytellers, Royal Enfield bike rentals, self-drive SUVs, and home cooking classes.
        </p>
      </div>

      {/* Success Notification if user booked */}
      {recentBooking && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium">
              Booking confirmed with reference: <strong>{recentBooking.booking_reference}</strong>!
            </span>
          </div>
          <button
            onClick={() => setRecentBooking(null)}
            className="text-xs font-bold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-white border border-[#E7DCC9] shadow-sm max-w-fit">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat.id
                ? "bg-[#C1502E] text-white shadow-sm"
                : "text-[#5B4C3F] hover:bg-[#F4ECDD]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Services */}
      {loading ? (
        <div className="text-center py-20 text-sm text-[#8A7A6B]">
          Loading ApniYatra verified services...
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-white border border-[#E7DCC9]">
          <p className="font-serif text-xl font-bold text-[#2A2118]">No services found</p>
          <p className="text-xs text-[#8A7A6B] mt-1">Try selecting another service category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 border border-[#E7DCC9] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.provider_name}
                        className="w-16 h-16 rounded-2xl object-cover border border-[#E7DCC9]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-[#F4ECDD] flex items-center justify-center text-[#C1502E]">
                        <Compass className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-bold text-base text-[#2A2118]">
                          {service.provider_name}
                        </h2>
                        {service.is_verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#8A7A6B] mt-0.5">
                        <MapPin className="w-3 h-3 text-[#C1502E]" />
                        <span>{service.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className="p-2 rounded-xl bg-[#FBF6ED] border border-[#E7DCC9]">
                    {getServiceIcon(service.service_type)}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2A2118]">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#5B4C3F] mt-2 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-1 text-[#2A2118]">{service.rating}</span>
                  </div>
                  <span className="text-[#8A7A6B]">
                    {service.reviews_count} verified traveler reviews
                  </span>
                </div>

                {/* Direct contact badges */}
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#8A7A6B]">
                  {service.contact_phone && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FBF6ED] border border-[#E7DCC9]">
                      <Phone className="w-3 h-3 text-[#3E5C3A]" />
                      <span>{service.contact_phone}</span>
                    </span>
                  )}
                  {service.contact_email && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FBF6ED] border border-[#E7DCC9]">
                      <Mail className="w-3 h-3 text-[#C1502E]" />
                      <span>Direct Inquiries</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Booking Footer */}
              <div className="mt-6 pt-4 border-t border-[#E7DCC9] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#8A7A6B] block">Price</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl font-bold text-[#C1502E]">
                      ₹{service.price_amount.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#8A7A6B]">/ {service.price_unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedService(service)}
                  className="px-6 py-2.5 rounded-full bg-[#2A2118] text-white text-xs font-semibold hover:bg-[#C1502E] transition shadow-sm"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSuccess={(booking) => {
          setRecentBooking(booking);
        }}
      />
    </div>
  );
}
