export interface Place {
  id: number;
  name: string;
  slug: string;
  state: string;
  city: string;
  category: string;
  description: string;
  folklore_story?: string;
  history_summary?: string;
  latitude: number;
  longitude: number;
  best_time_to_visit?: string;
  entry_fee?: string;
  is_hidden_gem: boolean;
  image_url?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: number;
  name: string;
  provider_name: string;
  service_type: string;
  category: string;
  description: string;
  location: string;
  city: string;
  state: string;
  price_amount: number;
  price_unit: string;
  rating: number;
  reviews_count: number;
  is_verified: boolean;
  image_url?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface Booking {
  id?: number;
  booking_reference?: string;
  user_id: number;
  service_id?: number | null;
  place_id?: number | null;
  booking_date: string;
  travel_date: string;
  travelers_count: number;
  total_amount: number;
  currency: string;
  status: string;
  notes?: string;
  service?: Service;
  place?: Place;
  created_at?: string;
}

export interface PassportStamp {
  id?: number;
  passport_id?: number;
  place_id?: number | null;
  city: string;
  location_name: string;
  highlight_story: string;
  latitude: number;
  longitude: number;
  stamped_at?: string;
}

export interface PassportBadge {
  id?: number;
  passport_id?: number;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  unlocked_at?: string;
}

export interface YatraPassport {
  id: number;
  user_id: number;
  level_name: string;
  level_number: number;
  xp_points: number;
  xp_next_level: number;
  cities_visited_count: number;
  places_explored_count: number;
  experiences_completed_count: number;
  gems_discovered_count: number;
  stamps: PassportStamp[];
  badges: PassportBadge[];
}

export interface ActivityItem {
  time: string;
  place_name: string;
  activity_type: string;
  folklore_highlight: string;
  latitude: number;
  longitude: number;
  estimated_cost_inr: number;
  insider_tip: string;
}

export interface DayPlan {
  day_number: number;
  theme: string;
  schedule: ActivityItem[];
}

export interface Itinerary {
  destination: string;
  trip_title: string;
  duration_days: number;
  budget_category: string;
  estimated_total_cost_inr: number;
  summary: string;
  days: DayPlan[];
}

export interface RecommendedPlaceItem {
  place: Place;
  similarity_score: number;
  match_percentage: number;
  estimated_cost: number;
  matched_tags: string[];
  match_reason: string;
  budget_passed: boolean;
}

export interface RecommendationResult {
  query_tags: string[];
  max_budget?: number;
  total_matches: number;
  recommendations: RecommendedPlaceItem[];
}
