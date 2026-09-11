import { Place, Service, Booking, YatraPassport } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// Fallback seed data in case backend server is temporarily starting or offline
export const FALLBACK_PLACES: Place[] = [
  {
    id: 1,
    name: "Panna Meena ka Kund",
    slug: "panna-meena-ka-kund",
    city: "Jaipur",
    state: "Rajasthan",
    category: "Hidden Stepwell",
    description: "A symmetrical 16th-century stepwell near Amer with interlocking diamond staircases.",
    folklore_story: "According to local oral folklore, no human can climb down and then climb back up on the exact same sequence of steps without becoming disoriented. Ancient guards utilized this geometric labyrinth during times of siege to confuse infiltrators in the dark.",
    history_summary: "Constructed in the 16th century during the reign of Maharaja Man Singh I for local community gatherings and rainwater harvesting.",
    latitude: 26.9854,
    longitude: 75.8330,
    best_time_to_visit: "Early morning (7 AM - 9 AM) or golden hour",
    entry_fee: "Free",
    is_hidden_gem: true,
    image_url: "https://images.unsplash.com/photo-1516522184673-de15e930962f?q=80&w=1000&auto=format&fit=crop",
    tags: ["Heritage", "Stepwell", "Architecture", "Hidden Gem"],
  },
  {
    id: 2,
    name: "Amber Fort",
    slug: "amber-fort",
    city: "Jaipur",
    state: "Rajasthan",
    category: "Fort",
    description: "Perched on the rugged Aravalli hills, a majestic sandstone and marble citadel renowned for its Sheesh Mahal.",
    folklore_story: "Legend says that when the royal architects designed the Sheesh Mahal (Hall of Mirrors), they arranged thousands of concave Belgian convex mirrors so that a single candle lit at night would illuminate the entire chamber like an open starry galaxy.",
    history_summary: "Built by Raja Man Singh I in 1592, the fort served as the primary residence of the Rajput Kachwaha rulers until Sawai Jai Singh II founded Jaipur.",
    latitude: 26.9855,
    longitude: 75.8513,
    best_time_to_visit: "October to March, 8:00 AM - 5:30 PM",
    entry_fee: "₹100 (Indians), ₹500 (Foreigners)",
    is_hidden_gem: false,
    image_url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop",
    tags: ["Heritage", "Fort", "Royal", "Iconic"],
  },
  {
    id: 3,
    name: "Assi Ghat",
    slug: "assi-ghat",
    city: "Varanasi",
    state: "Uttar Pradesh",
    category: "Sacred Ghat",
    description: "The southernmost ghat of Kashi where the holy river Assi meets the Ganges, vibrant with dawn subah-e-banaras.",
    folklore_story: "Folklore and sacred texts in the Matsya Purana narrate that Goddess Durga tossed her sacred sword (Asi) here into the waters after vanquishing the demon duo Shumbha and Nishumbha.",
    history_summary: "Celebrated since Vedic times and mentioned by poet Tulsidas, who wrote the Ramcharitmanas near this spot.",
    latitude: 25.2925,
    longitude: 83.0076,
    best_time_to_visit: "5:30 AM for dawn chants and yoga",
    entry_fee: "Free",
    is_hidden_gem: false,
    image_url: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=1200&auto=format&fit=crop",
    tags: ["Spiritual", "Culture", "Sunrise", "Ganges"],
  },
  {
    id: 4,
    name: "Kumbhalgarh Fort Trails",
    slug: "kumbhalgarh-fort-trails",
    city: "Rajsamand",
    state: "Rajasthan",
    category: "Lesser-known Fort",
    description: "The Mewar fortress with the second-longest continuous wall on earth stretching over 36 kilometers.",
    folklore_story: "Local bards sing of Maharana Kumbha’s struggle to build the perimeter wall. Disheartened by repeated nighttime collapses, a saint advised a voluntary royal sacrifice to bless the foundation.",
    history_summary: "Constructed in the 15th century by Rana Kumbha, birthplace of legendary warrior Maharana Pratap.",
    latitude: 25.1483,
    longitude: 73.5844,
    best_time_to_visit: "October to March",
    entry_fee: "₹40 (Indians), ₹600 (Foreigners)",
    is_hidden_gem: true,
    image_url: "https://images.unsplash.com/photo-1713682995521-22ec819b50ac?q=80&w=1000&auto=format&fit=crop",
    tags: ["Adventure", "Fort", "Trekking", "Hidden Gem"],
  }
];

export const FALLBACK_SERVICES: Service[] = [
  {
    id: 1,
    name: "Rajesh Kumar — Heritage Storyteller",
    provider_name: "Rajesh Kumar",
    service_type: "guide",
    category: "guides",
    description: "Government-licensed Rajasthan guide with 14 years uncovering secret courtyards and folklore.",
    location: "Amer & Old City, Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    price_amount: 800,
    price_unit: "per person",
    rating: 4.9,
    reviews_count: 312,
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    contact_phone: "+91 94140 11223",
  },
  {
    id: 2,
    name: "Vikram Royal Enfield & Scooter Rentals",
    provider_name: "Vikram Rentals",
    service_type: "bike_rental",
    category: "rentals",
    description: "Well-maintained Royal Enfield Classic 350 and Honda Activa scooters with helmets and GPS mounts.",
    location: "MI Road, Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    price_amount: 400,
    price_unit: "per day",
    rating: 4.7,
    reviews_count: 240,
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=400&auto=format&fit=crop",
    contact_phone: "+91 98290 55443",
  },
  {
    id: 3,
    name: "Sunita's Traditional Kitchen Workshop",
    provider_name: "Sunita Sharma",
    service_type: "cooking_class",
    category: "experiences",
    description: "Hands-on culinary class preparing authentic Dal Baati Churma, Gatte ki Sabzi, and bajra rotis.",
    location: "Bani Park, Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    price_amount: 1200,
    price_unit: "per person",
    rating: 4.9,
    reviews_count: 301,
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400&auto=format&fit=crop",
    contact_phone: "+91 94140 33445",
  }
];

export const FALLBACK_PASSPORT: YatraPassport = {
  id: 1,
  user_id: 1,
  level_name: "Explorer",
  level_number: 4,
  xp_points: 680,
  xp_next_level: 1000,
  cities_visited_count: 8,
  places_explored_count: 23,
  experiences_completed_count: 7,
  gems_discovered_count: 4,
  stamps: [
    {
      id: 1,
      city: "Jaipur",
      location_name: "Panna Meena ka Kund & Amber Fort",
      highlight_story: "Cracked the labyrinth staircase geometry of Panna Meena Kund and listened to royal mirror legends at Amber.",
      latitude: 26.9854,
      longitude: 75.8330,
      stamped_at: "12 Mar 2026",
    },
    {
      id: 2,
      city: "Udaipur",
      location_name: "Lake Pichola & Gangaur Ghat",
      highlight_story: "Sunset wooden boat ride past Taj Lake Palace followed by evening Bagore ki Haveli folk dance.",
      latitude: 24.5797,
      longitude: 73.6800,
      stamped_at: "18 Apr 2026",
    },
    {
      id: 3,
      city: "Varanasi",
      location_name: "Assi Ghat & Ganga Aarti",
      highlight_story: "Dawn yoga as dawn broke over the Ganga, followed by hot kachori jalebi in old city alleys.",
      latitude: 25.2925,
      longitude: 83.0076,
      stamped_at: "05 Jun 2026",
    }
  ],
  badges: [
    { id: 1, name: "Heritage Explorer", icon: "🏰", description: "Visited 5+ historical monuments and forts", earned: true },
    { id: 2, name: "Hidden Gem Hunter", icon: "🗺️", description: "Discovered off-beat stepwells and ruins", earned: true },
    { id: 3, name: "Story Collector", icon: "📜", description: "Read and unlocked local folklore legends", earned: true },
    { id: 4, name: "Local Friend", icon: "🤝", description: "Booked services directly from local guides", earned: true },
    { id: 5, name: "Mountain Wanderer", icon: "⛰️", description: "Trek Himalayan and Aravalli mountain paths", earned: false },
  ]
};

// API Client Functions with Graceful Fallback
export async function fetchPlaces(city?: string, isHiddenGem?: boolean): Promise<Place[]> {
  try {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (isHiddenGem !== undefined) params.append("is_hidden_gem", String(isHiddenGem));

    const res = await fetch(`${API_BASE}/places/?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch places from API");
    const data = await res.json();
    return data.length > 0 ? data : FALLBACK_PLACES;
  } catch {
    return FALLBACK_PLACES;
  }
}

export async function fetchPlace(idOrSlug: string): Promise<Place | null> {
  try {
    const res = await fetch(`${API_BASE}/places/${idOrSlug}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch place");
    return await res.json();
  } catch {
    return FALLBACK_PLACES.find(p => p.slug === idOrSlug || String(p.id) === idOrSlug) || null;
  }
}

export async function fetchServices(category?: string, serviceType?: string): Promise<Service[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (serviceType) params.append("service_type", serviceType);

    const res = await fetch(`${API_BASE}/services/?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch services");
    const data = await res.json();
    return data.length > 0 ? data : FALLBACK_SERVICES;
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function fetchPassport(userId: number = 1): Promise<YatraPassport> {
  try {
    const res = await fetch(`${API_BASE}/passports/user/${userId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch passport");
    return await res.json();
  } catch {
    return FALLBACK_PASSPORT;
  }
}

export async function submitBooking(bookingData: Partial<Booking>): Promise<Booking> {
  const payload = {
    user_id: bookingData.user_id || 1,
    service_id: bookingData.service_id,
    place_id: bookingData.place_id,
    booking_date: new Date().toISOString(),
    travel_date: bookingData.travel_date || new Date().toISOString(),
    travelers_count: bookingData.travelers_count || 1,
    total_amount: bookingData.total_amount || 0,
    currency: "INR",
    notes: bookingData.notes || "",
  };

  try {
    const res = await fetch(`${API_BASE}/bookings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create booking on backend");
    return await res.json();
  } catch {
    // Local fallback for offline mode
    const fakeRef = `AY-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      id: Math.floor(Math.random() * 1000),
      booking_reference: fakeRef,
      status: "confirmed",
      ...payload,
      created_at: new Date().toISOString(),
    };
  }
}

export async function fetchFolkloreFeed(): Promise<Place[]> {
  try {
    const res = await fetch(`${API_BASE}/places/folklore/feed`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch folklore feed");
    const data = await res.json();
    return data.length > 0 ? data : FALLBACK_PLACES.filter(p => p.folklore_story);
  } catch {
    return FALLBACK_PLACES.filter(p => p.folklore_story);
  }
}

export async function fetchPlaceRecommendations(
  userTags: string[],
  city?: string,
  maxBudget?: number,
  topK: number = 4
): Promise<Place[]> {
  try {
    const res = await fetch(`${API_BASE}/places/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_tags: userTags,
        city: city || undefined,
        max_budget: maxBudget || undefined,
        top_k: topK,
      }),
    });
    if (!res.ok) throw new Error("Failed to fetch recommendations");
    const data = await res.json();
    if (data.recommendations && data.recommendations.length > 0) {
      return data.recommendations.map((r: any) => r.place);
    }
    return FALLBACK_PLACES.slice(0, topK);
  } catch {
    return FALLBACK_PLACES.slice(0, topK);
  }
}

export async function fetchBookings(userId: number = 1): Promise<Booking[]> {
  try {
    const res = await fetch(`${API_BASE}/bookings/?user_id=${userId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return await res.json();
  } catch {
    return [];
  }
}

export async function generateItinerary(
  destination: string,
  days: number = 3,
  budget: string = "Moderate",
  interests: string[] = ["Heritage", "Folklore"]
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/itineraries/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, days, budget, interests }),
    });
    if (!res.ok) throw new Error("Failed to generate itinerary");
    return await res.json();
  } catch {
    // Offline / fallback structure
    return {
      destination,
      trip_title: `Cultural & Heritage Trail of ${destination}`,
      duration_days: days,
      budget_category: budget,
      estimated_total_cost_inr: days * 2500,
      summary: `A personalized ${days}-day route through ${destination} exploring historic stepwells, folklore legends, and local bazaars.`,
      days: Array.from({ length: days }).map((_, idx) => ({
        day_number: idx + 1,
        theme: `Day ${idx + 1}: ${destination} Heritage Highlights & Folklore`,
        schedule: [
          {
            time: "09:00 AM",
            place_name: idx === 0 ? "Panna Meena ka Kund" : "Amber Fort",
            activity_type: "Heritage Walk",
            folklore_highlight: "Listen to the ancient legends of the geometric steps and starlight mirrors.",
            latitude: 26.9854,
            longitude: 75.8330,
            estimated_cost_inr: 200,
            insider_tip: "Arrive early before morning tour buses arrive."
          },
          {
            time: "02:30 PM",
            place_name: "Local Artisan Community",
            activity_type: "Artisan Workshop",
            folklore_highlight: "Observe terracotta crafts hand-sculpted using 800-year-old traditional techniques.",
            latitude: 25.0700,
            longitude: 73.8800,
            estimated_cost_inr: 400,
            insider_tip: "Engage with the senior master potter for authentic folklore."
          }
        ]
      }))
    };
  }
}

export async function seedDatabase(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/seed/`, {
    method: "POST",
  });
  return await res.json();
}
