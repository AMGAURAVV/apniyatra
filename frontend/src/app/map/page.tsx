"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchPlaces, fetchServices } from "@/lib/api";
import { Place, Service } from "@/lib/types";

// Dynamic import for Leaflet map component with ssr: false
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-3xl bg-[#F4ECDD] border border-[#E7DCC9] flex items-center justify-center text-sm text-[#8A7A6B]">
      Loading Leaflet Interactive Map...
    </div>
  ),
});

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [p, s] = await Promise.all([fetchPlaces(), fetchServices()]);
      setPlaces(p);
      setServices(s);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-[#C1502E]">
          Geospatial Heritage Directory
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A2118] mt-1">
          Interactive Map & GPS Explorer
        </h1>
        <p className="text-sm sm:text-base text-[#5B4C3F] mt-2 max-w-2xl leading-relaxed">
          Pinpoint stepwells, lesser-known hill forts, and artisan clusters across India. Built on Leaflet and connected live to the ApniYatra database.
        </p>
      </div>

      {loading ? (
        <div className="h-[600px] rounded-3xl bg-[#F4ECDD] flex items-center justify-center text-sm text-[#8A7A6B]">
          Fetching places and coordinates...
        </div>
      ) : (
        <InteractiveMap places={places} services={services} />
      )}
    </div>
  );
}
