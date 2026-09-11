import React from "react";
import TripWizard from "@/components/TripWizard";

export default function PlannerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
          AI Trip Planner
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A2118]">
          Build your perfect Yatra.
        </h1>
        <p className="text-sm text-[#5B4C3F]">
          Custom itineraries powered by Google Gemini API and Scikit-Learn content matching, tailored to your budget and interests.
        </p>
      </div>

      <TripWizard />
    </div>
  );
}
