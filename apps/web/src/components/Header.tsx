'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [city, setCity] = useState('Delhi-NCR');
  const [cityOpen, setCityOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cities = ['Delhi-NCR', 'Mumbai'];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e6e6ea]">
      {/* Top Bar */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-6 sm:gap-8">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center text-2xl font-heading font-extrabold tracking-tight shrink-0"
        >
          <span className="text-[#1b1b1f]">Kala</span>
          <span className="text-[#eb4e62]">Square</span>
        </Link>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-[540px] relative hidden sm:block">
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6b76] pointer-events-none"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search artists, venues and events"
            aria-label="Search"
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] text-sm text-[#1b1b1f] placeholder:text-[#6b6b76] focus:outline-2 focus:outline-[#eb4e62] focus:bg-white transition"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {/* City Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCityOpen(!cityOpen)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#1b1b1f] hover:text-[#eb4e62] transition cursor-pointer"
              aria-expanded={cityOpen}
            >
              <span>{city}</span>
              <svg width="10" height="10" viewBox="0 0 12 12" className="text-[#6b6b76]">
                <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>

            {cityOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-[#e6e6ea] rounded-xl p-1.5 shadow-xl z-50 animate-scale-up">
                {cities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCity(c);
                      setCityOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      city === c ? 'text-[#eb4e62] bg-[#fde6ea]' : 'text-[#1b1b1f] hover:bg-[#f6f6f7]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sign In Button */}
          <Link
            href="/admin/login"
            className="h-8 px-3.5 rounded-[6px] bg-[#eb4e62] hover:bg-[#d63a50] text-white text-[12.5px] font-heading font-extrabold flex items-center justify-center transition shadow-xs"
          >
            Sign in
          </Link>

          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-[#1b1b1f] hover:text-[#eb4e62] cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg width="26" height="20" viewBox="0 0 30 24" className="stroke-current fill-none stroke-2">
              <path d="M2 5h26M2 12h26M2 19h26" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="sm:hidden px-4 pb-3">
        <input
          type="search"
          placeholder="Search artists, venues and events"
          className="w-full h-10 px-4 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] text-sm text-[#1b1b1f] outline-none"
        />
      </div>

      {/* Subnav (Right-aligned, bg #f6f6f7) */}
      <nav className="bg-[#f6f6f7] border-t border-[#e6e6ea] hidden sm:block">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-[42px] flex items-center justify-end gap-9 text-[15px] font-medium text-[#6b6b76]">
          <Link href="/top-creators" className="hover:text-[#eb4e62] transition">
            Top Creators
          </Link>
          <Link href="/top-creators?view=hire" className="hover:text-[#eb4e62] transition">
            Hire Artists
          </Link>
          <Link href="#events" className="hover:text-[#eb4e62] transition">
            Events &amp; Shows
          </Link>
          <Link href="#venues" className="hover:text-[#eb4e62] transition">
            Venues
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#f6f6f7] border-t border-[#e6e6ea] px-6 py-4 space-y-3">
          <Link
            href="/top-creators"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[15px] font-medium text-[#1b1b1f] hover:text-[#eb4e62]"
          >
            Top Creators
          </Link>
          <Link
            href="/top-creators?view=hire"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[15px] font-medium text-[#1b1b1f] hover:text-[#eb4e62]"
          >
            Hire Artists
          </Link>
          <Link
            href="#events"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[15px] font-medium text-[#1b1b1f] hover:text-[#eb4e62]"
          >
            Events &amp; Shows
          </Link>
          <Link
            href="#venues"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[15px] font-medium text-[#1b1b1f] hover:text-[#eb4e62]"
          >
            Venues
          </Link>
        </div>
      )}
    </header>
  );
}
