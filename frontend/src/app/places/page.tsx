"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  Sparkles,
  BookOpen,
  Search,
  Navigation,
  Clock,
} from "lucide-react";
import { Place } from "@/lib/types";
import { fetchPlaces } from "@/lib/api";
import FolkloreModal from "@/components/FolkloreModal";

function PlacesContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "";

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hiddenGemsOnly, setHiddenGemsOnly] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchPlaces(searchTerm || undefined, hiddenGemsOnly ? true : undefined);
      setPlaces(data);
      setLoading(false);
    }
    load();
  }, [searchTerm, hiddenGemsOnly]);

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "Hidden Stepwell", label: "Stepwells" },
    { id: "Fort", label: "Forts" },
    { id: "Artisan Community", label: "Artisan Villages" },
    { id: "Sacred Ghat", label: "Ghats" },
    { id: "Hidden Lake", label: "Lakes & Nature" },
  ];

  const filteredPlaces = places.filter((p) => {
    if (selectedCategory !== "all" && !p.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-[#8A7A6B] absolute left-3.5" />
            <input
              type="text"
              placeholder="Search by city (Jaipur, Udaipur, Varanasi), name, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FBF6ED] border border-[#E7DCC9] text-sm text-[#2A2118] outline-none focus:border-[#C1502E]"
            />
          </div>

          <button
            onClick={() => setHiddenGemsOnly(!hiddenGemsOnly)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
              hiddenGemsOnly
                ? "bg-[#C1502E] text-white border-[#C1502E] shadow-sm"
                : "bg-[#FBF6ED] text-[#2A2118] border-[#E7DCC9] hover:bg-[#F4ECDD]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hidden Gems Only</span>
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E7DCC9]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? "bg-[#2A2118] text-white"
                  : "bg-[#FBF6ED] text-[#5B4C3F] hover:bg-[#F4ECDD] border border-[#E7DCC9]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Places */}
      {loading ? (
        <div className="text-center py-20 text-sm text-[#8A7A6B]">
          Loading ApniYatra heritage places...
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-white border border-[#E7DCC9]">
          <p className="font-serif text-xl font-bold text-[#2A2118]">No places found</p>
          <p className="text-xs text-[#8A7A6B] mt-1">Try relaxing your search terms or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map((place) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
            return (
              <div
                key={place.id}
                className="group rounded-3xl overflow-hidden bg-white border border-[#E7DCC9] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Media */}
                  <div className="relative h-56 w-full overflow-hidden bg-[#2A2118]">
                    {place.image_url ? (
                      <img
                        src={place.image_url}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        No image
                      </div>
                    )}

                    {place.is_hidden_gem && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#C1502E] text-white text-[11px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Hidden Gem</span>
                      </span>
                    )}

                    {/* GPS Coordinates pill */}
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5 hover:bg-[#C1502E] transition shadow"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#E3A23C]" />
                      <span>
                        {place.latitude.toFixed(4)}°, {place.longitude.toFixed(4)}°
                      </span>
                      <Navigation className="w-3 h-3 opacity-70" />
                    </a>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#C1502E]">
                      {place.category} · {place.city}, {place.state}
                    </span>

                    <h2 className="font-serif text-2xl font-bold text-[#2A2118] group-hover:text-[#C1502E] transition-colors">
                      {place.name}
                    </h2>

                    <p className="text-sm text-[#5B4C3F] line-clamp-3 leading-relaxed">
                      {place.description}
                    </p>

                    {place.folklore_story && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-[#5B4C3F] italic line-clamp-2">
                        &ldquo;{place.folklore_story}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#8A7A6B] border-t border-[#E7DCC9] pt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C1502E]" />
                      {place.best_time_to_visit || "Morning"}
                    </span>
                    <span className="font-semibold text-[#2A2118]">
                      {place.entry_fee || "Free"}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPlace(place)}
                    className="w-full py-3 rounded-full bg-[#F4ECDD] text-[#2A2118] text-xs font-bold hover:bg-[#C1502E] hover:text-white transition flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read Full Folklore & Story</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <FolkloreModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}

export default function PlacesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
          ApniYatra Domain Directory
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A2118]">
          Places, Folklore & GPS Coordinates
        </h1>
        <p className="text-sm sm:text-base text-[#5B4C3F] max-w-2xl leading-relaxed">
          Historical sites paired with centuries-old local folklore stories and verified GPS coordinates for travelers seeking the real India.
        </p>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-[#8A7A6B]">Loading directory...</div>}>
        <PlacesContent />
      </Suspense>
    </div>
  );
}
