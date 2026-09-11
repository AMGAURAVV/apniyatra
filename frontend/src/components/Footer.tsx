import React from "react";
import Link from "next/link";
import { Compass, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2A2118] text-[#FBF6ED] pt-16 pb-12 mt-20 border-t border-[#E7DCC9]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#C1502E] flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                APNIYATRA
              </span>
            </div>
            <p className="mt-4 text-sm text-[#FBF6ED]/70 leading-relaxed">
              A local-first travel platform for India. Discover offbeat gems, uncover centuries of oral folklore, and connect with licensed guides and local rentals.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E3A23C]">
              Discover India
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#FBF6ED]/80">
              <li>
                <Link href="/places?category=stepwell" className="hover:text-white transition">
                  Ancient Stepwells & Baolis
                </Link>
              </li>
              <li>
                <Link href="/places?category=fort" className="hover:text-white transition">
                  Lesser-known Hill Forts
                </Link>
              </li>
              <li>
                <Link href="/places?category=artisan" className="hover:text-white transition">
                  Artisan & Craft Villages
                </Link>
              </li>
              <li>
                <Link href="/places?is_hidden_gem=true" className="hover:text-white transition">
                  Curated Hidden Gems
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E3A23C]">
              Local Services
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#FBF6ED]/80">
              <li>
                <Link href="/services?category=guides" className="hover:text-white transition">
                  Heritage Storytellers & Guides
                </Link>
              </li>
              <li>
                <Link href="/services?category=rentals" className="hover:text-white transition">
                  Enfield, Scooter & Car Rentals
                </Link>
              </li>
              <li>
                <Link href="/services?category=experiences" className="hover:text-white transition">
                  Traditional Cooking Workshops
                </Link>
              </li>
              <li>
                <Link href="/passport" className="hover:text-white transition">
                  Digital Yatra Passport
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#E3A23C]">
              Smart India 2026
            </h4>
            <p className="mt-4 text-xs text-[#FBF6ED]/70 leading-relaxed">
              Engineered with FastAPI, SQLAlchemy, PostgreSQL, and Next.js. Empowering local communities with verifiable travel technology.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-[#FBF6ED]/5 border border-[#FBF6ED]/10 text-xs text-[#E3A23C]">
              <span className="font-semibold text-white block mb-1">Local Provider Pledge</span>
              100% direct booking fees go to local hosts, guides, and vehicle owners.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#FBF6ED]/10 flex flex-col md:flex-row items-center justify-between text-xs text-[#FBF6ED]/50 gap-4">
          <p>© 2026 ApniYatra Technologies. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#FBF6ED]/70">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C1502E] fill-current" />
            <span>for authentic Indian journeys</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
