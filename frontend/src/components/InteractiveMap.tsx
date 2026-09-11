"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Sparkles,
  BookOpen,
  Search,
  Navigation,
  Compass,
  Filter,
  Layers,
} from "lucide-react";
import { Place, Service } from "@/lib/types";
import FolkloreModal from "@/components/FolkloreModal";
import BookingModal from "@/components/BookingModal";

interface InteractiveMapProps {
  places: Place[];
  services: Service[];
}

export default function InteractiveMap({ places, services }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [folkloreModalPlace, setFolkloreModalPlace] = useState<Place | null>(null);
  const [bookingModalService, setBookingModalService] = useState<Service | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let L: any;
    let isMounted = true;

    async function initMap() {
      L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Default center: Jaipur, Rajasthan
      const map = L.map(mapContainerRef.current).setView([26.9124, 75.7873], 10);
      mapInstanceRef.current = map;

      // CartoDB Voyager or OpenStreetMap tile layer (warm aesthetic)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      // LayerGroup for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      renderMarkers(L, map, markersLayer);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [places, services]);

  // Re-render markers on filter or search change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    async function update() {
      const L = (await import("leaflet")).default;
      renderMarkers(L, mapInstanceRef.current, markersLayerRef.current);
    }
    update();
  }, [activeFilter, searchQuery]);

  const renderMarkers = (L: any, map: any, markersLayer: any) => {
    markersLayer.clearLayers();

    const bounds: any[] = [];

    // Filter Places
    const shouldShowPlaces =
      activeFilter === "all" ||
      activeFilter === "heritage" ||
      activeFilter === "gems";

    if (shouldShowPlaces) {
      places.forEach((p) => {
        if (activeFilter === "gems" && !p.is_hidden_gem) return;
        if (
          searchQuery &&
          !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.category.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return;
        }

        const isGem = p.is_hidden_gem;
        const color = isGem ? "#C1502E" : "#E3A23C";

        const iconHtml = `
          <div style="
            background: ${color};
            color: #fff;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(42,33,24,0.3);
            border: 2px solid #fff;
            font-size: 14px;
            cursor: pointer;
            transition: transform 0.2s;
          " class="marker-pin">
            ${isGem ? "✨" : "🏰"}
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-div-icon",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([p.latitude, p.longitude], { icon: customIcon });

        const popupContent = `
          <div style="font-family: inherit; max-width: 220px; padding: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: #C1502E; text-transform: uppercase;">
              ${p.category} · ${p.city}
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #2A2118; margin: 2px 0;">
              ${p.name}
            </div>
            <div style="font-size: 11px; color: #5B4C3F; margin-bottom: 6px;">
              ${p.description.slice(0, 80)}...
            </div>
            <div style="font-size: 10px; font-family: monospace; color: #8A7A6B;">
              📍 ${p.latitude.toFixed(4)}°, ${p.longitude.toFixed(4)}°
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          setSelectedPlace(p);
        });

        marker.addTo(markersLayer);
        bounds.push([p.latitude, p.longitude]);
      });
    }

    // Auto fit bounds if markers exist
    if (bounds.length > 0 && map) {
      try {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch (err) {
        // ignore bounds calculation error
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Sidebar: Filters & Selected Place Details */}
      <div className="lg:col-span-5 space-y-6">
        {/* Search & Filter Bar */}
        <div className="p-5 rounded-3xl bg-white border border-[#E7DCC9] shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search places, stepwells, or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6ED] border border-[#E7DCC9] text-xs text-[#2A2118] outline-none focus:border-[#C1502E]"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Sites" },
              { id: "heritage", label: "Historic Forts" },
              { id: "gems", label: "✨ Hidden Gems" },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeFilter === chip.id
                    ? "bg-[#C1502E] text-white shadow-sm"
                    : "bg-[#FBF6ED] text-[#5B4C3F] border border-[#E7DCC9] hover:bg-[#F4ECDD]"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Place Detail Card */}
        {selectedPlace ? (
          <div className="p-6 rounded-3xl bg-white border border-[#E7DCC9] shadow-md space-y-4 animate-fadeIn">
            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#2A2118]">
              {selectedPlace.image_url ? (
                <img
                  src={selectedPlace.image_url}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
                  Heritage Site
                </div>
              )}
              {selectedPlace.is_hidden_gem && (
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#C1502E] text-white text-[10px] font-bold">
                  Hidden Gem
                </span>
              )}
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#C1502E]">
                {selectedPlace.category} · {selectedPlace.city}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2A2118] mt-0.5">
                {selectedPlace.name}
              </h3>
              <p className="text-xs text-[#5B4C3F] mt-2 line-clamp-3 leading-relaxed">
                {selectedPlace.description}
              </p>
            </div>

            {/* GPS coordinates badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF6ED] border border-[#E7DCC9] text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C1502E]" />
                <span className="font-mono text-[#2A2118]">
                  {selectedPlace.latitude.toFixed(4)}°, {selectedPlace.longitude.toFixed(4)}°
                </span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.latitude},${selectedPlace.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C1502E] font-bold hover:underline flex items-center gap-1"
              >
                <span>Navigate</span>
                <Navigation className="w-3 h-3" />
              </a>
            </div>

            {/* Folklore teaser */}
            {selectedPlace.folklore_story && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-[#5B4C3F] italic line-clamp-2">
                &ldquo;{selectedPlace.folklore_story}&rdquo;
              </div>
            )}

            <button
              onClick={() => setFolkloreModalPlace(selectedPlace)}
              className="w-full py-2.5 rounded-full bg-[#2A2118] text-white text-xs font-semibold hover:bg-[#C1502E] transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Heritage Folklore Story</span>
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-[#E7DCC9] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F4ECDD] text-[#C1502E] flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#2A2118]">
              Interactive Map Explorer
            </h4>
            <p className="text-xs text-[#8A7A6B] leading-relaxed">
              Click any pin on the Leaflet map to inspect precise GPS coordinates, read oral folklore legends, and get navigation directions.
            </p>
          </div>
        )}
      </div>

      {/* Right Canvas: Leaflet Map */}
      <div className="lg:col-span-7">
        <div className="relative rounded-3xl overflow-hidden border border-[#E7DCC9] shadow-lg h-[560px] lg:h-[640px] bg-[#E7DCC9]">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>
      </div>

      {/* Modals */}
      <FolkloreModal
        place={folkloreModalPlace}
        onClose={() => setFolkloreModalPlace(null)}
      />
      <BookingModal
        service={bookingModalService}
        onClose={() => setBookingModalService(null)}
        onSuccess={() => {}}
      />
    </div>
  );
}
