"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Compass,
  Wallet,
  Tag,
  BookOpen,
  Navigation,
} from "lucide-react";
import { generateItinerary, fetchPlaceRecommendations } from "@/lib/api";
import { Place } from "@/lib/types";

const SOURCE_CITIES = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Ahmedabad",
  "Pune",
];

const DESTINATIONS = [
  { id: "Jaipur", name: "Jaipur, Rajasthan", desc: "Pink City palaces, stepwells and forts" },
  { id: "Udaipur", name: "Udaipur, Rajasthan", desc: "City of shimmering lakes and havelis" },
  { id: "Varanasi", name: "Varanasi, Uttar Pradesh", desc: "Sacred Ganges ghats and Vedic traditions" },
  { id: "Hampi", name: "Hampi, Karnataka", desc: "Vijayanagara ruins and mythical boulder trails" },
  { id: "Agra", name: "Agra, Uttar Pradesh", desc: "Taj Mahal and Mughal architectural folklore" },
  { id: "Goa", name: "Goa", desc: "Portuguese heritage, secret coves and spice trails" },
];

const BUDGET_OPTIONS = [
  { id: "Budget", label: "₹5,000 – ₹10,000", desc: "Budget traveler (local stays, public transit)" },
  { id: "Moderate", label: "₹10,000 – ₹20,000", desc: "Balanced comfort (boutique havelis & rentals)" },
  { id: "Comfort", label: "₹20,000 – ₹40,000", desc: "Premium heritage stays and private guides" },
  { id: "Luxury", label: "₹40,000+", desc: "Royal palace suites & exclusive private experiences" },
];

const TRAVEL_STYLES = [
  { id: "relaxed", label: "Relaxed Pace", desc: "1–2 stops per day, plenty of downtime for tea and walks" },
  { id: "balanced", label: "Balanced", desc: "A healthy mix of key monuments, artisan visits, and rest" },
  { id: "packed", label: "Packed Explorer", desc: "See as many hidden gems and sunrise spots as possible" },
];

const INTEREST_TAGS = [
  "Heritage",
  "Folklore",
  "Hidden Gem",
  "Stepwell",
  "Fort",
  "Food & Sweets",
  "Culture & Music",
  "Nature",
  "Photography",
  "Adventure",
];

export default function TripWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Destination & Dates
  const [sourceCity, setSourceCity] = useState("Delhi");
  const [destination, setDestination] = useState("Jaipur");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  );
  const [daysCount, setDaysCount] = useState(3);

  // Step 2: Budget & Style
  const [budgetCategory, setBudgetCategory] = useState("Moderate");
  const [travelStyle, setTravelStyle] = useState("balanced");

  // Step 3: Interests & Tags
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Heritage",
    "Folklore",
    "Stepwell",
  ]);

  // Step 4: Output / Results
  const [loading, setLoading] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [mlRecommendations, setMlRecommendations] = useState<Place[]>([]);

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setCurrentStep(4);

    try {
      // 1. Call Google Gemini API structured itinerary generator endpoint
      const itinPromise = generateItinerary(
        destination,
        daysCount,
        budgetCategory,
        selectedInterests
      );

      // 2. Call Scikit-Learn Content-Based Recommender endpoint
      const maxBudgetNum =
        budgetCategory === "Budget"
          ? 200
          : budgetCategory === "Moderate"
          ? 500
          : 1500;
      const recsPromise = fetchPlaceRecommendations(
        selectedInterests,
        destination,
        maxBudgetNum,
        3
      );

      const [itinData, recsData] = await Promise.all([itinPromise, recsPromise]);

      setGeneratedItinerary(itinData);
      setMlRecommendations(recsData);
    } catch (err) {
      console.error("Error generating trip plan:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* 4-Step Indicator Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {[
          { step: 1, label: "Destination & Dates" },
          { step: 2, label: "Budget & Style" },
          { step: 3, label: "Heritage Interests" },
          { step: 4, label: "AI Itinerary Plan" },
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;
          return (
            <div
              key={item.step}
              onClick={() => {
                if (item.step < currentStep) setCurrentStep(item.step);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? "bg-[#C1502E] text-white border-[#C1502E] shadow-md"
                  : isDone
                  ? "bg-[#F4ECDD] text-[#2A2118] border-[#E7DCC9]"
                  : "bg-white text-[#8A7A6B] border-[#E7DCC9]/60 opacity-60"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span>Step {item.step}</span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-semibold block truncate">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Destination & Dates */}
      {currentStep === 1 && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
              Step 1 of 4
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2A2118] mt-1">
              Where will your Yatra take you?
            </h2>
            <p className="text-sm text-[#5B4C3F] mt-1">
              Select your origin, target destination in India, and duration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#8A7A6B] uppercase mb-2">
                Starting City
              </label>
              <select
                value={sourceCity}
                onChange={(e) => setSourceCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#E7DCC9] bg-[#FBF6ED] text-sm text-[#2A2118] outline-none focus:border-[#C1502E]"
              >
                {SOURCE_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A7A6B] uppercase mb-2">
                Destination in India
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#E7DCC9] bg-[#FBF6ED] text-sm text-[#2A2118] outline-none focus:border-[#C1502E]"
              >
                {DESTINATIONS.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A7A6B] uppercase mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#E7DCC9] bg-[#FBF6ED] text-sm text-[#2A2118] outline-none focus:border-[#C1502E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A7A6B] uppercase mb-2">
                Duration (Days)
              </label>
              <input
                type="number"
                min={1}
                max={14}
                value={daysCount}
                onChange={(e) => setDaysCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-2xl border border-[#E7DCC9] bg-[#FBF6ED] text-sm text-[#2A2118] outline-none focus:border-[#C1502E]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E7DCC9]">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-8 py-3 rounded-full bg-[#C1502E] text-white text-sm font-semibold hover:bg-[#9C3D22] transition flex items-center gap-2 shadow-sm"
            >
              <span>Continue to Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Budget & Travel Style */}
      {currentStep === 2 && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
              Step 2 of 4
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2A2118] mt-1">
              Choose your budget & style
            </h2>
            <p className="text-sm text-[#5B4C3F] mt-1">
              Help our AI tailor recommended heritage stays, transportation, and guides.
            </p>
          </div>

          {/* Budget Options */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#8A7A6B] uppercase">
              Trip Budget Bracket
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BUDGET_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setBudgetCategory(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    budgetCategory === opt.id
                      ? "bg-amber-50/70 border-[#C1502E] shadow-sm"
                      : "bg-[#FBF6ED] border-[#E7DCC9] hover:bg-[#F4ECDD]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-bold text-[#2A2118]">
                      {opt.label}
                    </span>
                    <Wallet className="w-4 h-4 text-[#C1502E]" />
                  </div>
                  <p className="text-xs text-[#5B4C3F] mt-1">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#8A7A6B] uppercase">
              Travel Rhythm & Pace
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TRAVEL_STYLES.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setTravelStyle(style.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    travelStyle === style.id
                      ? "bg-amber-50/70 border-[#C1502E] shadow-sm"
                      : "bg-[#FBF6ED] border-[#E7DCC9] hover:bg-[#F4ECDD]"
                  }`}
                >
                  <span className="font-bold text-sm text-[#2A2118] block">
                    {style.label}
                  </span>
                  <p className="text-xs text-[#5B4C3F] mt-1 leading-relaxed">
                    {style.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#E7DCC9]">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 rounded-full bg-[#FBF6ED] text-[#2A2118] text-sm font-semibold hover:bg-[#F4ECDD] transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-8 py-3 rounded-full bg-[#C1502E] text-white text-sm font-semibold hover:bg-[#9C3D22] transition flex items-center gap-2 shadow-sm"
            >
              <span>Continue to Interests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Interests & Tags */}
      {currentStep === 3 && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
              Step 3 of 4
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2A2118] mt-1">
              Select your travel interests
            </h2>
            <p className="text-sm text-[#5B4C3F] mt-1">
              Our Scikit-Learn content recommender and Gemini API will prioritize places matching these tags.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {INTEREST_TAGS.map((tag) => {
              const selected = selectedInterests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={`px-5 py-3 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                    selected
                      ? "bg-[#C1502E] text-white shadow-sm"
                      : "bg-[#FBF6ED] text-[#5B4C3F] border border-[#E7DCC9] hover:bg-[#F4ECDD]"
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{tag}</span>
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#E3A23C] flex-shrink-0" />
            <p className="text-xs text-[#5B4C3F]">
              Clicking generate below will call Google Gemini API in structured JSON mode to craft a day-by-day itinerary with exact GPS coordinates and oral folklore stories.
            </p>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#E7DCC9]">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-full bg-[#FBF6ED] text-[#2A2118] text-sm font-semibold hover:bg-[#F4ECDD] transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleGenerate}
              className="px-8 py-3 rounded-full bg-[#C1502E] text-white text-sm font-semibold hover:bg-[#9C3D22] transition flex items-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Yatra Itinerary</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI Itinerary Output & ML Recommendations */}
      {currentStep === 4 && (
        <div className="space-y-8 animate-fadeIn">
          {loading ? (
            <div className="p-16 rounded-3xl bg-white border border-[#E7DCC9] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F4ECDD] text-[#C1502E] flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2A2118]">
                Crafting Your Custom Yatra...
              </h3>
              <p className="text-xs text-[#8A7A6B] max-w-md mx-auto">
                Querying Google Gemini API in JSON mode for authentic folklore stories, matching coordinates, and computing Scikit-Learn TF-IDF recommendations.
              </p>
            </div>
          ) : generatedItinerary ? (
            <div className="space-y-10">
              {/* Itinerary Header Banner */}
              <div className="rounded-3xl p-8 md:p-10 bg-gradient-to-br from-[#2A2118] to-[#3B2E22] text-white shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#E3A23C]">
                      Generated AI Itinerary · {generatedItinerary.duration_days} Days in {generatedItinerary.destination}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
                      {generatedItinerary.trip_title}
                    </h2>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-right">
                    <span className="text-[10px] uppercase font-bold text-[#F3D9A8] block">
                      Estimated Cost
                    </span>
                    <span className="font-serif text-2xl font-bold text-white">
                      ₹{generatedItinerary.estimated_total_cost_inr?.toLocaleString() || "8,500"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
                  {generatedItinerary.summary}
                </p>
              </div>

              {/* Day-by-Day Timeline */}
              <div className="space-y-8">
                {generatedItinerary.days?.map((day: any) => (
                  <div
                    key={day.day_number}
                    className="p-6 md:p-8 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-[#E7DCC9] pb-4">
                      <span className="w-9 h-9 rounded-xl bg-[#C1502E] text-white flex items-center justify-center font-bold text-sm">
                        D{day.day_number}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#2A2118]">
                        {day.theme}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {day.schedule?.map((act: any, idx: number) => {
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${act.latitude},${act.longitude}`;
                        return (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-[#FBF6ED] border border-[#E7DCC9] space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C1502E]">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{act.time}</span>
                                </span>
                                <span className="text-[10px] uppercase font-bold text-[#8A7A6B] px-2 py-0.5 rounded-full bg-white border border-[#E7DCC9]">
                                  {act.activity_type}
                                </span>
                              </div>

                              <h4 className="font-serif text-lg font-bold text-[#2A2118]">
                                {act.place_name}
                              </h4>

                              {/* Folklore highlight */}
                              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/50 text-xs text-[#5B4C3F] italic">
                                &ldquo;{act.folklore_highlight}&rdquo;
                              </div>

                              {act.insider_tip && (
                                <p className="text-[11px] text-[#8A7A6B]">
                                  💡 <strong>Tip:</strong> {act.insider_tip}
                                </p>
                              )}
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-[#E7DCC9] text-xs">
                              <span className="font-mono text-[#5B4C3F]">
                                📍 {act.latitude?.toFixed(2)}°, {act.longitude?.toFixed(2)}°
                              </span>
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#C1502E] font-bold hover:underline flex items-center gap-1"
                              >
                                <span>Maps</span>
                                <Navigation className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Scikit-Learn Content Recommendations */}
              {mlRecommendations.length > 0 && (
                <div className="p-8 rounded-3xl bg-[#F4ECDD] border border-[#E7DCC9] space-y-6">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
                      Scikit-Learn TF-IDF Matches
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2A2118] mt-0.5">
                      Recommended Stops for Your Route
                    </h3>
                    <p className="text-xs text-[#5B4C3F]">
                      Matched against your interest tags ({selectedInterests.join(", ")}) and max budget.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {mlRecommendations.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-white border border-[#E7DCC9] shadow-sm space-y-2"
                      >
                        <span className="text-[10px] uppercase font-bold text-[#C1502E]">
                          {p.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#2A2118]">{p.name}</h4>
                        <p className="text-xs text-[#5B4C3F] line-clamp-2">{p.description}</p>
                        <div className="text-[10px] font-mono text-[#8A7A6B]">
                          📍 {p.latitude.toFixed(2)}°, {p.longitude.toFixed(2)}° · {p.entry_fee || "Free"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-[#E7DCC9] justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-full bg-[#FBF6ED] text-[#2A2118] text-sm font-semibold hover:bg-[#F4ECDD] transition"
                >
                  Modify Preferences
                </button>

                <div className="flex gap-3">
                  <Link
                    href="/services"
                    className="px-6 py-3 rounded-full bg-[#2A2118] text-white text-sm font-semibold hover:bg-[#C1502E] transition shadow-sm"
                  >
                    Book Verified Guides & Rentals
                  </Link>
                  <Link
                    href="/passport"
                    className="px-6 py-3 rounded-full bg-[#C1502E] text-white text-sm font-semibold hover:bg-[#9C3D22] transition shadow-md"
                  >
                    Save to Yatra Passport
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
