/* ===================== APNIYATRA — app logic ===================== */
/* Vanilla JS SPA. Organized as component-style render functions so this
   maps cleanly onto React components later (Navbar, DestinationCard, etc). */

const state = {
  page: "home",
  heroInterests: new Set(),
  signupInterests: new Set(),
  plannerStep: 1,
  planner: { destination: "Jaipur", startDate: "", endDate: "", budget: BUDGET_OPTIONS[1], interests: new Set(["Heritage"]), style: "balanced" },
  savedYatra: false,
  mapFilter: "all",
  serviceFilter: "all",
  passportProgress: 68, // %
  loggedIn: false,
  bookings: [],
  userLocation: null,
  pageHistory: [],
  servicesContext: "services"
};

const SERVICES_HEADINGS = {
  services: {
    navId: "services", filter: "all",
    eyebrow: "Local Services", heading: "Meet the people behind the place.",
    subheading: "Book trusted local services and experiences."
  },
  experiences: {
    navId: "experiences", filter: "experiences",
    eyebrow: "Experiences", heading: "Live it, don't just watch it.",
    subheading: "Book hands-on cultural experiences, workshops and heritage walks led by locals."
  }
};

function applyServicesHeading(ctx) {
  const h = SERVICES_HEADINGS[ctx] || SERVICES_HEADINGS.services;
  document.getElementById("servicesEyebrow").textContent = h.eyebrow;
  document.getElementById("servicesHeading").textContent = h.heading;
  document.getElementById("servicesSubheading").textContent = h.subheading;
  document.querySelectorAll(".nav-link").forEach(l => l.classList.toggle("active", l.dataset.nav === h.navId));
  state.serviceFilter = h.filter;
  const chipWrap = document.getElementById("serviceFilterChips");
  if (chipWrap) chipWrap.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.serviceFilter === h.filter));
  renderServiceGrid();
}

/* ---------------- icon refresh ---------------- */
function icons() { if (window.lucide) lucide.createIcons(); }

/* ---------------- date helpers ---------------- */
function todayStr() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
function parsePrice(str) {
  if (!str) return 0;
  const m = String(str).match(/₹\s?([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}
function computeTripDays(planner) {
  if (planner.startDate && planner.endDate) {
    const s = new Date(planner.startDate);
    const e = new Date(planner.endDate);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
    if (diff >= 1 && diff <= 14) return diff;
  }
  return 3;
}

/* ---------------- navigation ---------------- */
function showPage(id, opts = {}) {
  if (!opts.fromBack && state.page !== id) {
    state.pageHistory.push(state.page);
  }
  document.querySelectorAll(".page-view").forEach(el => el.classList.remove("active"));
  const target = document.getElementById("page-" + id);
  if (target) target.classList.add("active");
  state.page = id;
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  document.getElementById("mobileMenu").classList.add("hidden");
  document.querySelectorAll(".nav-link").forEach(l => l.classList.toggle("active", l.dataset.nav === id));
  icons();
  if (id === "map") ensureLeafletMap();
  if (id === "checkout") renderCheckout();
  if (id === "passport") ensurePassportMap();
  if (id === "services") applyServicesHeading(state.servicesContext);
  updateBackButton();
}

function goBack() {
  if (!state.pageHistory.length) return;
  const prev = state.pageHistory.pop();
  showPage(prev, { fromBack: true });
}

function updateBackButton() {
  const btn = document.getElementById("backNavBtn");
  if (btn) btn.classList.toggle("hidden", state.pageHistory.length === 0);
}

document.addEventListener("click", (e) => {
  const navEl = e.target.closest("[data-nav]");
  if (navEl) {
    e.preventDefault();
    const target = navEl.dataset.nav;
    if (target === "experiences") {
      state.servicesContext = "experiences";
      showPage("services");
    } else if (target === "services") {
      state.servicesContext = "services";
      showPage("services");
    } else {
      showPage(target);
    }
  }
});

document.getElementById("hamburgerBtn").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("hidden");
});

document.getElementById("backNavBtn").addEventListener("click", goBack);

/* ---------------- toast ---------------- */
function toast(msg, icon = "check-circle") {
  const wrap = document.getElementById("toastWrap");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4" style="color:var(--saffron)"></i><span>${msg}</span>`;
  wrap.appendChild(el);
  icons();
  setTimeout(() => {
    el.classList.add("leaving");
    setTimeout(() => el.remove(), 260);
  }, 2800);
}

/* ---------------- modal ---------------- */
function openModal(html) {
  document.getElementById("modalBox").innerHTML = html;
  document.getElementById("modalOverlay").classList.add("open");
  icons();
}
function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") closeModal();
});
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-close-modal]")) closeModal();
});

/* ===================== BOOKING SUMMARY / CART ===================== */
function addBooking(entry) {
  const key = `${entry.type}:${entry.name}`;
  if (state.bookings.find(b => b.key === key)) {
    toast(`"${entry.name}" is already in your bookings`, "info");
    return;
  }
  state.bookings.push({ ...entry, key, id: key + ":" + Date.now() });
  updateBookingBadge();
  toast(`"${entry.name}" added to your bookings`, "shopping-bag");
  if (state.page === "checkout") renderCheckout();
}

function removeBooking(id) {
  state.bookings = state.bookings.filter(b => b.id !== id);
  updateBookingBadge();
  renderCheckout();
}

function updateBookingBadge() {
  const btn = document.getElementById("bookingsNavBtn");
  const count = document.getElementById("bookingsCount");
  if (!btn) return;
  count.textContent = state.bookings.length;
  btn.classList.toggle("hidden", state.bookings.length === 0);
  const mBtn = document.getElementById("bookingsNavBtnMobile");
  if (mBtn) {
    mBtn.classList.toggle("hidden", state.bookings.length === 0);
    const mCount = document.getElementById("bookingsCountMobile");
    if (mCount) mCount.textContent = state.bookings.length;
  }
}

const BOOKING_TYPE_META = {
  activity: { icon: "map-pin", label: "Itinerary Activity" },
  service: { icon: "user", label: "Local Service" },
  hotel: { icon: "bed", label: "Hotel Stay" },
  transport: { icon: "plane", label: "Transport Ticket" }
};

function renderCheckout() {
  const root = document.getElementById("checkoutRoot");
  if (!state.bookings.length) {
    root.innerHTML = `
      <span class="section-eyebrow">Booking Summary</span>
      <h1 class="font-head text-3xl md:text-4xl font-semibold mt-2 mb-8">Your bookings</h1>
      <div class="card p-10 text-center">
        <i data-lucide="shopping-bag" class="w-8 h-8 mx-auto mb-3" style="color:var(--muted)"></i>
        <p class="text-gray-500">You haven't added anything to your Yatra yet.</p>
        <button class="btn btn-primary mt-5" data-nav="planner">✨ Plan a Yatra</button>
      </div>`;
    icons();
    return;
  }
  const total = state.bookings.reduce((sum, b) => sum + b.price, 0);
  root.innerHTML = `
    <span class="section-eyebrow">Booking Summary</span>
    <h1 class="font-head text-3xl md:text-4xl font-semibold mt-2 mb-8">Review & pay</h1>
    <div class="grid lg:grid-cols-[1fr_360px] gap-8">
      <div class="flex flex-col gap-3">
        ${state.bookings.map(b => `
          <div class="card p-5 flex items-center gap-4">
            <span class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style="background:var(--leaf-soft)">
              <i data-lucide="${BOOKING_TYPE_META[b.type].icon}" class="w-5 h-5" style="color:var(--leaf)"></i>
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm truncate">${b.name}</p>
              <p class="text-xs text-gray-500 mt-0.5">${b.meta || BOOKING_TYPE_META[b.type].label}</p>
            </div>
            <span class="font-semibold text-sm whitespace-nowrap">${b.price > 0 ? "₹" + b.price.toLocaleString() : "Free"}</span>
            <button class="text-gray-400 hover:text-red-500 flex-shrink-0" data-remove-booking="${b.id}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>`).join("")}
      </div>
      <div>
        <div class="card p-6 sticky top-24">
          <h3 class="font-head text-lg font-semibold mb-4">Total</h3>
          <div class="flex flex-col gap-2 text-sm text-gray-500 mb-4">
            <div class="flex justify-between"><span>Items (${state.bookings.length})</span><span>₹${total.toLocaleString()}</span></div>
            <div class="flex justify-between"><span>Taxes & fees</span><span>Included</span></div>
          </div>
          <div class="divider mb-4"></div>
          <div class="flex justify-between items-center mb-5">
            <span class="font-semibold">Total to pay</span>
            <span class="font-head text-2xl font-semibold" style="color:var(--rust)">₹${total.toLocaleString()}</span>
          </div>
          <button class="btn btn-primary btn-block" id="confirmPayBtn">Confirm & Pay ₹${total.toLocaleString()}</button>
          <p class="text-xs text-gray-400 text-center mt-3">Prototype checkout — no real payment is processed.</p>
        </div>
      </div>
    </div>`;
  icons();
}

document.addEventListener("click", (e) => {
  const rm = e.target.closest("[data-remove-booking]");
  if (rm) removeBooking(rm.dataset.removeBooking);
  if (e.target.closest("#confirmPayBtn")) {
    const total = state.bookings.reduce((sum, b) => sum + b.price, 0);
    state.bookings = [];
    updateBookingBadge();
    renderCheckout();
    toast(`Payment of ₹${total.toLocaleString()} confirmed! Happy travels.`, "party-popper");
  }
});

/* ===================== CHIPS (reusable) ===================== */
function renderChipGroup(container, items, activeSet, opts = {}) {
  container.innerHTML = items.map(item => {
    const label = typeof item === "string" ? item : item.label;
    const val = typeof item === "string" ? item : item.id;
    const active = activeSet.has(val);
    return `<button type="button" class="chip ${active ? "active" : ""}" data-chip="${val}">${opts.icon ? `<i data-lucide="${opts.icon}" class="w-3.5 h-3.5"></i>` : ""}${label}</button>`;
  }).join("");
  container.querySelectorAll("[data-chip]").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.chip;
      if (activeSet.has(val)) activeSet.delete(val); else activeSet.add(val);
      btn.classList.toggle("active");
      if (opts.onChange) opts.onChange(activeSet);
    });
  });
}

/* ===================== HOME PAGE ===================== */
function renderHome() {
  renderChipGroup(document.getElementById("heroInterestChips"), INTERESTS, state.heroInterests);

  const budgetSel = document.getElementById("heroBudget");
  budgetSel.innerHTML = BUDGET_OPTIONS.map(b => `<option value="${b}">${b}</option>`).join("");
  budgetSel.value = state.planner.budget;

  document.getElementById("destGrid").innerHTML = DESTINATIONS.map(d => `
    <div class="card overflow-hidden fade-in">
      <div class="img-zoom dest-card-img relative">
        <img src="${d.img}" alt="${d.name}" class="w-full h-full object-cover">
        ${d.topFTA ? '<span class="badge absolute top-3 left-3" style="background:rgba(255,255,255,.92)">🌍 Top with Global Travelers</span>' : ""}
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between">
          <h3 class="font-head text-lg font-semibold">${d.name}</h3>
          <span class="text-xs font-semibold text-gray-400">${d.state}</span>
        </div>
        <p class="text-sm text-gray-500 mt-2 leading-relaxed">${d.desc}</p>
        <div class="flex flex-wrap gap-1.5 mt-3">
          ${d.tags.map(t => `<span class="badge">${t}</span>`).join("")}
        </div>
        <button class="btn btn-secondary btn-sm w-full mt-4" data-explore-dest="${d.id}">Explore <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>
      </div>
    </div>
  `).join("");

  document.getElementById("gemGrid").innerHTML = HIDDEN_GEMS.map(g => `
    <div class="card overflow-hidden fade-in">
      <div class="img-zoom gem-card-img relative">
        <img src="${g.img}" alt="${g.name}" class="w-full h-full object-cover">
        <span class="badge absolute top-3 left-3" style="background:rgba(255,255,255,.92)">💎 Hidden Gem</span>
      </div>
      <div class="p-5">
        <div class="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-1">
          <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>${g.location} · ${g.distance}
        </div>
        <h3 class="font-head text-lg font-semibold">${g.name}</h3>
        <span class="badge badge-saffron mt-2">${g.category}</span>
        <p class="text-sm text-gray-500 mt-2 leading-relaxed">${g.desc}</p>
        <button class="btn btn-secondary btn-sm w-full mt-4" data-gem="${g.id}">Discover <i data-lucide="compass" class="w-3.5 h-3.5"></i></button>
      </div>
    </div>
  `).join("");

  icons();
}

document.addEventListener("click", (e) => {
  const explore = e.target.closest("[data-explore-dest]");
  if (explore) {
    const d = DESTINATIONS.find(x => x.id === explore.dataset.exploreDest);
    state.planner.destination = d.name;
    toast(`Loading ${d.name} into your planner…`, "map-pin");
    showPage("planner");
    resetPlanner();
  }
  const gem = e.target.closest("[data-gem]");
  if (gem) {
    const g = HIDDEN_GEMS.find(x => x.id === gem.dataset.gem);
    showGemOnMap(g);
  }
  if (e.target.id === "heroCreateYatra") {
    startQuickYatra();
  }
});

/* ---------------- hero search widget ---------------- */
function initHeroSearch() {
  const destInput = document.getElementById("heroDestination");
  const suggestBox = document.getElementById("heroDestSuggest");

  function paintSuggestions(filterVal) {
    const q = (filterVal || "").toLowerCase();
    const matches = DESTINATIONS.filter(d => !q || d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q));
    if (!matches.length) { suggestBox.classList.add("hidden"); return; }
    suggestBox.innerHTML = matches.map(d => `
      <button type="button" class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--cream-2)]" data-hero-dest="${d.name}">
        <img src="${d.img}" class="w-9 h-9 rounded-lg object-cover flex-shrink-0">
        <span><span class="text-sm font-semibold block" style="color:var(--ink)">${d.name}</span><span class="text-xs text-gray-400">${d.state}</span></span>
      </button>
    `).join("");
    suggestBox.classList.remove("hidden");
  }

  destInput.addEventListener("focus", () => paintSuggestions(destInput.value));
  destInput.addEventListener("input", () => paintSuggestions(destInput.value));
  suggestBox.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-hero-dest]");
    if (btn) {
      destInput.value = btn.dataset.heroDest;
      suggestBox.classList.add("hidden");
    }
  });

  const datesTrigger = document.getElementById("heroDatesTrigger");
  const datesPopover = document.getElementById("heroDatesPopover");
  const datesLabel = document.getElementById("heroDatesLabel");
  const heroStartInput = document.getElementById("heroStartDate");
  const heroEndInput = document.getElementById("heroEndDate");
  heroStartInput.min = todayStr();
  heroEndInput.min = todayStr();
  heroStartInput.addEventListener("change", () => {
    heroEndInput.min = heroStartInput.value || todayStr();
    if (heroEndInput.value && heroEndInput.value < heroStartInput.value) heroEndInput.value = heroStartInput.value;
  });
  datesTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    datesPopover.classList.toggle("hidden");
    suggestBox.classList.add("hidden");
  });
  document.getElementById("heroDatesApply").addEventListener("click", () => {
    const s = heroStartInput.value;
    const en = heroEndInput.value;
    if (!s || !en) { toast("Please pick both dates", "alert-circle"); return; }
    if (s < todayStr()) { toast("Start date can't be in the past", "alert-circle"); return; }
    if (en < s) { toast("End date can't be before the start date", "alert-circle"); return; }
    const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    datesLabel.textContent = `${fmt(s)} – ${fmt(en)}`;
    datesLabel.classList.remove("text-gray-400");
    state.planner.startDate = s;
    state.planner.endDate = en;
    datesPopover.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#heroDestination") && !e.target.closest("#heroDestSuggest")) suggestBox.classList.add("hidden");
    if (!e.target.closest("#heroDatesTrigger") && !e.target.closest("#heroDatesPopover")) datesPopover.classList.add("hidden");
  });

  document.getElementById("heroBudget").addEventListener("change", (e) => { state.planner.budget = e.target.value; });

  document.getElementById("exploreDestinationsBtn").addEventListener("click", () => {
    showPage("home");
    document.getElementById("discoverSection").scrollIntoView({ behavior: "smooth" });
  });
}

function startQuickYatra() {
  const dest = document.getElementById("heroDestination").value.trim();
  if (!dest) {
    toast("Please enter a destination first", "alert-circle");
    document.getElementById("heroDestination").focus();
    return;
  }
  state.planner.destination = dest;
  state.planner.budget = document.getElementById("heroBudget").value;
  state.planner.interests = new Set(state.heroInterests.size ? state.heroInterests : ["Heritage"]);
  showPage("planner");
  document.getElementById("plannerWizard").classList.add("hidden");
  document.getElementById("itineraryResult").classList.add("hidden");
  generateItinerary();
}

/* ===================== PLANNER PAGE ===================== */
const PLAN_STEPS = ["Destination", "Dates", "Budget", "Interests", "Travel Style"];

function resetPlanner() {
  state.plannerStep = 1;
  document.getElementById("itineraryResult").classList.add("hidden");
  document.getElementById("plannerWizard").classList.remove("hidden");
  renderStepIndicator();
  renderStepContent();
}

function renderStepIndicator() {
  const wrap = document.getElementById("stepIndicator");
  wrap.innerHTML = PLAN_STEPS.map((label, i) => {
    const n = i + 1;
    const cls = n < state.plannerStep ? "done" : n === state.plannerStep ? "active" : "";
    const dot = `<div class="flex flex-col items-center gap-2"><div class="step-dot ${cls}">${n < state.plannerStep ? '<i data-lucide=\"check\" class=\"w-4 h-4\"></i>' : n}</div><span class="text-xs font-medium text-gray-500 hidden sm:block">${label}</span></div>`;
    const line = n < PLAN_STEPS.length ? `<div class="step-line ${n < state.plannerStep ? "done" : ""}"></div>` : "";
    return dot + line;
  }).join("");
  icons();
}

function renderStepContent() {
  const c = document.getElementById("stepContent");
  const p = state.planner;
  let html = "";
  if (state.plannerStep === 1) {
    html = `
      <h3 class="font-head text-xl font-semibold mb-1">What is your destination?</h3>
      <p class="text-sm text-gray-500 mb-5">Tell us where in India you're headed.</p>
      <div class="flex items-center gap-2 border rounded-xl px-4 py-3" style="border-color:var(--line)">
        <i data-lucide="map-pin" style="color:var(--rust)" class="w-4 h-4"></i>
        <input id="wizDestination" type="text" value="${p.destination}" placeholder="Jaipur" class="w-full outline-none text-sm bg-transparent">
      </div>
      <div class="flex flex-wrap gap-2 mt-4">
        ${DESTINATIONS.map(d => `<button class="chip" data-quick-dest="${d.name}">${d.name}</button>`).join("")}
      </div>`;
  } else if (state.plannerStep === 2) {
    html = `
      <h3 class="font-head text-xl font-semibold mb-1">When are you travelling?</h3>
      <p class="text-sm text-gray-500 mb-5">Pick your start and end dates.</p>
      <div class="grid sm:grid-cols-2 gap-4">
        <div><label class="text-xs font-semibold text-gray-500">Start date</label>
          <input id="wizStart" type="date" min="${todayStr()}" value="${p.startDate}" class="w-full border rounded-xl px-4 py-3 text-sm outline-none mt-1" style="border-color:var(--line)"></div>
        <div><label class="text-xs font-semibold text-gray-500">End date</label>
          <input id="wizEnd" type="date" min="${p.startDate || todayStr()}" value="${p.endDate}" class="w-full border rounded-xl px-4 py-3 text-sm outline-none mt-1" style="border-color:var(--line)"></div>
      </div>`;
  } else if (state.plannerStep === 3) {
    html = `
      <h3 class="font-head text-xl font-semibold mb-1">What's your budget?</h3>
      <p class="text-sm text-gray-500 mb-5">This helps us shape the perfect Yatra.</p>
      <div class="grid sm:grid-cols-2 gap-3" id="budgetOptions">
        ${BUDGET_OPTIONS.map(b => `<button class="chip ${b === p.budget ? "active" : ""}" style="justify-content:center;padding:16px" data-budget="${b}">${b}</button>`).join("")}
      </div>`;
  } else if (state.plannerStep === 4) {
    html = `
      <h3 class="font-head text-xl font-semibold mb-1">What excites you most?</h3>
      <p class="text-sm text-gray-500 mb-5">Pick as many as you like.</p>
      <div class="flex flex-wrap gap-2" id="wizInterestChips"></div>`;
  } else if (state.plannerStep === 5) {
    html = `
      <h3 class="font-head text-xl font-semibold mb-1">Pick your travel style.</h3>
      <p class="text-sm text-gray-500 mb-5">How packed should each day feel?</p>
      <div class="grid sm:grid-cols-3 gap-3">
        ${TRAVEL_STYLES.map(s => `
          <button class="chip flex-col items-start !items-stretch text-left ${p.style === s.id ? "active" : ""}" style="padding:16px;height:auto" data-style="${s.id}">
            <span class="font-semibold block">${s.label}</span>
            <span class="block font-normal text-xs mt-1 opacity-80">${s.desc}</span>
          </button>`).join("")}
      </div>`;
  }
  c.innerHTML = html;
  icons();

  if (state.plannerStep === 4) {
    renderChipGroup(document.getElementById("wizInterestChips"), INTERESTS, p.interests);
  }

  if (state.plannerStep === 2) {
    const wizStart = document.getElementById("wizStart");
    const wizEnd = document.getElementById("wizEnd");
    wizStart.addEventListener("change", () => {
      wizEnd.min = wizStart.value || todayStr();
      if (wizEnd.value && wizEnd.value < wizStart.value) wizEnd.value = wizStart.value;
    });
  }

  const nextBtn = document.getElementById("planNextBtn");
  nextBtn.textContent = state.plannerStep === PLAN_STEPS.length ? "✨ Generate My Yatra" : "Continue";
  document.getElementById("planPrevBtn").style.visibility = state.plannerStep === 1 ? "hidden" : "visible";
}

document.addEventListener("click", (e) => {
  const qd = e.target.closest("[data-quick-dest]");
  if (qd) { document.getElementById("wizDestination").value = qd.dataset.quickDest; }
  const b = e.target.closest("[data-budget]");
  if (b) {
    state.planner.budget = b.dataset.budget;
    document.querySelectorAll("#budgetOptions .chip").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
  }
  const s = e.target.closest("[data-style]");
  if (s) {
    state.planner.style = s.dataset.style;
    document.querySelectorAll("#stepContent [data-style]").forEach(x => x.classList.remove("active"));
    s.classList.add("active");
  }
});

document.getElementById("planNextBtn").addEventListener("click", () => {
  if (state.plannerStep === 1) {
    const val = document.getElementById("wizDestination").value.trim();
    if (!val) { toast("Please enter a destination", "alert-circle"); return; }
    state.planner.destination = val;
  }
  if (state.plannerStep === 2) {
    const s = document.getElementById("wizStart").value;
    const en = document.getElementById("wizEnd").value;
    if (s && s < todayStr()) { toast("Start date can't be in the past", "alert-circle"); return; }
    if (s && en && en < s) { toast("End date can't be before the start date", "alert-circle"); return; }
    state.planner.startDate = s;
    state.planner.endDate = en;
  }
  if (state.plannerStep < PLAN_STEPS.length) {
    state.plannerStep++;
    renderStepIndicator();
    renderStepContent();
  } else {
    generateItinerary();
  }
});
document.getElementById("planPrevBtn").addEventListener("click", () => {
  if (state.plannerStep > 1) {
    state.plannerStep--;
    renderStepIndicator();
    renderStepContent();
  }
});

function generateItinerary() {
  document.getElementById("planNextBtn").innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Crafting your Yatra…`;
  icons();
  setTimeout(() => {
    document.getElementById("plannerWizard").classList.add("hidden");
    const res = document.getElementById("itineraryResult");
    res.classList.remove("hidden");
    res.innerHTML = renderItineraryHTML();
    icons();
    res.scrollIntoView({ behavior: "smooth" });
    toast("Your Yatra is ready!", "sparkles");
    document.getElementById("planNextBtn").textContent = "✨ Generate My Yatra";
  }, 1100);
}

function renderItineraryHTML() {
  const p = state.planner;
  const it = getItinerary(p.destination, computeTripDays(p));
  return `
    <div class="card p-7 mb-8" style="background:linear-gradient(135deg,#2A2118,#4A2E1E);color:#fff;border:none">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="badge" style="background:rgba(255,255,255,.15);color:#fff">AI Match ${it.match}%</span>
          <h2 class="font-head text-2xl md:text-3xl font-semibold mt-3">${it.destination.toUpperCase()} — ${it.days} DAY YATRA</h2>
          <p class="text-white/70 text-sm mt-1">${TRAVEL_STYLES.find(s=>s.id===p.style)?.label || "Balanced"} pace · ${[...p.interests].join(", ") || "Heritage"}</p>
        </div>
        <div class="flex gap-3">
          <button class="btn" style="background:#fff;color:var(--ink)" id="saveYatraBtn"><i data-lucide="bookmark" class="w-4 h-4"></i> Save Yatra</button>
          <button class="btn btn-ghost" id="shareYatraBtn"><i data-lucide="share-2" class="w-4 h-4"></i> Share</button>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7">
        <div><p class="text-xs text-white/60">Estimated Budget</p><p class="font-head text-xl font-semibold mt-1">₹${it.budget.toLocaleString()}</p></div>
        <div><p class="text-xs text-white/60">Distance</p><p class="font-head text-xl font-semibold mt-1">${it.distance} km</p></div>
        <div><p class="text-xs text-white/60">Experiences</p><p class="font-head text-xl font-semibold mt-1">${it.experiences}</p></div>
        <div><p class="text-xs text-white/60">AI Match</p><p class="font-head text-xl font-semibold mt-1">${it.match}%</p></div>
      </div>
    </div>

    ${renderTransportBooking(it)}

    ${it.plan.map(day => `
      <div class="mb-9">
        <h3 class="font-head text-xl font-semibold mb-5">Day ${day.day} — ${day.title}</h3>
        <div class="timeline flex flex-col gap-5">
          ${day.items.map(item => `
            <div class="relative">
              <div class="timeline-dot"><i data-lucide="${item.icon}" class="w-3 h-3"></i></div>
              <div class="card p-4 flex flex-wrap items-center gap-4">
                <div class="w-16 text-xs font-bold" style="color:var(--rust)">${item.time}</div>
                <div class="flex-1 min-w-[140px]">
                  <p class="font-semibold text-sm">${item.place}</p>
                  <p class="text-xs text-gray-500 mt-0.5">${item.travel} · ${item.cost}</p>
                </div>
                <div class="flex gap-2">
                  <button class="btn btn-secondary btn-sm" data-map-view="${item.place}"><i data-lucide="map" class="w-3.5 h-3.5"></i> View on Map</button>
                  <button class="btn btn-primary btn-sm" data-add-yatra="${item.place}" data-cost="${item.cost}">Add to Yatra</button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("")}

    ${renderRecommendedStay(it)}

    <div class="flex flex-wrap gap-3 mt-6">
      <button class="btn btn-primary" id="bookServicesBtn"><i data-lucide="calendar-check"></i> Book Services</button>
      <button class="btn btn-secondary" id="editYatraBtn"><i data-lucide="pencil"></i> Edit Plan</button>
      <button class="btn btn-secondary" data-nav="checkout"><i data-lucide="receipt"></i> Review Booking</button>
    </div>
  `;
}

function renderTransportBooking(it) {
  return `
    <div class="mb-9">
      <h3 class="font-head text-xl font-semibold mb-5">Get to ${it.destination}</h3>
      <div class="card p-5">
        <div class="grid sm:grid-cols-3 gap-3 items-end">
          <div>
            <label class="text-xs font-semibold text-gray-500">From</label>
            <select id="transportFrom" class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none mt-1" style="border-color:var(--line)">
              ${SOURCE_CITIES.map(c => `<option ${c === "Delhi" ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500">To</label>
            <div class="w-full border rounded-xl px-3 py-2.5 text-sm mt-1 truncate" style="border-color:var(--line);background:var(--cream-2)">${it.destination}</div>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500">Travel date</label>
            <input id="transportDate" type="date" min="${todayStr()}" value="${state.planner.startDate || ""}" class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none mt-1" style="border-color:var(--line)">
          </div>
        </div>
        <div class="flex gap-2 mt-4" id="transportModeChips">
          ${TRANSPORT_MODES.map((m, i) => `<button type="button" class="chip ${i === 0 ? "active" : ""}" data-transport-mode="${m.id}"><i data-lucide="${m.icon}" class="w-3.5 h-3.5"></i> ${m.label}</button>`).join("")}
        </div>
        <button class="btn btn-primary mt-4" id="searchTransportBtn"><i data-lucide="search" class="w-4 h-4"></i> Search tickets</button>
      </div>
      <div id="transportResults" class="mt-4 flex flex-col gap-3"></div>
    </div>`;
}

let lastTransportOptions = [];

function searchTransport(toCity) {
  const from = document.getElementById("transportFrom").value;
  const date = document.getElementById("transportDate").value;
  const modeBtn = document.querySelector("#transportModeChips .chip.active");
  const mode = modeBtn ? modeBtn.dataset.transportMode : "flight";
  if (!date) { toast("Please pick a travel date", "alert-circle"); return; }
  if (date < todayStr()) { toast("Travel date can't be in the past", "alert-circle"); return; }
  lastTransportOptions = generateTransportOptions(mode, from, toCity, date);
  document.getElementById("transportResults").innerHTML = lastTransportOptions.map((o, i) => `
    <div class="card p-4 flex flex-wrap items-center gap-4 fade-in">
      <span class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style="background:var(--leaf-soft)"><i data-lucide="${o.icon}" class="w-4 h-4" style="color:var(--leaf)"></i></span>
      <div class="flex-1 min-w-[200px]">
        <p class="font-semibold text-sm">${o.operator}</p>
        <p class="text-xs text-gray-500 mt-0.5">${o.departTime} → ${o.arriveTime} · ${o.durationLabel} · ${from} → ${toCity}</p>
      </div>
      <span class="font-semibold text-sm">₹${o.price.toLocaleString()}</span>
      <button class="btn btn-primary btn-sm" data-book-transport="${i}">Book</button>
    </div>
  `).join("");
  icons();
}

document.addEventListener("click", (e) => {
  const modeChip = e.target.closest("[data-transport-mode]");
  if (modeChip) {
    modeChip.parentElement.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    modeChip.classList.add("active");
  }
  if (e.target.closest("#searchTransportBtn")) {
    const it = getItinerary(state.planner.destination, computeTripDays(state.planner));
    searchTransport(it.destination);
  }
  const bookTBtn = e.target.closest("[data-book-transport]");
  if (bookTBtn) {
    const o = lastTransportOptions[parseInt(bookTBtn.dataset.bookTransport, 10)];
    const from = document.getElementById("transportFrom")?.value || "Delhi";
    const to = getItinerary(state.planner.destination, computeTripDays(state.planner)).destination;
    const date = document.getElementById("transportDate")?.value || "";
    const modeLabel = TRANSPORT_MODES.find(m => m.id === o.mode)?.label || "Transport";
    addBooking({
      type: "transport",
      name: `${o.operator} (${modeLabel}) — ${from} → ${to}`,
      meta: `${date} · ${o.departTime}–${o.arriveTime} · ${o.durationLabel}`,
      price: o.price
    });
  }
});

function renderRecommendedStay(it) {
  const dest = DESTINATIONS.find(d => d.name.toLowerCase() === it.destination.toLowerCase());
  const hotel = dest ? HOTELS.find(h => h.destId === dest.id) : null;
  if (!hotel) return "";
  const nights = Math.max(1, it.days - 1);
  return `
    <div class="mb-9">
      <h3 class="font-head text-xl font-semibold mb-5">Recommended Stay</h3>
      <div class="card p-5 flex flex-wrap items-center gap-5">
        <img src="${hotel.img}" class="w-24 h-24 rounded-xl object-cover flex-shrink-0">
        <div class="flex-1 min-w-[200px]">
          <div class="flex items-center gap-1.5">
            <p class="font-semibold">${hotel.name}</p>
            ${hotel.verified ? '<i data-lucide="badge-check" class="w-4 h-4 flex-shrink-0" style="color:#256B3E"></i>' : ""}
          </div>
          <p class="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><i data-lucide="map-pin" class="w-3 h-3"></i>${hotel.location}</p>
          <div class="flex flex-wrap gap-1.5 mt-2">${hotel.amenities.map(a => `<span class="badge">${a}</span>`).join("")}</div>
        </div>
        <div class="text-right">
          <p class="stars flex items-center gap-1 justify-end"><i data-lucide="star" class="w-3.5 h-3.5" style="fill:var(--saffron)"></i>${hotel.rating} <span class="text-gray-400 font-normal">(${hotel.reviews})</span></p>
          <p class="font-semibold text-sm mt-1">₹${hotel.pricePerNight.toLocaleString()} / night · ${nights} night${nights > 1 ? "s" : ""}</p>
          <button class="btn btn-primary btn-sm mt-2" data-add-hotel="${hotel.id}" data-nights="${nights}">Add Hotel to Booking</button>
        </div>
      </div>
    </div>`;
}

document.addEventListener("click", (e) => {
  const hotelBtn = e.target.closest("[data-add-hotel]");
  if (hotelBtn) {
    const hotel = HOTELS.find(h => h.id === hotelBtn.dataset.addHotel);
    const nights = parseInt(hotelBtn.dataset.nights, 10) || 1;
    addBooking({ type: "hotel", name: hotel.name, meta: `${nights} night${nights > 1 ? "s" : ""}`, price: hotel.pricePerNight * nights });
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest("#saveYatraBtn")) toast("Yatra saved to your Passport", "bookmark-check");
  if (e.target.closest("#shareYatraBtn")) toast("Share link copied to clipboard", "link");
  if (e.target.closest("#bookServicesBtn")) { state.servicesContext = "services"; showPage("services"); }
  if (e.target.closest("#editYatraBtn")) resetPlanner();
  const addBtn = e.target.closest("[data-add-yatra]");
  if (addBtn) {
    addBooking({ type: "activity", name: addBtn.dataset.addYatra, meta: "Itinerary activity", price: parsePrice(addBtn.dataset.cost) });
  }
  const mapBtn = e.target.closest("[data-map-view]");
  if (mapBtn) { toast(`Showing "${mapBtn.dataset.mapView}" on map`, "map-pin"); showPage("map"); }
});

/* ===================== MAP PAGE ===================== */
const MAP_FILTERS = [
  { id: "all", label: "All" }, { id: "heritage", label: "Heritage" }, { id: "hidden", label: "Hidden Gems" },
  { id: "food", label: "Food" }, { id: "activities", label: "Activities" }, { id: "hotels", label: "Hotels" },
  { id: "guides", label: "Guides" }, { id: "rentals", label: "Rentals" }
];
const MARKER_COLORS = { heritage: "var(--rust)", food: "var(--saffron)", guides: "var(--leaf)", rentals: "#6b5cff", activities: "#2196c9", hidden: "var(--maroon)", hotels: "#c98d21" };
const MARKER_ICONS = { heritage: "landmark", food: "utensils", guides: "user", rentals: "bike", activities: "ferris-wheel", hidden: "gem", hotels: "bed" };

let leafletMap = null;
let leafletMarkerLayer = null;
let gemMarkerLayer = null;

function renderMap() {
  const chipWrap = document.getElementById("mapFilterChips");
  chipWrap.innerHTML = MAP_FILTERS.map(f => `<button class="chip ${f.id === state.mapFilter ? "active" : ""}" data-map-filter="${f.id}">${f.label}</button>`).join("");
  chipWrap.querySelectorAll("[data-map-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.mapFilter = btn.dataset.mapFilter;
      chipWrap.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      renderMapMarkers();
    });
  });
}

function ensureLeafletMap() {
  if (leafletMap) {
    setTimeout(() => leafletMap.invalidateSize(), 50);
    return;
  }
  leafletMap = L.map("mapCanvas", { scrollWheelZoom: false }).setView([26.9239, 75.8267], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(leafletMap);
  leafletMarkerLayer = L.layerGroup().addTo(leafletMap);
  gemMarkerLayer = L.layerGroup().addTo(leafletMap);
  renderMapMarkers();
  setTimeout(() => leafletMap.invalidateSize(), 50);
}

function renderMapMarkers() {
  if (!leafletMarkerLayer) return;
  leafletMarkerLayer.clearLayers();
  const list = MAP_MARKERS.filter(m => state.mapFilter === "all" || m.type === state.mapFilter);
  list.forEach(m => {
    const icon = L.divIcon({
      className: "",
      html: `<div class="map-pin" style="background:${MARKER_COLORS[m.type]}"><i data-lucide="${MARKER_ICONS[m.type]}" class="w-4 h-4 text-white"></i></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 34]
    });
    const marker = L.marker([m.lat, m.lng], { icon }).addTo(leafletMarkerLayer);
    marker.on("click", () => showMapInfoCard(m));
  });
  icons();
}

function showMapInfoCard(m) {
  document.getElementById("mapInfoPlaceholder").classList.add("hidden");
  const card = document.getElementById("mapInfoCard");
  card.classList.remove("hidden");
  card.innerHTML = `
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 rounded-full flex items-center justify-center" style="background:${MARKER_COLORS[m.type]}"><i data-lucide="${MARKER_ICONS[m.type]}" class="w-4 h-4 text-white"></i></span>
        <span class="badge">${m.type}</span>
      </div>
      <button class="text-gray-400" onclick="document.getElementById('mapInfoCard').classList.add('hidden');document.getElementById('mapInfoPlaceholder').classList.remove('hidden')"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <h3 class="font-head text-lg font-semibold mt-3">${m.name}</h3>
    <p class="text-sm text-gray-500 mt-1">${m.info}</p>
    <div class="flex gap-2 mt-4">
      <button class="btn btn-secondary btn-sm flex-1"><i data-lucide="navigation" class="w-3.5 h-3.5"></i> Directions</button>
      <button class="btn btn-primary btn-sm flex-1" data-add-yatra="${m.name}" data-cost="${m.info}">Add to Yatra</button>
    </div>`;
  icons();
  if (leafletMap) leafletMap.setView([m.lat, m.lng], 14, { animate: true });
}

/* ---------------- geolocation & distance ---------------- */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function requestUserLocation(callback) {
  if (state.userLocation) { callback(state.userLocation); return; }
  if (!navigator.geolocation) { callback(null); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      callback(state.userLocation);
    },
    () => callback(null),
    { timeout: 8000 }
  );
}

/* ---------------- hidden gem -> map ---------------- */
function showGemOnMap(g) {
  showPage("map");
  ensureLeafletMap();
  setTimeout(() => {
    if (!leafletMap) return;
    leafletMap.invalidateSize();
    leafletMap.setView([g.lat, g.lng], 14, { animate: false });
    if (gemMarkerLayer) {
      gemMarkerLayer.clearLayers();
      const icon = L.divIcon({
        className: "",
        html: `<div class="map-pin" style="background:${MARKER_COLORS.hidden}"><i data-lucide="gem" class="w-4 h-4 text-white"></i></div>`,
        iconSize: [36, 36], iconAnchor: [18, 34]
      });
      L.marker([g.lat, g.lng], { icon }).addTo(gemMarkerLayer).on("click", () => showGemInfoCard(g));
      icons();
    }
    showGemInfoCard(g);
  }, 150);
}

function showGemInfoCard(g) {
  document.getElementById("mapInfoPlaceholder").classList.add("hidden");
  const card = document.getElementById("mapInfoCard");
  card.classList.remove("hidden");
  card.innerHTML = `
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 rounded-full flex items-center justify-center" style="background:${MARKER_COLORS.hidden}"><i data-lucide="gem" class="w-4 h-4 text-white"></i></span>
        <span class="badge badge-saffron">${g.category}</span>
      </div>
      <button class="text-gray-400" onclick="document.getElementById('mapInfoCard').classList.add('hidden');document.getElementById('mapInfoPlaceholder').classList.remove('hidden')"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <h3 class="font-head text-lg font-semibold mt-3">${g.name}</h3>
    <p class="text-sm text-gray-500 mt-1">${g.desc}</p>
    <p class="text-xs text-gray-400 mt-2 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i>${g.location}</p>
    <p class="text-sm font-semibold mt-3 flex items-center gap-1.5" id="gemDistanceText" style="color:var(--rust)"><i data-lucide="navigation" class="w-3.5 h-3.5"></i> ${g.distance}</p>
    <div class="flex gap-2 mt-4">
      <button class="btn btn-secondary btn-sm flex-1" id="useMyLocationBtn"><i data-lucide="locate" class="w-3.5 h-3.5"></i> Use My Location</button>
      <button class="btn btn-primary btn-sm flex-1" data-add-yatra="${g.name}" data-cost="Free">Add to Yatra</button>
    </div>`;
  icons();

  document.getElementById("useMyLocationBtn").addEventListener("click", () => {
    const btn = document.getElementById("useMyLocationBtn");
    btn.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i> Locating…`;
    icons();
    requestUserLocation((loc) => {
      if (!loc) {
        toast("Couldn't access your location — check browser permissions", "alert-circle");
        btn.innerHTML = `<i data-lucide="locate" class="w-3.5 h-3.5"></i> Use My Location`;
        icons();
        return;
      }
      const km = haversineKm(loc.lat, loc.lng, g.lat, g.lng);
      const distEl = document.getElementById("gemDistanceText");
      if (distEl) distEl.innerHTML = `<i data-lucide="navigation" class="w-3.5 h-3.5"></i> ${km < 1 ? Math.round(km * 1000) + " m" : km.toFixed(1) + " km"} from your location`;
      btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> Located`;
      icons();
      if (leafletMap && gemMarkerLayer) {
        const youIcon = L.divIcon({
          className: "",
          html: `<div class="w-4 h-4 rounded-full border-2 border-white" style="background:#2196c9;box-shadow:0 0 0 3px rgba(33,150,201,.3)"></div>`,
          iconSize: [16, 16], iconAnchor: [8, 8]
        });
        L.marker([loc.lat, loc.lng], { icon: youIcon }).addTo(gemMarkerLayer).bindPopup("You are here");
        leafletMap.fitBounds([[loc.lat, loc.lng], [g.lat, g.lng]], { padding: [60, 60] });
      }
    });
  });
}

/* ===================== SERVICES / MARKETPLACE ===================== */
const SERVICE_FILTERS = [
  { id: "all", label: "All Services" }, { id: "guides", label: "Local Guides" },
  { id: "photographers", label: "Photographers" }, { id: "rentals", label: "Rentals" },
  { id: "experiences", label: "Experiences" }, { id: "hotels", label: "Hotels" }
];

function renderServices() {
  const chipWrap = document.getElementById("serviceFilterChips");
  chipWrap.innerHTML = SERVICE_FILTERS.map(f => `<button class="chip ${f.id === state.serviceFilter ? "active" : ""}" data-service-filter="${f.id}">${f.label}</button>`).join("");
  chipWrap.querySelectorAll("[data-service-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.serviceFilter = btn.dataset.serviceFilter;
      chipWrap.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      renderServiceGrid();
    });
  });
  renderServiceGrid();
}

function renderServiceGrid() {
  const list = ALL_SERVICES.filter(p => state.serviceFilter === "all" || p.category === state.serviceFilter);
  document.getElementById("serviceGrid").innerHTML = list.map(p => p.category === "hotels" ? `
    <div class="card p-5 fade-in">
      <div class="flex items-center gap-3">
        <img src="${p.img}" alt="${p.name}" class="w-16 h-16 rounded-xl object-cover">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <h3 class="font-semibold truncate">${p.name}</h3>
            ${p.verified ? '<i data-lucide="badge-check" class="w-4 h-4 flex-shrink-0" style="color:#256B3E"></i>' : ""}
          </div>
          <p class="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><i data-lucide="map-pin" class="w-3 h-3"></i>${p.location}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-1.5 mt-3">
        ${p.amenities.map(a => `<span class="badge">${a}</span>`).join("")}
      </div>
      <div class="flex items-center justify-between mt-4">
        <span class="stars flex items-center gap-1"><i data-lucide="star" class="w-3.5 h-3.5" style="fill:var(--saffron)"></i>${p.rating} <span class="text-gray-400 font-normal">(${p.reviews})</span></span>
        <span class="font-semibold text-sm">${p.price}</span>
      </div>
      <button class="btn btn-primary btn-sm btn-block mt-4" data-book-provider="${p.id}">Book Stay</button>
    </div>
  ` : `
    <div class="card p-5 fade-in">
      <div class="flex items-center gap-3">
        <img src="${p.img}" alt="${p.name}" class="w-16 h-16 rounded-full object-cover">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <h3 class="font-semibold truncate">${p.name}</h3>
            ${p.verified ? '<i data-lucide="badge-check" class="w-4 h-4 flex-shrink-0" style="color:#256B3E"></i>' : ""}
          </div>
          <p class="text-xs text-gray-500">${p.tag}</p>
          <p class="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><i data-lucide="map-pin" class="w-3 h-3"></i>${p.location}</p>
        </div>
      </div>
      <div class="flex items-center justify-between mt-4">
        <span class="stars flex items-center gap-1"><i data-lucide="star" class="w-3.5 h-3.5" style="fill:var(--saffron)"></i>${p.rating} <span class="text-gray-400 font-normal">(${p.reviews})</span></span>
        <span class="font-semibold text-sm">${p.price}</span>
      </div>
      <div class="flex gap-2 mt-4">
        <button class="btn btn-secondary btn-sm flex-1" data-view-provider="${p.id}">View</button>
        <button class="btn btn-primary btn-sm flex-1" data-book-provider="${p.id}">Book Now</button>
      </div>
    </div>
  `).join("");
  icons();
}

document.addEventListener("click", (e) => {
  const viewBtn = e.target.closest("[data-view-provider]");
  if (viewBtn) { renderExperienceDetail(viewBtn.dataset.viewProvider); showPage("experience"); }
  const bookBtn = e.target.closest("[data-book-provider]");
  if (bookBtn) {
    const p = ALL_SERVICES.find(x => x.id === bookBtn.dataset.bookProvider);
    if (p.category === "hotels") openHotelBookingModal(p);
    else openBookingModal(p.name, p.price, "service");
  }
});

let pendingBooking = null;

function openBookingModal(name, price, type) {
  pendingBooking = { name, price: parsePrice(price), meta: price, type, nights: null };
  openModal(`
    <div class="flex items-start justify-between mb-4">
      <h3 class="font-head text-xl font-semibold">Book ${name}</h3>
      <button data-close-modal class="text-gray-400"><i data-lucide="x" class="w-5 h-5"></i></button>
    </div>
    <div class="flex flex-col gap-3">
      <div><label class="text-xs font-semibold text-gray-500">Date</label><input type="date" min="${todayStr()}" class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none mt-1" style="border-color:var(--line)"></div>
      <div><label class="text-xs font-semibold text-gray-500">Guests</label><input type="number" min="1" value="2" class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none mt-1" style="border-color:var(--line)"></div>
      <div class="flex items-center justify-between border-t pt-4 mt-2" style="border-color:var(--line)">
        <span class="text-sm text-gray-500">Price</span><span class="font-semibold">${price}</span>
      </div>
      <button class="btn btn-primary btn-block mt-2" id="confirmBookingBtn">Confirm Booking</button>
    </div>
  `);
}

function openHotelBookingModal(hotel) {
  pendingBooking = { name: hotel.name, price: hotel.pricePerNight, meta: "1 night", type: "hotel", nights: 1 };
  openModal(`
    <div class="flex items-start justify-between mb-4">
      <h3 class="font-head text-xl font-semibold">Book ${hotel.name}</h3>
      <button data-close-modal class="text-gray-400"><i data-lucide="x" class="w-5 h-5"></i></button>
    </div>
    <div class="flex flex-col gap-3">
      <div><label class="text-xs font-semibold text-gray-500">Check-in</label><input type="date" min="${todayStr()}" class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none mt-1" style="border-color:var(--line)"></div>
      <div><label class="text-xs font-semibold text-gray-500">Nights</label><input id="hotelNights" type="number" min="1" value="1" class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none mt-1" style="border-color:var(--line)"></div>
      <div class="flex items-center justify-between border-t pt-4 mt-2" style="border-color:var(--line)">
        <span class="text-sm text-gray-500">₹${hotel.pricePerNight.toLocaleString()} / night</span>
        <span class="font-semibold" id="hotelTotalPrice">₹${hotel.pricePerNight.toLocaleString()}</span>
      </div>
      <button class="btn btn-primary btn-block mt-2" id="confirmBookingBtn">Confirm Booking</button>
    </div>
  `);
  document.getElementById("hotelNights").addEventListener("input", (e) => {
    const nights = Math.max(1, parseInt(e.target.value, 10) || 1);
    pendingBooking.nights = nights;
    pendingBooking.meta = `${nights} night${nights > 1 ? "s" : ""}`;
    document.getElementById("hotelTotalPrice").textContent = `₹${(hotel.pricePerNight * nights).toLocaleString()}`;
  });
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#confirmBookingBtn") && pendingBooking) {
    const totalPrice = pendingBooking.type === "hotel" ? pendingBooking.price * pendingBooking.nights : pendingBooking.price;
    addBooking({ type: pendingBooking.type, name: pendingBooking.name, meta: pendingBooking.meta, price: totalPrice });
    closeModal();
    toast("Booking confirmed! Details sent to your email.", "check-circle");
    pendingBooking = null;
  }
});

/* ===================== EXPERIENCE DETAIL ===================== */
const CATEGORY_META = {
  guides: {
    duration: "3 hours",
    included: ["Local storyteller guide", "Bottled water", "Street food tasting", "Entry fees for 2 monuments"],
    desc: (p, city) => `Walk through ${city} with ${p.name}, a passionate local guide who knows the hidden stories, architecture and food behind the city.`,
    meetingPoint: (p, city) => `Central meeting point, ${city}`
  },
  photographers: {
    duration: "2 hour session",
    included: ["1 professional photographer", "50+ edited digital photos", "Location scouting", "Same-week delivery"],
    desc: (p, city) => `Professional ${p.tag.toLowerCase()} with ${p.name} — candid, cinematic shots across ${city}'s most photogenic spots.`,
    meetingPoint: (p, city) => `Studio pickup or on-location, ${city}`
  },
  rentals: {
    duration: "24 hour rental",
    included: ["Full tank / charge", "Helmet or safety kit", "24/7 roadside support", "Free cancellation up to 24h"],
    desc: (p, city) => `Rent a well-maintained ${p.tag.toLowerCase()} from ${p.name} to explore ${city} at your own pace.`,
    meetingPoint: (p, city) => `${p.name} pickup point, ${city}`
  },
  experiences: {
    duration: "2.5 hours",
    included: ["All materials included", "Local host guidance", "Light refreshments", "Take-home souvenir"],
    desc: (p, city) => `Join ${p.name} for a hands-on ${p.tag.toLowerCase()} experience rooted in the traditions of ${city}.`,
    meetingPoint: (p, city) => `${p.name} venue, ${city}`
  }
};

function buildExperienceDetail(provider) {
  const city = provider.location.split(",")[0].trim();
  const meta = CATEGORY_META[provider.category] || CATEGORY_META.experiences;
  const cityDest = DESTINATIONS.find(d => provider.location.includes(d.name));
  const cityGem = HIDDEN_GEMS.find(g => provider.location.includes(g.location.split(",")[0].trim()));
  const images = [provider.img, cityDest ? cityDest.img : DESTINATIONS[0].img, cityGem ? cityGem.img : (cityDest ? cityDest.img : DESTINATIONS[1].img)];
  const titlePrefix = provider.category === "guides" ? `${city} ${provider.tag}`
    : provider.category === "rentals" ? `${provider.tag} Rental in ${city}`
    : `${provider.tag} in ${city}`;

  return {
    title: titlePrefix,
    rating: provider.rating, reviews: provider.reviews, price: provider.price,
    location: provider.location, duration: meta.duration,
    images,
    desc: meta.desc(provider, city),
    included: meta.included,
    meetingPoint: meta.meetingPoint(provider, city),
    host: { name: provider.name, rating: provider.rating, trips: provider.reviews + 40, img: provider.img },
    reviewsList: [
      { name: "Ananya P.", rating: 5, text: `${provider.name} was fantastic — made our time in ${city} unforgettable.` },
      { name: "Sam T.", rating: 5, text: `Highly recommend ${provider.name}, everything was smooth and professional.` },
      { name: "Divya K.", rating: 4, text: "Great experience overall, would book again." }
    ],
    dates: ["Sep 3", "Sep 4", "Sep 5", "Sep 6", "Sep 8"]
  };
}

let currentExperience = null;

function renderExperienceDetail(providerId) {
  const provider = PROVIDERS.find(p => p.id === providerId) || PROVIDERS[0];
  const x = buildExperienceDetail(provider);
  currentExperience = x;
  document.getElementById("experienceDetailRoot").innerHTML = `
    <button class="btn btn-secondary btn-sm mb-6" data-nav="services"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Services</button>
    <div class="grid lg:grid-cols-3 gap-3 rounded-2xl overflow-hidden mb-8" style="max-height:420px">
      <img src="${x.images[0]}" class="w-full h-full object-cover lg:col-span-2 lg:row-span-2" style="max-height:420px">
      <img src="${x.images[1]}" class="w-full h-[204px] object-cover hidden lg:block">
      <img src="${x.images[2]}" class="w-full h-[204px] object-cover hidden lg:block">
    </div>
    <div class="grid lg:grid-cols-[1fr_360px] gap-10">
      <div>
        <h1 class="font-head text-3xl font-semibold">${x.title}</h1>
        <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <span class="stars flex items-center gap-1"><i data-lucide="star" class="w-4 h-4" style="fill:var(--saffron)"></i>${x.rating} (${x.reviews} reviews)</span>
          <span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-4 h-4"></i>${x.location}</span>
          <span class="flex items-center gap-1"><i data-lucide="clock" class="w-4 h-4"></i>${x.duration}</span>
        </div>

        <div class="divider my-7"></div>
        <h3 class="font-head text-xl font-semibold mb-3">About this experience</h3>
        <p class="text-gray-600 leading-relaxed">${x.desc}</p>

        <h3 class="font-head text-xl font-semibold mb-3 mt-8">What's included</h3>
        <ul class="grid sm:grid-cols-2 gap-2.5">
          ${x.included.map(i => `<li class="flex items-center gap-2 text-sm text-gray-600"><i data-lucide="check" class="w-4 h-4" style="color:var(--leaf)"></i>${i}</li>`).join("")}
        </ul>

        <h3 class="font-head text-xl font-semibold mb-3 mt-8">Meeting point</h3>
        <p class="text-gray-600 text-sm flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4" style="color:var(--rust)"></i>${x.meetingPoint}</p>

        <h3 class="font-head text-xl font-semibold mb-3 mt-8">Local host</h3>
        <div class="flex items-center gap-3">
          <img src="${x.host.img}" class="w-14 h-14 rounded-full object-cover">
          <div><p class="font-semibold">${x.host.name}</p><p class="text-xs text-gray-500">⭐ ${x.host.rating} · ${x.host.trips} trips hosted</p></div>
        </div>

        <h3 class="font-head text-xl font-semibold mb-3 mt-8">Reviews</h3>
        <div class="flex flex-col gap-3">
          ${x.reviewsList.map(r => `
            <div class="card p-4">
              <div class="flex items-center justify-between"><p class="font-semibold text-sm">${r.name}</p><span class="stars">${"★".repeat(r.rating)}</span></div>
              <p class="text-sm text-gray-500 mt-1">${r.text}</p>
            </div>`).join("")}
        </div>
      </div>

      <div>
        <div class="card p-6 sticky top-24">
          <p class="font-head text-2xl font-semibold">${x.price}</p>
          <h4 class="text-sm font-semibold text-gray-500 mt-4 mb-2">Available dates</h4>
          <div class="flex flex-wrap gap-2 mb-5">${x.dates.map((d,i) => `<button class="chip ${i===0?"active":""}" data-exp-date>${d}</button>`).join("")}</div>
          <button class="btn btn-primary btn-block" id="bookExperienceBtn">Book Experience</button>
          <button class="btn btn-secondary btn-block mt-2" id="addToYatraExpBtn">Add to Yatra</button>
        </div>
      </div>
    </div>
  `;
  icons();
}
document.addEventListener("click", (e) => {
  const d = e.target.closest("[data-exp-date]");
  if (d) { d.parentElement.querySelectorAll(".chip").forEach(c=>c.classList.remove("active")); d.classList.add("active"); }
  if (e.target.closest("#bookExperienceBtn")) openBookingModal(currentExperience.title, currentExperience.price, "service");
  if (e.target.closest("#addToYatraExpBtn")) toast(`"${currentExperience.title}" added to your Yatra`, "plus-circle");
});

/* ===================== YATRA PASSPORT ===================== */
function renderPassport() {
  const p = PASSPORT;
  const xpPct = Math.round((p.xp / p.xpNext) * 100);
  document.getElementById("passportRoot").innerHTML = `
    <div class="passport-hero p-8 md:p-10 relative">
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span class="badge" style="background:rgba(255,255,255,.15);color:#fff">YATRA PASSPORT 🇮🇳</span>
          <h1 class="font-head text-2xl md:text-3xl font-semibold mt-3">${p.name}'s Yatra Passport</h1>
          <p class="text-white/70 mt-1">${p.level} — Level ${p.levelNum}</p>
        </div>
        <div class="w-full md:w-72">
          <div class="flex justify-between text-xs text-white/70 mb-1.5"><span>${p.xp} / ${p.xpNext} XP</span><span>${xpPct}%</span></div>
          <div class="xp-bar"><div class="xp-fill" style="width:${xpPct}%"></div></div>
        </div>
      </div>
      <div class="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-9">
        <div><p class="font-head text-2xl md:text-3xl font-semibold">${p.stats.cities}</p><p class="text-xs text-white/60 mt-1">Cities Visited</p></div>
        <div><p class="font-head text-2xl md:text-3xl font-semibold">${p.stats.places}</p><p class="text-xs text-white/60 mt-1">Places Discovered</p></div>
        <div><p class="font-head text-2xl md:text-3xl font-semibold">${p.stats.experiences}</p><p class="text-xs text-white/60 mt-1">Local Experiences</p></div>
        <div><p class="font-head text-2xl md:text-3xl font-semibold">${p.stats.gems}</p><p class="text-xs text-white/60 mt-1">Hidden Gems</p></div>
      </div>
    </div>

    <h3 class="font-head text-xl font-semibold mt-12 mb-5">Achievement Badges</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      ${p.badges.map(b => `
        <div class="badge-tile ${b.earned ? "" : "locked"}">
          <div class="text-3xl mb-2">${b.icon}</div>
          <p class="text-xs font-semibold">${b.name}</p>
          ${!b.earned ? '<p class="text-[10px] text-gray-400 mt-1">Locked</p>' : ""}
        </div>`).join("")}
    </div>

    <div class="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-12">
      <div class="card p-7">
        <h3 class="font-head text-xl font-semibold mb-5">Your Yatra Journey</h3>
        <div class="flex items-center flex-wrap gap-3">
          ${p.journey.map((stop, i) => `
            <span class="badge-rust badge">${stop.city}</span>
            ${i < p.journey.length - 1 ? '<i data-lucide="arrow-right" class="w-4 h-4 text-gray-300"></i>' : ""}
          `).join("")}
        </div>
        <div class="h-52 mt-6 rounded-2xl overflow-hidden relative" id="passportMapCanvas"></div>
      </div>
      <div class="card p-7" style="background:var(--leaf-soft);border:none">
        <span class="section-eyebrow" style="color:var(--leaf)">Next Adventure</span>
        <h3 class="font-head text-2xl font-semibold mt-2">Explore Varanasi</h3>
        <p class="text-sm mt-2 text-gray-600">Complete this Yatra to unlock the "Ganga Wanderer" badge and 150 XP.</p>
        <button class="btn btn-dark mt-5" id="planNextAdventureBtn">Plan Next Yatra</button>
      </div>
    </div>

    <div class="mt-12">
      <h3 class="font-head text-xl font-semibold mb-5">Your Travel Timeline</h3>
      <div class="timeline flex flex-col gap-5">
        ${p.journey.map((stop, i) => `
          <div class="relative">
            <div class="timeline-dot">${i + 1}</div>
            <div class="card p-4 flex flex-wrap items-center gap-4">
              <div class="w-28 text-xs font-bold flex-shrink-0" style="color:var(--rust)">${stop.date}</div>
              <div class="flex-1 min-w-[160px]">
                <p class="font-semibold text-sm">${stop.city}</p>
                <p class="text-xs text-gray-500 mt-0.5">${stop.highlight}</p>
              </div>
              <button class="btn btn-secondary btn-sm" data-passport-fly="${i}"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i> View on Map</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  icons();
}

let passportMap = null;
let passportMarkers = [];

function ensurePassportMap() {
  if (passportMap) {
    setTimeout(() => passportMap.invalidateSize(), 50);
    return;
  }
  const canvas = document.getElementById("passportMapCanvas");
  if (!canvas) return;
  passportMap = L.map("passportMapCanvas", { scrollWheelZoom: false, zoomControl: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(passportMap);

  const latlngs = PASSPORT.journey.map(s => [s.lat, s.lng]);
  L.polyline(latlngs, { color: "#C1502E", weight: 3, dashArray: "6 6" }).addTo(passportMap);

  passportMarkers = PASSPORT.journey.map((stop, i) => {
    const icon = L.divIcon({
      className: "",
      html: `<div class="map-pin" style="background:#C1502E"><span style="transform:rotate(45deg);color:#fff;font-size:11px;font-weight:700">${i + 1}</span></div>`,
      iconSize: [30, 30], iconAnchor: [15, 28]
    });
    return L.marker([stop.lat, stop.lng], { icon }).addTo(passportMap).bindPopup(`<b>${stop.city}</b><br>${stop.date}`);
  });

  setTimeout(() => {
    passportMap.invalidateSize();
    passportMap.fitBounds(latlngs, { padding: [30, 30] });
  }, 50);
}

document.addEventListener("click", (e) => {
  const flyBtn = e.target.closest("[data-passport-fly]");
  if (flyBtn && passportMap) {
    const idx = parseInt(flyBtn.dataset.passportFly, 10);
    const stop = PASSPORT.journey[idx];
    passportMap.setView([stop.lat, stop.lng], 12, { animate: false });
    const marker = passportMarkers[idx];
    if (marker) marker.openPopup();
  }
});
document.addEventListener("click", (e) => {
  if (e.target.closest("#planNextAdventureBtn")) {
    state.planner.destination = "Varanasi";
    showPage("planner");
    resetPlanner();
  }
});

/* ===================== SUPPORT PAGE ===================== */
const SUPPORT_ACTIONS = [
  { icon: "🆘", label: "Emergency Help", id: "emergency" },
  { icon: "📍", label: "Share Location", id: "location" },
  { icon: "🚕", label: "Find Transport", id: "transport" },
  { icon: "🏥", label: "Find Hospital", id: "hospital" },
  { icon: "👮", label: "Police Assistance", id: "police" },
  { icon: "📞", label: "Contact Support", id: "contact" }
];
function renderSupport() {
  document.getElementById("supportButtons").innerHTML = SUPPORT_ACTIONS.map(a => `
    <button class="card p-6 flex items-center gap-4 text-left" data-support-action="${a.id}">
      <span class="text-3xl">${a.icon}</span>
      <span class="font-semibold">${a.label}</span>
    </button>
  `).join("");
  renderChatMessages([{ role: "ai", text: "Hi! I'm your APNIYATRA AI assistant. Tell me what's going on and I'll help right away." }]);
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-support-action]");
  if (a) {
    const item = SUPPORT_ACTIONS.find(x => x.id === a.dataset.supportAction);
    toast(`${item.label} activated`, "shield-check");
  }
  if (e.target.closest("#humanSupportBtn")) toast("Connecting you to a human support agent…", "headset");
  if (e.target.closest("#sosBtn")) toast("Emergency services alerted. Stay where you are.", "siren");
});

/* --- chat --- */
let chatHistory = [];
function renderChatMessages(seed) {
  chatHistory = seed;
  paintChat();
}
function paintChat() {
  document.getElementById("chatMessages").innerHTML = chatHistory.map(m => `<div class="chat-bubble ${m.role === "user" ? "user" : "ai"}">${m.text}</div>`).join("");
  document.getElementById("chatMessages").scrollTop = 999999;
}
function sendChat() {
  const input = document.getElementById("chatInput");
  const val = input.value.trim();
  if (!val) return;
  chatHistory.push({ role: "user", text: val });
  paintChat();
  input.value = "";
  setTimeout(() => {
    const lower = val.toLowerCase();
    const found = CHAT_RESPONSES.keywords.find(k => k.match.some(w => lower.includes(w)));
    chatHistory.push({ role: "ai", text: found ? found.reply : CHAT_RESPONSES.default });
    paintChat();
  }, 600);
}
document.getElementById("chatSendBtn").addEventListener("click", sendChat);
document.getElementById("chatInput").addEventListener("keydown", (e) => { if (e.key === "Enter") sendChat(); });

/* ===================== AUTH PAGE ===================== */
document.getElementById("toSignup").addEventListener("click", () => {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
  renderChipGroup(document.getElementById("signupInterestChips"), INTERESTS, state.signupInterests);
});
document.getElementById("toLogin").addEventListener("click", () => {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
});
document.getElementById("loginBtn").addEventListener("click", () => {
  state.loggedIn = true;
  toast("Welcome back!", "check-circle");
  renderDashboard();
  showPage("dashboard");
});
document.getElementById("signupBtn").addEventListener("click", () => {
  state.loggedIn = true;
  toast("Account created — welcome to APNIYATRA!", "party-popper");
  renderDashboard();
  showPage("dashboard");
});

/* ===================== DASHBOARD ===================== */
function renderDashboard() {
  document.getElementById("dashboardRoot").innerHTML = `
    <h1 class="font-head text-3xl font-semibold">Good morning, Gitin 👋</h1>
    <p class="text-gray-500 mt-2">Where are you travelling next?</p>

    <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8">
      ${[
        { icon: "sparkles", label: "Plan a Yatra", nav: "planner" },
        { icon: "compass", label: "Explore destinations", nav: "home" },
        { icon: "calendar-check", label: "My bookings", nav: "checkout" },
        { icon: "award", label: "Yatra Passport", nav: "passport" },
        { icon: "heart", label: "Saved places", nav: "home" }
      ].map(a => `
        <button class="card p-5 flex flex-col items-center gap-2 text-center" data-nav="${a.nav}">
          <i data-lucide="${a.icon}" style="color:var(--rust)"></i>
          <span class="text-xs font-semibold">${a.label}</span>
        </button>`).join("")}
    </div>

    <h3 class="font-head text-xl font-semibold mt-12 mb-4">Upcoming Yatra</h3>
    <div class="card p-6 md:p-7 flex flex-col md:flex-row gap-6 items-start md:items-center">
      <img src="${DESTINATIONS[0].img}" class="w-full md:w-40 h-32 object-cover rounded-2xl">
      <div class="flex-1">
        <h4 class="font-head text-xl font-semibold">Jaipur</h4>
        <p class="text-sm text-gray-500 mt-1">12–15 September · 3 Days · ₹8,500</p>
        <div class="flex items-center gap-2 mt-4 text-xs font-semibold">
          <span class="badge-rust badge">Planning</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-gray-300"></i>
          <span class="badge">Booked</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-gray-300"></i>
          <span class="badge" style="background:#eee;color:#999">Ready to Travel</span>
        </div>
      </div>
      <button class="btn btn-secondary" data-nav="planner">View Plan</button>
    </div>
  `;
  icons();
}

/* ===================== INIT ===================== */
function init() {
  renderHome();
  initHeroSearch();
  resetPlanner();
  renderMap();
  renderServices();
  renderPassport();
  renderSupport();
  updateBookingBadge();
  showPage("home");
  icons();
}
init();
