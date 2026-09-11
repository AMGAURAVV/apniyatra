/* ===================== APNIYATRA — mock data ===================== */
/* Structured as flat JSON so it can later be swapped for real API calls
   (Gemini itinerary gen, Google Places, Node/FastAPI backend, etc). */

const DESTINATIONS = [
  {
    id: "delhi", name: "Delhi", state: "Delhi",
    img: "https://images.unsplash.com/photo-1705927122615-02dcef3b1465?q=80&w=1200&auto=format&fit=crop",
    desc: "The capital's Mughal monuments, markets and museums.",
    tags: ["Heritage", "Culture", "Shopping"], topFTA: true
  },
  {
    id: "jaipur", name: "Jaipur", state: "Rajasthan",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop",
    desc: "The Pink City — forts, bazaars and royal heritage.",
    tags: ["Heritage", "Shopping", "Culture"], topFTA: true
  },
  {
    id: "udaipur", name: "Udaipur", state: "Rajasthan",
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop",
    desc: "City of Lakes — palaces afloat on shimmering water.",
    tags: ["Heritage", "Photography", "Culture"]
  },
  {
    id: "jodhpur", name: "Jodhpur", state: "Rajasthan",
    img: "https://images.unsplash.com/photo-1764243213897-45e6def5ad3e?q=80&w=1200&auto=format&fit=crop",
    desc: "The Blue City, guarded by mighty Mehrangarh Fort.",
    tags: ["Heritage", "Adventure"]
  },
  {
    id: "varanasi", name: "Varanasi", state: "Uttar Pradesh",
    img: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=1200&auto=format&fit=crop",
    desc: "India's spiritual heart, alive on the ghats of the Ganges.",
    tags: ["Culture", "Heritage", "Food"]
  },
  {
    id: "kerala", name: "Kerala", state: "Kerala",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop",
    desc: "Backwaters, spice hills and God's Own Country.",
    tags: ["Nature", "Food", "Adventure"], topFTA: true
  },
  {
    id: "himachal", name: "Himachal Pradesh", state: "Himachal Pradesh",
    img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
    desc: "Snow peaks, pine valleys and mountain villages.",
    tags: ["Nature", "Adventure", "Photography"]
  },
  {
    id: "goa", name: "Goa", state: "Goa",
    img: "https://images.unsplash.com/photo-1695453463057-aa5d48d9e3d4?q=80&w=1200&auto=format&fit=crop",
    desc: "Sun-soaked beaches, Portuguese churches and beach shacks.",
    tags: ["Nature", "Food", "Photography"], topFTA: true
  },
  {
    id: "agra", name: "Agra", state: "Uttar Pradesh",
    img: "https://images.unsplash.com/photo-1742109539228-16f801e78e82?q=80&w=1200&auto=format&fit=crop",
    desc: "Home of the Taj Mahal and Mughal grandeur.",
    tags: ["Heritage", "Culture", "Photography"], topFTA: true
  },
  {
    id: "amritsar", name: "Amritsar", state: "Punjab",
    img: "https://images.unsplash.com/photo-1621377099913-ac1ec4848e52?q=80&w=1200&auto=format&fit=crop",
    desc: "The Golden Temple, langars and Punjabi warmth.",
    tags: ["Heritage", "Food", "Culture"]
  },
  {
    id: "rishikesh", name: "Rishikesh", state: "Uttarakhand",
    img: "https://images.unsplash.com/photo-1712510817140-917938f92e5b?q=80&w=1200&auto=format&fit=crop",
    desc: "Yoga capital of the world on the banks of the Ganga.",
    tags: ["Adventure", "Nature", "Culture"]
  },
  {
    id: "ladakh", name: "Ladakh", state: "Ladakh",
    img: "https://images.unsplash.com/photo-1761393091786-c341289ca1ae?q=80&w=1200&auto=format&fit=crop",
    desc: "High-altitude desert of monasteries and mirror lakes.",
    tags: ["Adventure", "Nature", "Photography"]
  },
  {
    id: "hampi", name: "Hampi", state: "Karnataka",
    img: "https://images.unsplash.com/photo-1676970344754-c75fa97e3713?q=80&w=1200&auto=format&fit=crop",
    desc: "Boulder-strewn ruins of a great Vijayanagara empire.",
    tags: ["Heritage", "Photography", "Adventure"]
  },
  {
    id: "mahabalipuram", name: "Mahabalipuram", state: "Tamil Nadu",
    img: "https://images.unsplash.com/photo-1668618873985-5293acd8db61?q=80&w=1200&auto=format&fit=crop",
    desc: "Shore temples and rock-cut monuments by the Bay of Bengal.",
    tags: ["Heritage", "Photography", "Nature"], topFTA: true
  }
];

const HIDDEN_GEMS = [
  {
    id: "gem-1", name: "Panna Meena ka Kund", category: "Hidden Stepwell", location: "Jaipur, Rajasthan",
    img: "https://images.unsplash.com/photo-1516522184673-de15e930962f?q=80&w=1000&auto=format&fit=crop",
    desc: "A symmetrical 16th-century stepwell most tourists never find.",
    distance: "6.2 km away", lat: 26.9854, lng: 75.8330
  },
  {
    id: "gem-2", name: "Chandpole Bazaar", category: "Local Market", location: "Jaipur, Rajasthan",
    img: "https://images.unsplash.com/photo-1775433205046-86e060feff06?q=80&w=1000&auto=format&fit=crop",
    desc: "Where Jaipur's artisans actually shop for pigment and marble.",
    distance: "3.1 km away", lat: 26.9239, lng: 75.8180
  },
  {
    id: "gem-3", name: "The Postbox Cafe", category: "Secret Café", location: "Udaipur, Rajasthan",
    img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=1000&auto=format&fit=crop",
    desc: "A rooftop hideout with lake views and zero crowds.",
    distance: "1.8 km away", lat: 24.5714, lng: 73.6862
  },
  {
    id: "gem-4", name: "Khempur Village Stay", category: "Village Experience", location: "Near Udaipur",
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1000&auto=format&fit=crop",
    desc: "Spend a day farming and cooking with a local family.",
    distance: "38 km away", lat: 24.4300, lng: 73.8700
  },
  {
    id: "gem-5", name: "Fort Kumbhalgarh Trails", category: "Lesser-known Fort", location: "Rajsamand, Rajasthan",
    img: "https://images.unsplash.com/photo-1713682995521-22ec819b50ac?q=80&w=1000&auto=format&fit=crop",
    desc: "The second-longest wall in the world — and near empty.",
    distance: "84 km away", lat: 25.1483, lng: 73.5844
  },
  {
    id: "gem-6", name: "Molela Terracotta Artisans", category: "Artisan Community", location: "Rajsamand, Rajasthan",
    img: "https://images.unsplash.com/photo-1768167444719-fa0759703ec5?q=80&w=1000&auto=format&fit=crop",
    desc: "Watch clay deities take shape in a village of potters.",
    distance: "45 km away", lat: 25.0700, lng: 73.8800
  },
  {
    id: "gem-7", name: "Assi Ghat Sunrise Yoga", category: "Village Experience", location: "Varanasi, Uttar Pradesh",
    img: "https://images.unsplash.com/photo-1772262325130-dd3bcf6b0cca?q=80&w=1000&auto=format&fit=crop",
    desc: "Join local practitioners for yoga as the ghats wake up.",
    distance: "4.5 km away", lat: 25.2925, lng: 83.0076
  },
  {
    id: "gem-8", name: "Kumbalangi Fishing Village", category: "Village Experience", location: "Kochi, Kerala",
    img: "https://images.unsplash.com/photo-1785707969654-916e48d882db?q=80&w=1000&auto=format&fit=crop",
    desc: "India's first model tourism village — clam farms and canoe rides.",
    distance: "14 km away", lat: 9.8697, lng: 76.3358
  },
  {
    id: "gem-9", name: "Anjuna's Secret Coves", category: "Secret Café", location: "Goa",
    img: "https://images.unsplash.com/photo-1775338600469-5506e26c5f90?q=80&w=1000&auto=format&fit=crop",
    desc: "Quiet cliffside coves past the flea market, missed by most.",
    distance: "5.4 km away", lat: 15.5936, lng: 73.7423
  },
  {
    id: "gem-10", name: "Naggar Castle Village", category: "Village Experience", location: "Himachal Pradesh",
    img: "https://images.unsplash.com/photo-1639776020915-922f56acf66d?q=80&w=1000&auto=format&fit=crop",
    desc: "A wooden Himalayan castle-turned-heritage stay, minus the crowds.",
    distance: "21 km away", lat: 32.1263, lng: 77.1665
  },
  {
    id: "gem-11", name: "Kachhpura Village Taj View", category: "Lesser-known Fort", location: "Agra, Uttar Pradesh",
    img: "https://images.unsplash.com/photo-1748433069400-3d7b4ac6b3e6?q=80&w=1000&auto=format&fit=crop",
    desc: "The same Taj view as Mehtab Bagh, from a working village and free.",
    distance: "3 km away", lat: 27.1751, lng: 78.0421
  },
  {
    id: "gem-12", name: "Chamunda Mata Sunset Point", category: "Lesser-known Fort", location: "Jodhpur, Rajasthan",
    img: "https://images.unsplash.com/photo-1634726157239-3f9311322d03?q=80&w=1000&auto=format&fit=crop",
    desc: "A cliffside temple behind Mehrangarh with the best free sunset view in the Blue City.",
    distance: "2.5 km away", lat: 26.2870, lng: 73.0243
  },
  {
    id: "gem-13", name: "Ram Bagh Garden Ruins", category: "Lesser-known Fort", location: "Amritsar, Punjab",
    img: "https://images.unsplash.com/photo-1763898303989-3299fa53a212?q=80&w=1000&auto=format&fit=crop",
    desc: "Maharaja Ranjit Singh's crumbling summer palace, empty even on weekends.",
    distance: "3.8 km away", lat: 31.6260, lng: 74.8600
  },
  {
    id: "gem-14", name: "Patna Waterfall Trail", category: "Hidden Waterfall", location: "Rishikesh, Uttarakhand",
    img: "https://images.unsplash.com/photo-1695150383041-a5b2f6db9ac8?q=80&w=1000&auto=format&fit=crop",
    desc: "A forest walk to a little-known waterfall most rafting tourists skip.",
    distance: "24 km away", lat: 30.1338, lng: 78.3410
  },
  {
    id: "gem-15", name: "Sangam River Confluence", category: "Scenic Viewpoint", location: "Nimmu, Ladakh",
    img: "https://images.unsplash.com/photo-1547453155-ae5be9428a4f?q=80&w=1000&auto=format&fit=crop",
    desc: "Where the turquoise Zanskar meets the muddy Indus — dramatic and nearly empty.",
    distance: "35 km away", lat: 34.1526, lng: 77.2010
  },
  {
    id: "gem-16", name: "Sanapur Lake", category: "Hidden Lake", location: "Hampi, Karnataka",
    img: "https://images.unsplash.com/photo-1652820331058-710073803085?q=80&w=1000&auto=format&fit=crop",
    desc: "A boulder-ringed lake past the Bat Cave, reachable only by coracle or foot.",
    distance: "6 km away", lat: 15.3550, lng: 76.4970
  },
  {
    id: "gem-17", name: "Agrasen ki Baoli", category: "Hidden Stepwell", location: "Delhi",
    img: "https://images.unsplash.com/photo-1743389384749-3af712ff81b7?q=80&w=1000&auto=format&fit=crop",
    desc: "A 108-step stepwell tucked between Connaught Place high-rises.",
    distance: "1.5 km away", lat: 28.6296, lng: 77.2246
  },
  {
    id: "gem-18", name: "Saluvankuppam Fishing Hamlet", category: "Village Experience", location: "Mahabalipuram, Tamil Nadu",
    img: "https://images.unsplash.com/photo-1766998112633-5b5c2447c259?q=80&w=1000&auto=format&fit=crop",
    desc: "A working fishing village beside a buried 7th-century temple complex.",
    distance: "4 km away", lat: 12.6390, lng: 80.1970
  }
];

const INTERESTS = ["Heritage", "Food", "Adventure", "Culture", "Nature", "Shopping", "Photography"];
const BUDGET_OPTIONS = ["₹5,000 – ₹10,000", "₹10,000 – ₹20,000", "₹20,000 – ₹40,000", "₹40,000+"];
const TRAVEL_STYLES = [
  { id: "relaxed", label: "Relaxed", desc: "Fewer stops, more time to soak it in" },
  { id: "balanced", label: "Balanced", desc: "A healthy mix of sights and downtime" },
  { id: "packed", label: "Packed", desc: "See as much as possible, every day" }
];

const SOURCE_CITIES = ["Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Hyderabad", "Ahmedabad", "Pune"];

const TRANSPORT_MODES = [
  { id: "flight", label: "Flight", icon: "plane", operators: ["IndiGo", "Air India", "Vistara", "SpiceJet"], durMin: 70, durMax: 160, priceMin: 3200, priceMax: 7800 },
  { id: "train", label: "Train", icon: "train-front", operators: ["Rajdhani Express", "Shatabdi Express", "Duronto Express", "Superfast Express"], durMin: 420, durMax: 900, priceMin: 750, priceMax: 2600 },
  { id: "bus", label: "Bus", icon: "bus", operators: ["VRL Travels", "SRS Travels", "Volvo AC Sleeper", "State Roadways"], durMin: 360, durMax: 660, priceMin: 450, priceMax: 1500 }
];

/* Deterministic mock search — same from/to/mode/date always returns the same 3 options */
function generateTransportOptions(modeId, from, to, dateStr) {
  const mode = TRANSPORT_MODES.find(m => m.id === modeId) || TRANSPORT_MODES[0];
  const seedStr = `${from}|${to}|${modeId}|${dateStr}`;
  const baseSeed = seedStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const results = [];
  for (let i = 0; i < 3; i++) {
    const s = baseSeed + i * 47;
    const operator = mode.operators[(s + i * 7) % mode.operators.length];
    const durMin = mode.durMin + ((s * 13) % (mode.durMax - mode.durMin + 1));
    const price = mode.priceMin + ((s * 29) % (mode.priceMax - mode.priceMin + 1));
    const departHour = 5 + ((s * 3) % 17);
    const departMin = [0, 15, 30, 45][(s * 5) % 4];
    const base = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
    const depart = new Date(base.getTime());
    depart.setHours(departHour, departMin, 0, 0);
    const arrive = new Date(depart.getTime() + durMin * 60000);
    const fmt = (d) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const durationLabel = durMin >= 60 ? `${Math.floor(durMin / 60)}h ${durMin % 60}m` : `${durMin}m`;
    results.push({ mode: mode.id, icon: mode.icon, operator, price, departTime: fmt(depart), arriveTime: fmt(arrive), durationLabel });
  }
  return results.sort((a, b) => a.price - b.price);
}

const ITINERARIES = {
  jaipur: {
    destination: "Jaipur", days: 3, budget: 8500, distance: 42, experiences: 12, match: 94,
    plan: [
      { day: 1, title: "Royal Jaipur", items: [
        { time: "09:00 AM", place: "Amber Fort", icon: "landmark", cost: "₹600", travel: "25 min drive" },
        { time: "11:30 AM", place: "Jaigarh Fort", icon: "castle", cost: "₹150", travel: "10 min drive" },
        { time: "01:30 PM", place: "Local Rajasthani Lunch", icon: "utensils", cost: "₹450", travel: "15 min drive" },
        { time: "03:00 PM", place: "City Palace", icon: "landmark", cost: "₹700", travel: "10 min drive" },
        { time: "06:00 PM", place: "Hawa Mahal", icon: "building-2", cost: "₹200", travel: "8 min walk" },
        { time: "08:00 PM", place: "Local Food Experience", icon: "soup", cost: "₹800", travel: "12 min drive" }
      ]},
      { day: 2, title: "Art, Bazaars & Sunset", items: [
        { time: "09:30 AM", place: "Jantar Mantar", icon: "compass", cost: "₹200", travel: "10 min walk" },
        { time: "11:00 AM", place: "Johari Bazaar Shopping", icon: "shopping-bag", cost: "₹1,000", travel: "5 min walk" },
        { time: "01:00 PM", place: "Rooftop Lunch, Old City", icon: "utensils", cost: "₹500", travel: "10 min walk" },
        { time: "04:00 PM", place: "Block-Printing Workshop", icon: "shirt", cost: "₹900", travel: "20 min drive" },
        { time: "06:30 PM", place: "Nahargarh Fort Sunset", icon: "mountain", cost: "₹100", travel: "25 min drive" },
        { time: "08:30 PM", place: "Chokhi Dhani Cultural Dinner", icon: "drama", cost: "₹1,200", travel: "35 min drive" }
      ]},
      { day: 3, title: "Hidden Jaipur", items: [
        { time: "08:30 AM", place: "Panna Meena ka Kund", icon: "waves", cost: "Free", travel: "20 min drive" },
        { time: "10:30 AM", place: "Chandpole Artisan Walk", icon: "palette", cost: "₹500", travel: "15 min drive" },
        { time: "01:00 PM", place: "Farewell Thali Lunch", icon: "utensils", cost: "₹400", travel: "10 min drive" },
        { time: "03:00 PM", place: "Albert Hall Museum", icon: "landmark", cost: "₹300", travel: "12 min drive" },
        { time: "06:00 PM", place: "Airport / Onward Journey", icon: "plane", cost: "—", travel: "30 min drive" }
      ]}
    ]
  },
  udaipur: {
    destination: "Udaipur", days: 3, budget: 9200, distance: 35, experiences: 11, match: 92,
    plan: [
      { day: 1, title: "Lakes & Palaces", items: [
        { time: "09:00 AM", place: "City Palace Udaipur", icon: "landmark", cost: "₹300", travel: "15 min drive" },
        { time: "11:00 AM", place: "Jagdish Temple", icon: "church", cost: "Free", travel: "5 min walk" },
        { time: "01:00 PM", place: "Lake Pichola Boat Ride", icon: "ship", cost: "₹700", travel: "10 min walk" },
        { time: "06:30 PM", place: "Bagore ki Haveli Folk Show", icon: "drama", cost: "₹250", travel: "8 min walk" }
      ]},
      { day: 2, title: "Gardens & Handicrafts", items: [
        { time: "09:00 AM", place: "Saheliyon ki Bari Gardens", icon: "flower-2", cost: "₹50", travel: "20 min drive" },
        { time: "11:00 AM", place: "Fateh Sagar Lake", icon: "waves", cost: "Free", travel: "10 min drive" },
        { time: "01:00 PM", place: "Shilpgram Crafts Village", icon: "palette", cost: "₹100", travel: "25 min drive" },
        { time: "05:30 PM", place: "Sajjangarh Monsoon Palace Sunset", icon: "mountain", cost: "₹200", travel: "30 min drive" }
      ]},
      { day: 3, title: "Local Udaipur", items: [
        { time: "09:00 AM", place: "Vintage & Classic Car Museum", icon: "camera", cost: "₹350", travel: "15 min drive" },
        { time: "11:00 AM", place: "Hathipole Local Bazaar", icon: "shopping-bag", cost: "₹800", travel: "10 min drive" },
        { time: "01:00 PM", place: "Ambrai Ghat Lakeside Lunch", icon: "utensils", cost: "₹550", travel: "10 min drive" },
        { time: "04:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "30 min drive" }
      ]}
    ]
  },
  jodhpur: {
    destination: "Jodhpur", days: 3, budget: 8000, distance: 38, experiences: 10, match: 91,
    plan: [
      { day: 1, title: "Fort City", items: [
        { time: "09:00 AM", place: "Mehrangarh Fort", icon: "castle", cost: "₹600", travel: "20 min drive" },
        { time: "11:30 AM", place: "Jaswant Thada", icon: "landmark", cost: "₹50", travel: "10 min drive" },
        { time: "01:30 PM", place: "Sardar Market & Clock Tower", icon: "shopping-bag", cost: "₹500", travel: "15 min drive" },
        { time: "04:00 PM", place: "Umaid Bhawan Palace Museum", icon: "building-2", cost: "₹300", travel: "20 min drive" }
      ]},
      { day: 2, title: "The Blue City", items: [
        { time: "09:00 AM", place: "Toorji Ka Jhalra Stepwell", icon: "waves", cost: "Free", travel: "10 min drive" },
        { time: "10:30 AM", place: "Blue City Walking Tour", icon: "footprints", cost: "₹400", travel: "5 min walk" },
        { time: "01:00 PM", place: "Local Thali Lunch", icon: "utensils", cost: "₹350", travel: "10 min drive" },
        { time: "04:00 PM", place: "Mandore Gardens", icon: "flower-2", cost: "₹50", travel: "20 min drive" }
      ]},
      { day: 3, title: "Desert & Departure", items: [
        { time: "08:30 AM", place: "Rao Jodha Desert Rock Park", icon: "mountain", cost: "₹200", travel: "15 min drive" },
        { time: "11:00 AM", place: "Kaylana Lake", icon: "waves", cost: "Free", travel: "20 min drive" },
        { time: "01:00 PM", place: "Marwar Handicrafts Shopping", icon: "shopping-bag", cost: "₹700", travel: "15 min drive" },
        { time: "04:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "20 min drive" }
      ]}
    ]
  },
  varanasi: {
    destination: "Varanasi", days: 3, budget: 7200, distance: 28, experiences: 13, match: 95,
    plan: [
      { day: 1, title: "Ganga & Ghats", items: [
        { time: "05:30 AM", place: "Sunrise Boat Ride on the Ganges", icon: "sunrise", cost: "₹400", travel: "10 min walk" },
        { time: "08:00 AM", place: "Kashi Vishwanath Temple", icon: "church", cost: "Free", travel: "10 min walk" },
        { time: "01:00 PM", place: "Local Kachori-Sabzi Lunch", icon: "utensils", cost: "₹150", travel: "5 min walk" },
        { time: "06:30 PM", place: "Ganga Aarti at Dashashwamedh Ghat", icon: "flame", cost: "Free", travel: "10 min walk" }
      ]},
      { day: 2, title: "Heritage & Craft", items: [
        { time: "09:00 AM", place: "Sarnath Buddhist Site", icon: "landmark", cost: "₹300", travel: "25 min drive" },
        { time: "11:30 AM", place: "Banaras Hindu University Campus", icon: "building-2", cost: "Free", travel: "20 min drive" },
        { time: "02:00 PM", place: "Banarasi Silk Weaving Workshop", icon: "palette", cost: "₹600", travel: "15 min drive" },
        { time: "05:00 PM", place: "Manikarnika Ghat Walk", icon: "footprints", cost: "Free", travel: "10 min walk" }
      ]},
      { day: 3, title: "Local Mornings", items: [
        { time: "06:30 AM", place: "Assi Ghat Sunrise Yoga", icon: "sunrise", cost: "₹200", travel: "15 min drive" },
        { time: "10:00 AM", place: "Local Market Shopping", icon: "shopping-bag", cost: "₹500", travel: "10 min drive" },
        { time: "01:00 PM", place: "Banarasi Paan Tasting", icon: "soup", cost: "₹100", travel: "5 min walk" },
        { time: "04:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "30 min drive" }
      ]}
    ]
  },
  kerala: {
    destination: "Kerala", days: 3, budget: 12500, distance: 96, experiences: 14, match: 93,
    plan: [
      { day: 1, title: "Fort Kochi", items: [
        { time: "09:00 AM", place: "Fort Kochi Walking Tour", icon: "footprints", cost: "₹300", travel: "10 min walk" },
        { time: "11:00 AM", place: "Chinese Fishing Nets", icon: "anchor", cost: "Free", travel: "10 min walk" },
        { time: "01:00 PM", place: "Kerala Sadya Lunch", icon: "utensils", cost: "₹450", travel: "10 min drive" },
        { time: "06:00 PM", place: "Kathakali Dance Show", icon: "drama", cost: "₹500", travel: "10 min drive" }
      ]},
      { day: 2, title: "Backwaters", items: [
        { time: "09:00 AM", place: "Alleppey Backwater Houseboat", icon: "ship", cost: "₹4,500", travel: "1.5 hr drive" },
        { time: "12:00 PM", place: "Village Canoe Ride", icon: "waves", cost: "₹600", travel: "onboard" },
        { time: "02:00 PM", place: "Toddy Shop Local Lunch", icon: "soup", cost: "₹350", travel: "onboard" },
        { time: "05:30 PM", place: "Sunset on the Backwaters", icon: "sunset", cost: "Free", travel: "onboard" }
      ]},
      { day: 3, title: "Spice & Shore", items: [
        { time: "09:00 AM", place: "Spice Plantation Tour", icon: "flower-2", cost: "₹400", travel: "40 min drive" },
        { time: "12:00 PM", place: "Local Spice Market", icon: "shopping-bag", cost: "₹700", travel: "15 min drive" },
        { time: "03:00 PM", place: "Ayurvedic Massage Session", icon: "sparkles", cost: "₹1,800", travel: "10 min drive" },
        { time: "05:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "30 min drive" }
      ]}
    ]
  },
  "himachal pradesh": {
    destination: "Himachal Pradesh", days: 3, budget: 10800, distance: 64, experiences: 12, match: 90,
    plan: [
      { day: 1, title: "Old Manali", items: [
        { time: "09:00 AM", place: "Hadimba Temple", icon: "church", cost: "Free", travel: "15 min drive" },
        { time: "11:00 AM", place: "Old Manali Café Walk", icon: "footprints", cost: "₹300", travel: "10 min walk" },
        { time: "01:00 PM", place: "Local Himachali Thali", icon: "utensils", cost: "₹400", travel: "10 min walk" },
        { time: "05:00 PM", place: "Mall Road Shopping", icon: "shopping-bag", cost: "₹800", travel: "15 min drive" }
      ]},
      { day: 2, title: "Adventure Day", items: [
        { time: "08:00 AM", place: "Solang Valley", icon: "mountain", cost: "₹200", travel: "40 min drive" },
        { time: "10:00 AM", place: "Paragliding", icon: "bird", cost: "₹2,500", travel: "onsite" },
        { time: "01:00 PM", place: "Local Valley Lunch", icon: "utensils", cost: "₹450", travel: "10 min drive" },
        { time: "04:00 PM", place: "Vashisht Hot Springs", icon: "waves", cost: "₹100", travel: "25 min drive" }
      ]},
      { day: 3, title: "Mountain Pass", items: [
        { time: "07:00 AM", place: "Rohtang Pass / Snow Point", icon: "mountain", cost: "₹550", travel: "1.5 hr drive" },
        { time: "12:00 PM", place: "Local Apple Orchards", icon: "flower-2", cost: "₹150", travel: "30 min drive" },
        { time: "02:00 PM", place: "Tibetan Monastery Visit", icon: "landmark", cost: "Free", travel: "15 min drive" },
        { time: "05:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "40 min drive" }
      ]}
    ]
  },
  goa: {
    destination: "Goa", days: 3, budget: 11500, distance: 58, experiences: 15, match: 92,
    plan: [
      { day: 1, title: "North Goa Beaches", items: [
        { time: "08:00 AM", place: "Baga Beach Morning", icon: "waves", cost: "Free", travel: "10 min drive" },
        { time: "11:00 AM", place: "Fort Aguada", icon: "landmark", cost: "₹25", travel: "20 min drive" },
        { time: "01:00 PM", place: "Goan Fish Curry Lunch", icon: "utensils", cost: "₹500", travel: "10 min drive" },
        { time: "05:30 PM", place: "Sunset Cruise on Mandovi River", icon: "ship", cost: "₹700", travel: "15 min drive" }
      ]},
      { day: 2, title: "Old Goa & Markets", items: [
        { time: "09:00 AM", place: "Basilica of Bom Jesus", icon: "church", cost: "Free", travel: "25 min drive" },
        { time: "11:30 AM", place: "Spice Plantation Tour", icon: "flower-2", cost: "₹600", travel: "30 min drive" },
        { time: "02:00 PM", place: "Local Feni Tasting", icon: "soup", cost: "₹300", travel: "10 min drive" },
        { time: "04:00 PM", place: "Anjuna Flea Market", icon: "shopping-bag", cost: "₹900", travel: "20 min drive" }
      ]},
      { day: 3, title: "Falls & Farewell", items: [
        { time: "07:00 AM", place: "Dudhsagar Waterfalls Trip", icon: "waves", cost: "₹1,200", travel: "1.5 hr drive" },
        { time: "12:00 PM", place: "Water Sports at Candolim", icon: "anchor", cost: "₹1,500", travel: "45 min drive" },
        { time: "06:00 PM", place: "Beach Shack Farewell Dinner", icon: "utensils", cost: "₹800", travel: "15 min drive" },
        { time: "09:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "30 min drive" }
      ]}
    ]
  },
  agra: {
    destination: "Agra", days: 3, budget: 7800, distance: 46, experiences: 10, match: 96,
    plan: [
      { day: 1, title: "The Taj", items: [
        { time: "06:00 AM", place: "Taj Mahal Sunrise Visit", icon: "landmark", cost: "₹1,100", travel: "10 min drive" },
        { time: "09:00 AM", place: "Mehtab Bagh Viewpoint", icon: "flower-2", cost: "₹300", travel: "15 min drive" },
        { time: "01:00 PM", place: "Petha Sweet Tasting", icon: "soup", cost: "₹150", travel: "10 min drive" },
        { time: "03:30 PM", place: "Agra Fort", icon: "castle", cost: "₹650", travel: "15 min drive" }
      ]},
      { day: 2, title: "Mughal Trail", items: [
        { time: "08:00 AM", place: "Fatehpur Sikri Day Trip", icon: "landmark", cost: "₹610", travel: "1 hr drive" },
        { time: "01:00 PM", place: "Marble Inlay Workshop", icon: "palette", cost: "₹500", travel: "20 min drive" },
        { time: "04:00 PM", place: "Itmad-ud-Daulah (Baby Taj)", icon: "building-2", cost: "₹310", travel: "15 min drive" },
        { time: "07:00 PM", place: "Mughal-themed Dinner", icon: "utensils", cost: "₹900", travel: "10 min drive" }
      ]},
      { day: 3, title: "Local Agra", items: [
        { time: "09:00 AM", place: "Kinari Bazaar Shopping", icon: "shopping-bag", cost: "₹700", travel: "10 min drive" },
        { time: "11:30 AM", place: "Leather & Handicrafts Market", icon: "shopping-bag", cost: "₹500", travel: "10 min drive" },
        { time: "01:30 PM", place: "Farewell Thali Lunch", icon: "utensils", cost: "₹400", travel: "10 min drive" },
        { time: "04:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "20 min drive" }
      ]}
    ]
  },
  amritsar: {
    destination: "Amritsar", days: 3, budget: 6800, distance: 32, experiences: 9, match: 93,
    plan: [
      { day: 1, title: "Golden Temple", items: [
        { time: "06:00 AM", place: "Golden Temple Darshan", icon: "landmark", cost: "Free", travel: "10 min drive" },
        { time: "09:00 AM", place: "Langar Community Kitchen", icon: "utensils", cost: "Free (donation)", travel: "5 min walk" },
        { time: "11:00 AM", place: "Jallianwala Bagh", icon: "landmark", cost: "Free", travel: "5 min walk" },
        { time: "01:00 PM", place: "Amritsari Kulcha Lunch", icon: "soup", cost: "₹200", travel: "10 min drive" }
      ]},
      { day: 2, title: "History & Border", items: [
        { time: "09:00 AM", place: "Partition Museum", icon: "landmark", cost: "₹100", travel: "10 min drive" },
        { time: "11:30 AM", place: "Local Bazaar Shopping", icon: "shopping-bag", cost: "₹700", travel: "10 min drive" },
        { time: "05:00 PM", place: "Wagah Border Retreat Ceremony", icon: "flag", cost: "Free", travel: "45 min drive" }
      ]},
      { day: 3, title: "Local Punjab", items: [
        { time: "09:00 AM", place: "Gobindgarh Fort", icon: "castle", cost: "₹150", travel: "15 min drive" },
        { time: "11:00 AM", place: "Punjabi Folk Breakfast", icon: "utensils", cost: "₹300", travel: "10 min drive" },
        { time: "01:00 PM", place: "Akal Takht Visit", icon: "church", cost: "Free", travel: "10 min drive" },
        { time: "04:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "20 min drive" }
      ]}
    ]
  },
  rishikesh: {
    destination: "Rishikesh", days: 3, budget: 8900, distance: 40, experiences: 13, match: 91,
    plan: [
      { day: 1, title: "Ganga Ghats", items: [
        { time: "08:00 AM", place: "Laxman Jhula & Ram Jhula", icon: "waves", cost: "Free", travel: "10 min walk" },
        { time: "10:00 AM", place: "Beatles Ashram", icon: "landmark", cost: "₹150", travel: "15 min drive" },
        { time: "01:00 PM", place: "Local Sattvic Lunch", icon: "utensils", cost: "₹300", travel: "10 min walk" },
        { time: "06:00 PM", place: "Ganga Aarti at Triveni Ghat", icon: "flame", cost: "Free", travel: "10 min drive" }
      ]},
      { day: 2, title: "Adventure Day", items: [
        { time: "08:00 AM", place: "White Water Rafting", icon: "waves", cost: "₹800", travel: "20 min drive" },
        { time: "11:00 AM", place: "Cliff Jumping at Kaudiyala", icon: "mountain", cost: "₹500", travel: "10 min drive" },
        { time: "02:00 PM", place: "Riverside Café Lunch", icon: "utensils", cost: "₹450", travel: "15 min drive" },
        { time: "05:00 PM", place: "Yoga & Meditation Session", icon: "sparkles", cost: "₹400", travel: "10 min drive" }
      ]},
      { day: 3, title: "Local Trails", items: [
        { time: "07:00 AM", place: "Neelkanth Mahadev Temple Trek", icon: "mountain", cost: "Free", travel: "45 min drive" },
        { time: "11:00 AM", place: "Local Ashram Visit", icon: "church", cost: "Free", travel: "15 min drive" },
        { time: "02:00 PM", place: "Patna Waterfall Visit", icon: "waves", cost: "₹50", travel: "20 min drive" },
        { time: "05:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "30 min drive" }
      ]}
    ]
  },
  ladakh: {
    destination: "Ladakh", days: 3, budget: 15500, distance: 220, experiences: 11, match: 89,
    plan: [
      { day: 1, title: "Leh Town", items: [
        { time: "09:00 AM", place: "Leh Palace", icon: "castle", cost: "₹100", travel: "10 min drive" },
        { time: "11:00 AM", place: "Shanti Stupa", icon: "landmark", cost: "Free", travel: "15 min drive" },
        { time: "01:00 PM", place: "Local Ladakhi Thali", icon: "utensils", cost: "₹400", travel: "10 min drive" },
        { time: "04:00 PM", place: "Leh Market Walk", icon: "shopping-bag", cost: "₹600", travel: "10 min drive" }
      ]},
      { day: 2, title: "Pangong Lake", items: [
        { time: "06:00 AM", place: "Pangong Lake Day Trip", icon: "waves", cost: "₹2,500", travel: "5 hr drive" },
        { time: "11:00 AM", place: "Lakeside Photography", icon: "camera", cost: "Free", travel: "onsite" },
        { time: "01:00 PM", place: "Packed Lunch by the Lake", icon: "utensils", cost: "₹300", travel: "onsite" },
        { time: "06:00 PM", place: "Return to Leh", icon: "mountain", cost: "—", travel: "5 hr drive" }
      ]},
      { day: 3, title: "Nubra Valley", items: [
        { time: "07:00 AM", place: "Nubra Valley & Diskit Monastery", icon: "landmark", cost: "₹500", travel: "4 hr drive" },
        { time: "12:00 PM", place: "Camel Safari at Hunder Dunes", icon: "footprints", cost: "₹800", travel: "onsite" },
        { time: "03:00 PM", place: "Local Handicrafts Shopping", icon: "shopping-bag", cost: "₹500", travel: "onsite" },
        { time: "05:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "1 hr drive" }
      ]}
    ]
  },
  hampi: {
    destination: "Hampi", days: 3, budget: 6900, distance: 26, experiences: 12, match: 90,
    plan: [
      { day: 1, title: "Temple Ruins", items: [
        { time: "09:00 AM", place: "Virupaksha Temple", icon: "church", cost: "₹50", travel: "10 min walk" },
        { time: "11:00 AM", place: "Hampi Bazaar", icon: "shopping-bag", cost: "₹300", travel: "5 min walk" },
        { time: "01:00 PM", place: "South Indian Thali Lunch", icon: "utensils", cost: "₹200", travel: "10 min walk" },
        { time: "03:30 PM", place: "Vittala Temple & Stone Chariot", icon: "landmark", cost: "₹600", travel: "20 min drive" }
      ]},
      { day: 2, title: "River & Ruins", items: [
        { time: "06:00 AM", place: "Matanga Hill Sunrise", icon: "sunrise", cost: "Free", travel: "15 min walk" },
        { time: "09:00 AM", place: "Coracle Ride on Tungabhadra River", icon: "ship", cost: "₹300", travel: "10 min drive" },
        { time: "01:00 PM", place: "Local Riverside Café Lunch", icon: "utensils", cost: "₹350", travel: "10 min drive" },
        { time: "03:00 PM", place: "Lotus Mahal & Elephant Stables", icon: "landmark", cost: "₹300", travel: "15 min drive" }
      ]},
      { day: 3, title: "Anegundi Village", items: [
        { time: "08:00 AM", place: "Anegundi Village Walk", icon: "footprints", cost: "Free", travel: "20 min drive" },
        { time: "11:00 AM", place: "Local Handicraft Shopping", icon: "palette", cost: "₹500", travel: "10 min drive" },
        { time: "01:00 PM", place: "Farewell Lunch", icon: "utensils", cost: "₹300", travel: "10 min drive" },
        { time: "04:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "20 min drive" }
      ]}
    ]
  },
  delhi: {
    destination: "Delhi", days: 3, budget: 7000, distance: 30, experiences: 13, match: 95,
    plan: [
      { day: 1, title: "Old Delhi", items: [
        { time: "09:00 AM", place: "Red Fort", icon: "castle", cost: "₹550", travel: "15 min drive" },
        { time: "11:00 AM", place: "Jama Masjid", icon: "church", cost: "Free", travel: "5 min walk" },
        { time: "12:30 PM", place: "Chandni Chowk Street Food", icon: "soup", cost: "₹300", travel: "10 min walk" },
        { time: "03:00 PM", place: "Humayun's Tomb", icon: "landmark", cost: "₹550", travel: "25 min drive" },
        { time: "06:00 PM", place: "India Gate Evening Walk", icon: "landmark", cost: "Free", travel: "15 min drive" }
      ]},
      { day: 2, title: "Museums & Markets", items: [
        { time: "09:00 AM", place: "Qutub Minar", icon: "landmark", cost: "₹600", travel: "20 min drive" },
        { time: "11:30 AM", place: "Lotus Temple", icon: "church", cost: "Free", travel: "20 min drive" },
        { time: "01:00 PM", place: "Local Thali Lunch", icon: "utensils", cost: "₹400", travel: "10 min drive" },
        { time: "03:00 PM", place: "National Museum", icon: "landmark", cost: "₹300", travel: "15 min drive" },
        { time: "06:00 PM", place: "Dilli Haat Shopping", icon: "shopping-bag", cost: "₹500", travel: "15 min drive" }
      ]},
      { day: 3, title: "Local Delhi", items: [
        { time: "09:00 AM", place: "Akshardham Temple", icon: "church", cost: "Free", travel: "20 min drive" },
        { time: "12:00 PM", place: "Connaught Place Walk", icon: "footprints", cost: "Free", travel: "20 min drive" },
        { time: "01:30 PM", place: "Farewell Lunch", icon: "utensils", cost: "₹450", travel: "10 min drive" },
        { time: "04:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "30 min drive" }
      ]}
    ]
  },
  mahabalipuram: {
    destination: "Mahabalipuram", days: 3, budget: 6000, distance: 20, experiences: 10, match: 92,
    plan: [
      { day: 1, title: "Shore Temples", items: [
        { time: "09:00 AM", place: "Shore Temple", icon: "landmark", cost: "₹40", travel: "10 min drive" },
        { time: "11:00 AM", place: "Pancha Rathas (Five Rathas)", icon: "landmark", cost: "₹40", travel: "10 min drive" },
        { time: "01:00 PM", place: "South Indian Thali Lunch", icon: "utensils", cost: "₹250", travel: "10 min drive" },
        { time: "03:30 PM", place: "Arjuna's Penance", icon: "landmark", cost: "Free", travel: "5 min walk" },
        { time: "06:00 PM", place: "Sunset at the Beach", icon: "waves", cost: "Free", travel: "5 min walk" }
      ]},
      { day: 2, title: "Craft & Coast", items: [
        { time: "09:00 AM", place: "Stone Sculpting Workshop", icon: "palette", cost: "₹600", travel: "10 min drive" },
        { time: "12:00 PM", place: "Tiger Cave", icon: "landmark", cost: "Free", travel: "15 min drive" },
        { time: "01:30 PM", place: "Seafood Lunch", icon: "utensils", cost: "₹450", travel: "10 min drive" },
        { time: "04:00 PM", place: "Crocodile Bank Visit", icon: "landmark", cost: "₹50", travel: "20 min drive" },
        { time: "06:30 PM", place: "Beachside Café", icon: "utensils", cost: "₹300", travel: "10 min drive" }
      ]},
      { day: 3, title: "Local Mahabalipuram", items: [
        { time: "09:00 AM", place: "Fishing Village Walk", icon: "footprints", cost: "Free", travel: "10 min drive" },
        { time: "11:00 AM", place: "Handicraft Market", icon: "shopping-bag", cost: "₹500", travel: "10 min drive" },
        { time: "01:00 PM", place: "Farewell Lunch", icon: "utensils", cost: "₹350", travel: "10 min drive" },
        { time: "04:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "20 min drive" }
      ]}
    ]
  }
};

const ITINERARY_ALIASES = {
  kochi: "kerala", munnar: "kerala", alleppey: "kerala", alappuzha: "kerala", trivandrum: "kerala", wayanad: "kerala",
  manali: "himachal pradesh", shimla: "himachal pradesh", himachal: "himachal pradesh", dharamshala: "himachal pradesh", spiti: "himachal pradesh",
  leh: "ladakh", nubra: "ladakh",
  panjim: "goa", panaji: "goa", "north goa": "goa", "south goa": "goa",
  taj: "agra", "taj mahal": "agra",
  "new delhi": "delhi", ncr: "delhi",
  mamallapuram: "mahabalipuram", "mahabalipuram beach": "mahabalipuram"
};

/* Generic fallback so any typed destination still gets a city-specific-looking plan */
function buildGenericItinerary(destination) {
  const d = destination.trim().replace(/\b\w/g, c => c.toUpperCase());
  return {
    destination: d, days: 3, budget: 9000, distance: 45, experiences: 9, match: 85,
    plan: [
      { day: 1, title: `Welcome to ${d}`, items: [
        { time: "09:00 AM", place: `${d} Heritage Landmark`, icon: "landmark", cost: "₹400", travel: "20 min drive" },
        { time: "12:00 PM", place: `${d} Old Town Walk`, icon: "footprints", cost: "Free", travel: "10 min walk" },
        { time: "01:30 PM", place: `Local ${d} Cuisine Lunch`, icon: "utensils", cost: "₹450", travel: "10 min drive" },
        { time: "06:00 PM", place: `${d} Sunset Viewpoint`, icon: "sunset", cost: "₹100", travel: "15 min drive" }
      ]},
      { day: 2, title: `Markets & Culture`, items: [
        { time: "09:30 AM", place: `${d} Local Market`, icon: "shopping-bag", cost: "₹800", travel: "10 min drive" },
        { time: "12:30 PM", place: `${d} Craft Workshop`, icon: "palette", cost: "₹600", travel: "15 min drive" },
        { time: "02:00 PM", place: `Rooftop Lunch, ${d}`, icon: "utensils", cost: "₹500", travel: "10 min walk" },
        { time: "07:00 PM", place: `${d} Cultural Evening`, icon: "drama", cost: "₹700", travel: "20 min drive" }
      ]},
      { day: 3, title: `Hidden ${d}`, items: [
        { time: "08:30 AM", place: `${d} Local Neighbourhood Walk`, icon: "compass", cost: "Free", travel: "10 min drive" },
        { time: "11:00 AM", place: `${d} Museum`, icon: "landmark", cost: "₹300", travel: "15 min drive" },
        { time: "01:00 PM", place: "Farewell Local Lunch", icon: "utensils", cost: "₹400", travel: "10 min drive" },
        { time: "04:00 PM", place: "Departure", icon: "plane", cost: "—", travel: "30 min drive" }
      ]}
    ]
  };
}

function getItineraryBase(destination) {
  const key = (destination || "").trim().toLowerCase();
  const resolved = ITINERARY_ALIASES[key] || key;
  return ITINERARIES[resolved] || buildGenericItinerary(destination || "Your Destination");
}

const LEISURE_DAY_TEMPLATES = [
  { title: "Leisure & Local Discovery", items: [
    { time: "09:30 AM", place: "Local Neighbourhood Walk", icon: "footprints", cost: "Free", travel: "10 min drive" },
    { time: "12:00 PM", place: "Free Time / Local Market", icon: "shopping-bag", cost: "₹500", travel: "10 min drive" },
    { time: "01:30 PM", place: "Local Lunch", icon: "utensils", cost: "₹400", travel: "10 min drive" },
    { time: "05:00 PM", place: "Relax at Hotel", icon: "moon", cost: "—", travel: "—" }
  ]},
  { title: "Extra Exploration Day", items: [
    { time: "09:00 AM", place: "Nearby Viewpoint", icon: "mountain", cost: "₹150", travel: "20 min drive" },
    { time: "11:30 AM", place: "Local Café Break", icon: "utensils", cost: "₹250", travel: "10 min walk" },
    { time: "02:00 PM", place: "Optional Day Trip", icon: "compass", cost: "₹700", travel: "30 min drive" },
    { time: "07:00 PM", place: "Evening Free Time", icon: "sunset", cost: "—", travel: "—" }
  ]}
];

/* Scales a base itinerary's plan to the requested number of days, truncating
   or extending with leisure-day fillers, and re-derives the summary numbers. */
function getItinerary(destination, days) {
  const base = getItineraryBase(destination);
  const n = Math.min(Math.max(parseInt(days, 10) || base.days, 1), 14);
  if (n === base.days) return base;

  let plan;
  if (n < base.days) {
    plan = base.plan.slice(0, n).map((d, i) => ({ ...d, day: i + 1 }));
  } else {
    plan = base.plan.map((d, i) => ({ ...d, day: i + 1 }));
    for (let i = base.days; i < n; i++) {
      const filler = LEISURE_DAY_TEMPLATES[(i - base.days) % LEISURE_DAY_TEMPLATES.length];
      plan.push({ day: i + 1, title: filler.title, items: filler.items });
    }
  }

  const perDayBudget = Math.round(base.budget / base.days);
  const perDayDistance = Math.round(base.distance / base.days);
  const perDayExperiences = base.experiences / base.days;

  return {
    ...base,
    days: n,
    budget: perDayBudget * n,
    distance: perDayDistance * n,
    experiences: Math.max(1, Math.round(perDayExperiences * n)),
    match: n > base.days ? Math.max(80, base.match - (n - base.days) * 2) : base.match,
    plan
  };
}

const PROVIDERS = [
  {
    id: "p1", name: "Rajesh Sharma", role: "Heritage Guide", category: "guides",
    location: "Jaipur, Rajasthan", rating: 4.9, reviews: 214, price: "₹800 / person",
    img: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Heritage Walk"
  },
  {
    id: "p2", name: "Meera Iyer", role: "Local Storyteller", category: "guides",
    location: "Varanasi, Uttar Pradesh", rating: 4.8, reviews: 152, price: "₹650 / person",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Local Storyteller"
  },
  {
    id: "p3", name: "Arjun Nair", role: "City Guide", category: "guides",
    location: "Kochi, Kerala", rating: 4.7, reviews: 98, price: "₹550 / person",
    img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "City Guide"
  },
  {
    id: "p4", name: "Meera Photography", role: "Travel Photography", category: "photographers",
    location: "Udaipur, Rajasthan", rating: 4.8, reviews: 176, price: "₹2,500 / session",
    img: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Travel Photography"
  },
  {
    id: "p5", name: "Kabir Studios", role: "Couple Photography", category: "photographers",
    location: "Jodhpur, Rajasthan", rating: 4.9, reviews: 133, price: "₹3,200 / session",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Couple Photography"
  },
  {
    id: "p6", name: "Heritage Lens Co.", role: "Heritage Photography", category: "photographers",
    location: "Jaipur, Rajasthan", rating: 4.7, reviews: 89, price: "₹2,000 / session",
    img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format&fit=crop",
    verified: false, tag: "Heritage Photography"
  },
  {
    id: "p7", name: "Vikram Rentals", role: "Bike Rental", category: "rentals",
    location: "Jaipur, Rajasthan", rating: 4.6, reviews: 240, price: "₹400 / day",
    img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Bike"
  },
  {
    id: "p8", name: "Desai Self-Drive", role: "Car Rental", category: "rentals",
    location: "Udaipur, Rajasthan", rating: 4.5, reviews: 118, price: "₹1,800 / day",
    img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Car"
  },
  {
    id: "p9", name: "FrameHire", role: "Camera Rental", category: "rentals",
    location: "Jaipur, Rajasthan", rating: 4.7, reviews: 64, price: "₹900 / day",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop",
    verified: false, tag: "Camera"
  },
  {
    id: "p10", name: "Sunita's Kitchen", role: "Cooking Class", category: "experiences",
    location: "Jaipur, Rajasthan", rating: 4.9, reviews: 301, price: "₹1,200 / person",
    img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Cooking Class"
  },
  {
    id: "p11", name: "Molela Artisans Collective", role: "Craft Workshop", category: "experiences",
    location: "Rajsamand, Rajasthan", rating: 4.8, reviews: 77, price: "₹700 / person",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Craft Workshop"
  },
  {
    id: "p12", name: "Chokhi Roots", role: "Cultural Experience", category: "experiences",
    location: "Jaipur, Rajasthan", rating: 4.6, reviews: 189, price: "₹1,500 / person",
    img: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Cultural Experience"
  },
  {
    id: "p13", name: "Rico D'Souza", role: "Beach & Heritage Guide", category: "guides",
    location: "Goa", rating: 4.8, reviews: 142, price: "₹700 / person",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Beach Walk"
  },
  {
    id: "p14", name: "Imran Khan", role: "Taj Heritage Guide", category: "guides",
    location: "Agra, Uttar Pradesh", rating: 4.9, reviews: 268, price: "₹750 / person",
    img: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=400&auto=format&fit=crop",
    verified: true, tag: "Heritage Walk"
  }
];

const HOTELS = [
  {
    id: "h-jaipur", name: "Haveli Heritage Stay", destId: "jaipur", location: "Jaipur, Rajasthan",
    img: "https://images.unsplash.com/photo-1678786591418-2b107bdda369?q=80&w=600&auto=format&fit=crop",
    rating: 4.7, reviews: 312, pricePerNight: 4200, verified: true,
    amenities: ["Free WiFi", "Breakfast Included", "Rooftop View"]
  },
  {
    id: "h-udaipur", name: "Lake View Palace Homestay", destId: "udaipur", location: "Udaipur, Rajasthan",
    img: "https://images.unsplash.com/photo-1669043962136-224323f6fa1a?q=80&w=600&auto=format&fit=crop",
    rating: 4.8, reviews: 268, pricePerNight: 5200, verified: true,
    amenities: ["Lake View", "Free WiFi", "Breakfast Included"]
  },
  {
    id: "h-jodhpur", name: "Blue City Boutique Haveli", destId: "jodhpur", location: "Jodhpur, Rajasthan",
    img: "https://images.unsplash.com/photo-1759065662057-0c008c001d8d?q=80&w=600&auto=format&fit=crop",
    rating: 4.6, reviews: 189, pricePerNight: 3600, verified: true,
    amenities: ["Fort View", "Free WiFi", "Rooftop Restaurant"]
  },
  {
    id: "h-varanasi", name: "Ganga Ghat Heritage Inn", destId: "varanasi", location: "Varanasi, Uttar Pradesh",
    img: "https://images.unsplash.com/photo-1648113140562-dfd9afe14abd?q=80&w=600&auto=format&fit=crop",
    rating: 4.5, reviews: 224, pricePerNight: 2800, verified: true,
    amenities: ["Ghat View", "Free WiFi", "Breakfast Included"]
  },
  {
    id: "h-kerala", name: "Backwater Houseboat Stay", destId: "kerala", location: "Alleppey, Kerala",
    img: "https://images.unsplash.com/photo-1776761731160-8cc734210e71?q=80&w=600&auto=format&fit=crop",
    rating: 4.9, reviews: 401, pricePerNight: 6000, verified: true,
    amenities: ["All Meals Included", "Private Deck", "Backwater View"]
  },
  {
    id: "h-himachal", name: "Pinewood Mountain Lodge", destId: "himachal", location: "Manali, Himachal Pradesh",
    img: "https://images.unsplash.com/photo-1671804162411-e47765dc5c82?q=80&w=600&auto=format&fit=crop",
    rating: 4.6, reviews: 176, pricePerNight: 3200, verified: true,
    amenities: ["Mountain View", "Bonfire", "Free WiFi"]
  },
  {
    id: "h-goa", name: "Beachside Casa Retreat", destId: "goa", location: "Goa",
    img: "https://images.unsplash.com/photo-1783599677135-2acf30571ebe?q=80&w=600&auto=format&fit=crop",
    rating: 4.7, reviews: 349, pricePerNight: 4500, verified: true,
    amenities: ["Beach Access", "Pool", "Free Breakfast"]
  },
  {
    id: "h-agra", name: "Taj View Heritage Hotel", destId: "agra", location: "Agra, Uttar Pradesh",
    img: "https://images.unsplash.com/photo-1728024181315-8c7f5815bf00?q=80&w=600&auto=format&fit=crop",
    rating: 4.8, reviews: 289, pricePerNight: 3900, verified: true,
    amenities: ["Taj Mahal View", "Free WiFi", "Rooftop Restaurant"]
  },
  {
    id: "h-amritsar", name: "Golden Temple View Inn", destId: "amritsar", location: "Amritsar, Punjab",
    img: "https://images.unsplash.com/photo-1584692410681-f4289e6b7dcb?q=80&w=600&auto=format&fit=crop",
    rating: 4.6, reviews: 198, pricePerNight: 2600, verified: true,
    amenities: ["Temple View", "Free Breakfast", "Free WiFi"]
  },
  {
    id: "h-rishikesh", name: "Riverside Yoga Retreat", destId: "rishikesh", location: "Rishikesh, Uttarakhand",
    img: "https://images.unsplash.com/photo-1780283574760-e8d7fd944da5?q=80&w=600&auto=format&fit=crop",
    rating: 4.7, reviews: 154, pricePerNight: 2400, verified: true,
    amenities: ["River View", "Daily Yoga", "Vegetarian Meals"]
  },
  {
    id: "h-ladakh", name: "Leh Himalayan Guesthouse", destId: "ladakh", location: "Leh, Ladakh",
    img: "https://images.unsplash.com/photo-1638617858733-3984b5d9c10d?q=80&w=600&auto=format&fit=crop",
    rating: 4.5, reviews: 132, pricePerNight: 3300, verified: true,
    amenities: ["Mountain View", "Oxygen on Request", "Free Breakfast"]
  },
  {
    id: "h-hampi", name: "Boulder View Heritage Cottage", destId: "hampi", location: "Hampi, Karnataka",
    img: "https://images.unsplash.com/photo-1777426204090-8ab42d6fdc7c?q=80&w=600&auto=format&fit=crop",
    rating: 4.6, reviews: 121, pricePerNight: 2200, verified: true,
    amenities: ["Ruins View", "Free WiFi", "Breakfast Included"]
  }
];

/* Marketplace listing = local services + hotels, normalized to one card shape */
const ALL_SERVICES = PROVIDERS.concat(HOTELS.map(h => ({
  id: h.id, name: h.name, role: "Hotel Stay", category: "hotels",
  location: h.location, rating: h.rating, reviews: h.reviews,
  price: `₹${h.pricePerNight.toLocaleString()} / night`, pricePerNight: h.pricePerNight,
  img: h.img, verified: h.verified, tag: h.amenities[0], amenities: h.amenities
})));

const MAP_MARKERS = [
  { id: "m1", type: "heritage", name: "Amber Fort", lat: 26.9855, lng: 75.8513, info: "16th-century hill fort · ₹600 entry" },
  { id: "m2", type: "food", name: "Laxmi Misthan Bhandar", lat: 26.9196, lng: 75.8250, info: "Legendary Rajasthani sweets since 1727" },
  { id: "m3", type: "guides", name: "Rajesh — Heritage Guide", lat: 26.9239, lng: 75.8267, info: "⭐ 4.9 · ₹800/person" },
  { id: "m4", type: "rentals", name: "Vikram Rentals", lat: 26.9180, lng: 75.8100, info: "Bike rental · ₹400/day" },
  { id: "m5", type: "activities", name: "Hot Air Balloon Jaipur", lat: 26.9900, lng: 75.8600, info: "Sunrise flight · ₹9,500" },
  { id: "m6", type: "hidden", name: "Panna Meena ka Kund", lat: 26.9854, lng: 75.8330, info: "Hidden stepwell · Free entry" },
  { id: "m7", type: "hotels", name: "Haveli Heritage Stay", lat: 26.9210, lng: 75.8190, info: "Boutique haveli · ₹4,200/night" },
  { id: "m8", type: "heritage", name: "Hawa Mahal", lat: 26.9239, lng: 75.8267, info: "Palace of Winds · ₹200 entry" },
  { id: "m9", type: "heritage", name: "City Palace Jaipur", lat: 26.9258, lng: 75.8237, info: "Royal residence & museum · ₹700 entry" },
  { id: "m10", type: "food", name: "Rooftop Cafe, Old City", lat: 26.9225, lng: 75.8255, info: "Views of Hawa Mahal while you eat" }
];

const PASSPORT = {
  name: "Gitin",
  level: "Explorer",
  levelNum: 4,
  xp: 680,
  xpNext: 1000,
  stats: { cities: 8, places: 23, experiences: 7, gems: 4 },
  journey: [
    { city: "Jaipur", date: "12 Mar 2026", highlight: "Explored Amber Fort & Hawa Mahal", lat: 26.9124, lng: 75.7873 },
    { city: "Udaipur", date: "18 Apr 2026", highlight: "Sunset boat ride on Lake Pichola", lat: 24.5854, lng: 73.7125 },
    { city: "Jodhpur", date: "05 Jun 2026", highlight: "Walked the ramparts of Mehrangarh Fort", lat: 26.2389, lng: 73.0243 },
    { city: "Delhi", date: "20 Jul 2026", highlight: "Wandered the bazaars of Old Delhi", lat: 28.6139, lng: 77.2090 }
  ],
  badges: [
    { icon: "🏰", name: "Heritage Explorer", earned: true },
    { icon: "🍛", name: "Food Explorer", earned: true },
    { icon: "📸", name: "Story Collector", earned: true },
    { icon: "🗺️", name: "Hidden Gem Hunter", earned: true },
    { icon: "🤝", name: "Local Friend", earned: false },
    { icon: "⛰️", name: "Mountain Wanderer", earned: false }
  ]
};

const CHAT_RESPONSES = {
  default: "I found 3 nearby verified transport options. The closest one is 4 minutes away.",
  keywords: [
    { match: ["cab", "taxi", "transport", "cancel"], reply: "Don't worry. I found 3 nearby verified transport options. The closest one is 4 minutes away." },
    { match: ["hospital", "sick", "medical", "doctor"], reply: "The nearest verified hospital is Fortis Escorts, 2.1 km away. Shall I share directions or contact them for you?" },
    { match: ["police", "unsafe", "danger", "theft"], reply: "I've located the nearest police assistance point, 900 m away. Would you like me to alert Human Support as well?" },
    { match: ["lost", "location", "where"], reply: "I can see you're near Hawa Mahal, Jaipur. Want me to share this location with your emergency contact?" }
  ]
};
