"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Database,
  CheckCircle2,
} from "lucide-react";
import { Place, Service, YatraPassport } from "@/lib/types";
import { fetchPlaces, fetchServices, fetchPassport, seedDatabase } from "@/lib/api";
import FolkloreModal from "@/components/FolkloreModal";
import BookingModal from "@/components/BookingModal";

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [passport, setPassport] = useState<YatraPassport | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchCity, setSearchCity] = useState("");
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [loadingSeed, setLoadingSeed] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [placesData, servicesData, passportData] = await Promise.all([
        fetchPlaces(),
        fetchServices(),
        fetchPassport(1),
      ]);
      setPlaces(placesData);
      setServices(servicesData);
      setPassport(passportData);
    }
    loadData();
  }, []);

  const handleSeed = async () => {
    setLoadingSeed(true);
    try {
      const res = await seedDatabase();
      setSeedStatus(res.message);
      // Reload fresh data from backend
      const [placesData, servicesData, passportData] = await Promise.all([
        fetchPlaces(),
        fetchServices(),
        fetchPassport(1),
      ]);
      setPlaces(placesData);
      setServices(servicesData);
      setPassport(passportData);
    } catch {
      setSeedStatus("Note: Backend offline or already seeded. Using fallback dataset.");
    } finally {
      setLoadingSeed(false);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Backend / Monorepo Status Banner */}
      <div className="bg-[#2A2118] text-[#FBF6ED] py-3 px-4 border-b border-[#E7DCC9]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">
              Backend: FastAPI + SQLAlchemy + Alembic on PostgreSQL (Port 8000)
            </span>
          </div>
          <div className="flex items-center gap-3">
            {seedStatus && (
              <span className="text-[#E3A23C] font-medium truncate max-w-xs md:max-w-md">
                {seedStatus}
              </span>
            )}
            <button
              onClick={handleSeed}
              disabled={loadingSeed}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#C1502E] text-white hover:bg-[#9C3D22] transition disabled:opacity-50"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{loadingSeed ? "Seeding..." : "Seed PostgreSQL DB"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-[#2A2118] text-white min-h-[500px] flex items-center shadow-2xl">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A2118] via-[#2A2118]/80 to-transparent" />

            <div className="relative z-10 max-w-2xl p-8 md:p-16 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-[#F3D9A8] border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#E3A23C]" />
                Built for Smart India Hackathon 2026
              </span>

              <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Discover India beyond the usual.
              </h1>

              <p className="text-base sm:text-lg text-[#FBF6ED]/85 leading-relaxed">
                Explore hidden stepwells, oral folklore passed down across centuries, and connect with licensed guides and local rentals.
              </p>

              {/* Search Widget */}
              <div className="pt-4">
                <div className="p-2 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-lg border border-[#E7DCC9] shadow-xl flex flex-col sm:flex-row gap-2 max-w-xl">
                  <div className="flex-1 flex items-center gap-3 px-3 py-2">
                    <MapPin className="w-5 h-5 text-[#C1502E] flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Where to? (e.g. Jaipur, Udaipur, Varanasi)"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-[#2A2118] placeholder-[#8A7A6B]"
                    />
                  </div>
                  <Link
                    href={`/places${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ""}`}
                    className="px-6 py-3 rounded-xl bg-[#C1502E] text-white text-sm font-semibold hover:bg-[#9C3D22] transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Interactive Map */}
          <Link
            href="/map"
            className="group p-6 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C1502E]/10 flex items-center justify-center text-[#C1502E] group-hover:bg-[#C1502E] group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2A2118] group-hover:text-[#C1502E] transition-colors">
                Interactive Map
              </h3>
              <p className="text-xs text-[#5B4C3F] leading-relaxed">
                Leaflet-powered cartography with GPS coordinates, custom markers, and offbeat stepwell folklore.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E7DCC9]/60 flex items-center justify-between text-xs font-semibold text-[#C1502E]">
              <span>Launch Live Map</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: 4-Step Trip Wizard */}
          <Link
            href="/planner"
            className="group p-6 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E3A23C]/20 flex items-center justify-center text-[#C1502E] group-hover:bg-[#E3A23C] group-hover:text-[#2A2118] transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2A2118] group-hover:text-[#C1502E] transition-colors">
                Trip Wizard
              </h3>
              <p className="text-xs text-[#5B4C3F] leading-relaxed">
                Dynamic 4-step wizard tailored with Scikit-Learn TF-IDF recommendations and Gemini day-by-day itineraries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E7DCC9]/60 flex items-center justify-between text-xs font-semibold text-[#C1502E]">
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Marketplace */}
          <Link
            href="/services"
            className="group p-6 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5B4C3F]/10 flex items-center justify-center text-[#5B4C3F] group-hover:bg-[#2A2118] group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2A2118] group-hover:text-[#C1502E] transition-colors">
                Verified Marketplace
              </h3>
              <p className="text-xs text-[#5B4C3F] leading-relaxed">
                Direct booking for licensed tour guides, motorcycle rentals, and masterclasses without intermediaries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E7DCC9]/60 flex items-center justify-between text-xs font-semibold text-[#C1502E]">
              <span>Browse Services</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Digital Passport */}
          <Link
            href="/passport"
            className="group p-6 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C1502E]/10 flex items-center justify-center text-[#C1502E] group-hover:bg-[#C1502E] group-hover:text-white transition-colors">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2A2118] group-hover:text-[#C1502E] transition-colors">
                Yatra Passport
              </h3>
              <p className="text-xs text-[#5B4C3F] leading-relaxed">
                Gamified XP progression, cultural exploration milestones, stamp collection, and verified achievement badges.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E7DCC9]/60 flex items-center justify-between text-xs font-semibold text-[#C1502E]">
              <span>View Passport</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* SECTION 1: HERITAGE FOLKLORE & PLACES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
              Oral Legends & Coordinates
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A2118] mt-1">
              Hidden Heritage & Folklore
            </h2>
            <p className="text-sm text-[#5B4C3F] mt-2 max-w-xl">
              Every stepwell and hill fortress holds oral histories rarely found in guidebooks. Click to inspect GPS coordinates and listen to folklore stories.
            </p>
          </div>
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C1502E] hover:underline"
          >
            <span>View all places</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.slice(0, 4).map((place) => (
            <div
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-[#E7DCC9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#2A2118]">
                {place.image_url && (
                  <img
                    src={place.image_url}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {place.is_hidden_gem && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#C1502E] text-white text-[11px] font-bold tracking-wide">
                    Hidden Gem
                  </span>
                )}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E3A23C]" />
                  <span>{place.latitude.toFixed(2)}°, {place.longitude.toFixed(2)}°</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#8A7A6B]">
                    {place.category} · {place.city}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#2A2118] group-hover:text-[#C1502E] transition-colors mt-0.5">
                    {place.name}
                  </h3>
                  <p className="text-xs text-[#5B4C3F] line-clamp-2 mt-2 leading-relaxed">
                    {place.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E7DCC9]/70 flex items-center justify-between text-xs font-semibold text-[#C1502E]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Folklore</span>
                  </span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: VERIFIED LOCAL SERVICES */}
      <section className="bg-[#F4ECDD] py-16 border-y border-[#E7DCC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
                Direct Community Marketplace
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A2118] mt-1">
                Verified Guides & Rentals
              </h2>
              <p className="text-sm text-[#5B4C3F] mt-2 max-w-xl">
                Skip commercial middlemen. Book licensed guides, bikes, self-drive cars, and cultural workshops directly.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C1502E] hover:underline"
            >
              <span>Explore all services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-6 border border-[#E7DCC9] shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {service.image_url && (
                      <img
                        src={service.image_url}
                        alt={service.provider_name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#E7DCC9]"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-[#2A2118]">
                          {service.provider_name}
                        </h3>
                        {service.is_verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <span className="text-xs text-[#8A7A6B]">{service.location}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#2A2118]">
                      {service.name}
                    </h4>
                    <p className="text-xs text-[#5B4C3F] mt-1 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2A2118]">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1">{service.rating}</span>
                    </div>
                    <span className="text-[#8A7A6B]">({service.reviews_count} reviews)</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E7DCC9] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8A7A6B] block">Starting from</span>
                    <span className="font-serif text-xl font-bold text-[#C1502E]">
                      ₹{service.price_amount}
                    </span>
                    <span className="text-[11px] text-[#8A7A6B] ml-1">/ {service.price_unit}</span>
                  </div>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="px-5 py-2.5 rounded-full bg-[#2A2118] text-white text-xs font-semibold hover:bg-[#C1502E] transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: YATRA PASSPORT GAMIFICATION PREVIEW */}
      {passport && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#2A2118] to-[#3B2E22] text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#F3D9A8] border border-white/15">
                  <Award className="w-4 h-4 text-[#E3A23C]" />
                  <span>Gamified Indian Travel Experience</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                  Your Digital Yatra Passport
                </h2>

                <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                  Earn XP as you visit offbeat stepwells, talk to local elders, and record your journey. Unlock heritage explorer badges along the way.
                </p>

                {/* Level progress bar */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 max-w-lg">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#E3A23C]">
                      Level {passport.level_number} — {passport.level_name}
                    </span>
                    <span className="text-white/70">
                      {passport.xp_points} / {passport.xp_next_level} XP
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E3A23C] to-[#C1502E] rounded-full transition-all duration-700"
                      style={{
                        width: `${(passport.xp_points / passport.xp_next_level) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                    <div>
                      <span className="font-bold text-white block">{passport.cities_visited_count}</span>
                      <span className="text-[10px] text-white/60">Cities</span>
                    </div>
                    <div>
                      <span className="font-bold text-white block">{passport.places_explored_count}</span>
                      <span className="text-[10px] text-white/60">Places</span>
                    </div>
                    <div>
                      <span className="font-bold text-white block">{passport.experiences_completed_count}</span>
                      <span className="text-[10px] text-white/60">Experiences</span>
                    </div>
                    <div>
                      <span className="font-bold text-white block">{passport.gems_discovered_count}</span>
                      <span className="text-[10px] text-white/60">Gems</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/passport"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C1502E] text-white text-sm font-semibold hover:bg-[#9C3D22] transition shadow-md"
                  >
                    <span>Open Passport Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Badges preview cards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                {passport.badges.slice(0, 4).map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      badge.earned
                        ? "bg-white/10 border-[#E3A23C]/50 text-white"
                        : "bg-white/5 border-white/10 text-white/40"
                    }`}
                  >
                    <span className="text-3xl block mb-2">{badge.icon}</span>
                    <h4 className="font-bold text-sm text-white">{badge.name}</h4>
                    <p className="text-[11px] text-white/70 mt-1 line-clamp-2">
                      {badge.description}
                    </p>
                    {badge.earned && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-2">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Unlocked</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      <FolkloreModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      <BookingModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSuccess={(b) => {
          console.log("Booked:", b);
        }}
      />
    </div>
  );
}
