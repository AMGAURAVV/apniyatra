"use client";

import React from "react";
import { X, MapPin, Sparkles, Navigation, BookOpen, Clock, Tag } from "lucide-react";
import { Place } from "@/lib/types";

interface FolkloreModalProps {
  place: Place | null;
  onClose: () => void;
}

export default function FolkloreModal({ place, onClose }: FolkloreModalProps) {
  if (!place) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FBF6ED] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E7DCC9] shadow-2xl relative text-[#2A2118]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/90 border border-[#E7DCC9] flex items-center justify-center text-[#2A2118] hover:bg-[#C1502E] hover:text-white transition shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image / Header */}
        <div className="relative h-64 w-full overflow-hidden bg-[#2A2118]">
          {place.image_url ? (
            <img
              src={place.image_url}
              alt={place.name}
              className="w-full h-full object-cover opacity-85"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50">
              No image available
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBF6ED] via-transparent to-black/40" />

          {place.is_hidden_gem && (
            <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-[#C1502E] text-white text-xs font-semibold tracking-wide flex items-center gap-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hidden Gem</span>
            </div>
          )}

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs uppercase font-bold tracking-wider text-[#C1502E]">
              {place.category} · {place.city}, {place.state}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2A2118]">
              {place.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* GPS Coordinates Badge & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F4ECDD] border border-[#E7DCC9]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C1502E]/15 flex items-center justify-center text-[#C1502E]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8A7A6B] uppercase tracking-wider">
                  Precise GPS Coordinates
                </p>
                <p className="font-mono text-sm font-bold text-[#2A2118]">
                  {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
                </p>
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2A2118] text-white text-xs font-semibold hover:bg-[#C1502E] transition shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Maps</span>
            </a>
          </div>

          {/* Heritage Folklore Story Section */}
          <div className="p-6 rounded-2xl bg-amber-50/80 border border-[#E3A23C]/40 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-[#C1502E]">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold text-[#2A2118]">
                Heritage Folklore & Oral Legend
              </h3>
            </div>
            <p className="text-sm md:text-base text-[#5B4C3F] leading-relaxed italic">
              &ldquo;{place.folklore_story || "Local oral traditions recount mystical histories tied to the founders and protectors of this sanctuary."}&rdquo;
            </p>
          </div>

          {/* Historical Summary */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#8A7A6B] mb-2">
              Historical Overview
            </h4>
            <p className="text-sm text-[#5B4C3F] leading-relaxed">
              {place.history_summary || place.description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E7DCC9]">
            <div>
              <span className="text-xs text-[#8A7A6B] block">Best Time to Visit</span>
              <span className="text-sm font-medium text-[#2A2118] flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#C1502E]" />
                {place.best_time_to_visit || "Morning or Late Afternoon"}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#8A7A6B] block">Entry Fee</span>
              <span className="text-sm font-medium text-[#2A2118] mt-0.5 block">
                {place.entry_fee || "Free entry"}
              </span>
            </div>
          </div>

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {place.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E7DCC9] text-xs font-medium text-[#5B4C3F]"
                >
                  <Tag className="w-3 h-3 text-[#E3A23C]" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
