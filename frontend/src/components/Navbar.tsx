"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, Receipt, Sparkles } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Explore" },
    { href: "/map", label: "Interactive Map" },
    { href: "/planner", label: "Trip Wizard" },
    { href: "/places", label: "Places & Folklore" },
    { href: "/services", label: "Local Services" },
    { href: "/passport", label: "Yatra Passport" },
    { href: "/bookings", label: "My Bookings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FBF6ED]/95 backdrop-blur-md border-b border-[#E7DCC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-10 h-10 rounded-full bg-[#C1502E] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Compass className="w-6 h-6 animate-pulse" />
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2A2118]">
                APNIYATRA
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8A7A6B] -mt-1">
                Your journey · Your India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#C1502E] relative py-1 ${
                    active ? "text-[#C1502E] font-semibold" : "text-[#5B4C3F]"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C1502E] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/passport"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E3A23C]/20 text-[#2A2118] border border-[#E3A23C]/30 hover:bg-[#E3A23C]/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C1502E]" />
              <span>Explorer Lvl 4</span>
            </Link>
            <Link
              href="/planner"
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#C1502E] text-white shadow-sm hover:bg-[#9C3D22] transition-all hover:-translate-y-0.5"
            >
              Trip Wizard
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-[#2A2118] hover:bg-[#F4ECDD] transition"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[#E7DCC9] bg-[#FBF6ED] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                pathname === link.href
                  ? "bg-[#F4ECDD] text-[#C1502E] font-semibold"
                  : "text-[#5B4C3F] hover:bg-[#F4ECDD]/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/planner"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center block px-5 py-3 rounded-full text-sm font-semibold bg-[#C1502E] text-white shadow-sm"
            >
              Launch Trip Wizard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
