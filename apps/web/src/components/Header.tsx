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
        <div className="flex items-center gap-2.5 sm:gap-5 shrink-0">
          {/* City Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCityOpen(!cityOpen)}
              className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-[13px] font-medium text-[#1b1b1f] hover:text-[#eb4e62] transition cursor-pointer"
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
            className="h-7 sm:h-8 px-2.5 sm:px-3.5 rounded-[6px] bg-[#eb4e62] hover:bg-[#d63a50] text-white text-[11.5px] sm:text-[12.5px] font-heading font-extrabold flex items-center justify-center transition shadow-xs whitespace-nowrap"
          >
            Sign in
          </Link>

          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 text-[#1b1b1f] hover:text-[#eb4e62] cursor-pointer"
            aria-label="Open menu"
          >
            <svg width="24" height="20" viewBox="0 0 30 24" className="stroke-current fill-none stroke-2">
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

      {/* Mobile Slide-Over Menu Drawer (.udr) matching lines 2859-2879 of Kalasquare_Home_Page_Manager_2.html */}
      <div
        className={`udr ${mobileMenuOpen ? 'open' : ''}`}
        id="mDr"
        hidden={!mobileMenuOpen}
      >
        <div
          className="udr-bk"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        <aside
          className="udr-p"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="udr-h">
            <div>
              <h3>Hey!</h3>
            </div>
            <button
              type="button"
              className="udr-x"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="udr-l">
            <Link
              href="/timeline"
              onClick={() => setMobileMenuOpen(false)}
              className="udr-r"
            >
              <span className="udr-i">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
              </span>
              <div className="udr-t">
                <b>Timeline <em>New</em></b>
                <small>Jobs, collabs and KalaSquare updates</small>
              </div>
            </Link>

            <Link
              href="/membership"
              onClick={() => setMobileMenuOpen(false)}
              className="udr-r"
            >
              <span className="udr-i">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              </span>
              <div className="udr-t">
                <b>Membership <em>New</em></b>
                <small>Verified and Platinum plans for artists</small>
              </div>
            </Link>

            <Link
              href="/spotlight"
              onClick={() => setMobileMenuOpen(false)}
              className="udr-r"
            >
              <span className="udr-i">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
              </span>
              <div className="udr-t">
                <b>KS Spotlight</b>
                <small>Stories, news and tips</small>
              </div>
            </Link>

            <Link
              href="/top-creators"
              onClick={() => setMobileMenuOpen(false)}
              className="udr-r"
            >
              <span className="udr-i">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <div className="udr-t">
                <b>Top Creators</b>
                <small>Discover verified talent</small>
              </div>
            </Link>

            <Link
              href="/top-creators?view=hire"
              onClick={() => setMobileMenuOpen(false)}
              className="udr-r"
            >
              <span className="udr-i">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </span>
              <div className="udr-t">
                <b>Hire Artists</b>
                <small>Book performers for your event</small>
              </div>
            </Link>

            <Link
              href="#venues"
              onClick={() => setMobileMenuOpen(false)}
              className="udr-r"
            >
              <span className="udr-i">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <div className="udr-t">
                <b>Venues</b>
                <small>Studios, stages and auditoriums</small>
              </div>
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="udr-r"
            >
              <span className="udr-i">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </span>
              <div className="udr-t">
                <b>About us</b>
                <small>Who we are and why we built KalaSquare</small>
              </div>
            </Link>
          </div>

          <div className="udr-f">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="udr-so flex items-center justify-center font-bold"
            >
              Sign in
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}
