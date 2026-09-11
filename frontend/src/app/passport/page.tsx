"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Navigation,
  CheckCircle2,
  Lock,
  PlusCircle,
} from "lucide-react";
import { YatraPassport } from "@/lib/types";
import { fetchPassport } from "@/lib/api";

export default function PassportPage() {
  const [passport, setPassport] = useState<YatraPassport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchPassport(1);
      setPassport(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !passport) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#8A7A6B]">
        Loading your digital Yatra Passport...
      </div>
    );
  }

  const progressPercent = Math.min(
    100,
    Math.round((passport.xp_points / passport.xp_next_level) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Passport Header Card */}
      <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#2A2118] via-[#3A2B1E] to-[#1E1710] text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-full bg-[#C1502E] flex items-center justify-center text-white shadow-lg">
                <Compass className="w-7 h-7" />
              </span>
              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#E3A23C]">
                  Official Travel Credential
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  Yatra Passport
                </h1>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right">
              <span className="text-[10px] uppercase font-semibold text-[#F3D9A8] block">
                Traveler Status
              </span>
              <span className="font-serif text-xl font-bold text-white">
                Level {passport.level_number} · {passport.level_name}
              </span>
            </div>
          </div>

          {/* XP Progress */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#F3D9A8] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E3A23C]" />
                <span>Experience Points (XP)</span>
              </span>
              <span className="font-mono text-white/90">
                {passport.xp_points} / {passport.xp_next_level} XP ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#E3A23C] to-[#C1502E] rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-white/60">
              Visit new heritage coordinates or book verified local guides to level up to next tier.
            </p>
          </div>

          {/* 4 Stat Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-3xl font-serif font-bold text-white block">
                {passport.cities_visited_count}
              </span>
              <span className="text-xs text-[#F3D9A8] font-medium">Cities Visited</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-3xl font-serif font-bold text-white block">
                {passport.places_explored_count}
              </span>
              <span className="text-xs text-[#F3D9A8] font-medium">Places Explored</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-3xl font-serif font-bold text-white block">
                {passport.experiences_completed_count}
              </span>
              <span className="text-xs text-[#F3D9A8] font-medium">Experiences Completed</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-3xl font-serif font-bold text-white block">
                {passport.gems_discovered_count}
              </span>
              <span className="text-xs text-[#F3D9A8] font-medium">Hidden Gems</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Journey Stamps & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Journey Stamps Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
                Recorded Visited Locations
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2A2118]">
                Passport Journey Stamps
              </h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F4ECDD] text-[#2A2118]">
              {passport.stamps.length} Stamps
            </span>
          </div>

          <div className="space-y-4">
            {passport.stamps.map((stamp, idx) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${stamp.latitude},${stamp.longitude}`;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C1502E]">
                        {stamp.city}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#2A2118]">
                        {stamp.location_name}
                      </h3>
                    </div>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FBF6ED] border border-[#E7DCC9] text-xs font-mono text-[#5B4C3F] hover:bg-[#C1502E] hover:text-white transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#C1502E]" />
                      <span>
                        {stamp.latitude.toFixed(2)}°, {stamp.longitude.toFixed(2)}°
                      </span>
                    </a>
                  </div>

                  <p className="text-sm text-[#5B4C3F] leading-relaxed italic bg-amber-50/50 p-3 rounded-xl border border-amber-200/40">
                    &ldquo;{stamp.highlight_story}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#8A7A6B] pt-2 border-t border-[#E7DCC9]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{stamp.stamped_at || "Spring 2026"}</span>
                    </span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Stamp +50 XP</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Badges Showcase */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
              Milestones & Achievements
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2A2118]">
              Explorer Badges
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {passport.badges.map((badge, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  badge.earned
                    ? "bg-white border-[#E3A23C]/50 shadow-sm"
                    : "bg-[#FBF6ED] border-[#E7DCC9] opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{badge.icon}</span>
                    {badge.earned ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Earned</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8A7A6B] bg-[#F4ECDD] px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[#2A2118]">{badge.name}</h3>
                  <p className="text-xs text-[#5B4C3F] mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
