'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Menu, X, MapPin } from 'lucide-react';

export default function Header() {
    const [city, setCity] = useState('Delhi-NCR');
    const [cityOpen, setCityOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const cities = ['Delhi-NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Kolkata'];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-[#e6e6ea]">
            {/* Top Bar */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
                {/* Left: Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-0.5 text-2xl font-extrabold font-heading tracking-tight"
                >
                    <span className="text-[#1b1b1f]">Kala</span>
                    <span className="text-[#eb4e62]">Square</span>
                </Link>

                {/* Center: Search Bar (Desktop/Tablet) */}
                <div className="hidden md:flex flex-1 max-w-lg mx-6">
                    <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b76]" />
                        <input
                            type="search"
                            placeholder="Search for artists, venues, events"
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#f6f6f7] border border-transparent focus:border-[#eb4e62] focus:bg-white text-sm outline-none transition"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Mobile Search Icon Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        className="md:hidden p-2 rounded-lg text-[#1b1b1f] hover:bg-[#f6f6f7]"
                        aria-label="Toggle search"
                    >
                        <Search className="h-5 w-5" />
                    </button>

                    {/* City Dropdown */}
                    <div className="relative hidden sm:block">
                        <button
                            type="button"
                            onClick={() => setCityOpen(!cityOpen)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[#1b1b1f] hover:bg-[#f6f6f7] transition"
                        >
                            <MapPin className="h-3.5 w-3.5 text-[#eb4e62]" />
                            <span>{city}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-[#6b6b76]" />
                        </button>

                        {cityOpen && (
                            <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-[#e6e6ea] py-1.5 z-50">
                                {cities.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                            setCity(c);
                                            setCityOpen(false);
                                        }}
                                        className={`w-full text-left px-3.5 py-2 text-sm transition hover:bg-[#f6f6f7] ${
                                            city === c
                                                ? 'text-[#eb4e62] font-semibold'
                                                : 'text-[#1b1b1f]'
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="button"
                        className="h-10 px-5 rounded-[10px] bg-[#eb4e62] hover:bg-[#d63a50] text-white text-sm font-semibold transition flex items-center justify-center shadow-sm"
                    >
                        Sign in
                    </button>

                    {/* Hamburger Icon */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg text-[#1b1b1f] hover:bg-[#f6f6f7] transition"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar Expandable */}
            {mobileSearchOpen && (
                <div className="md:hidden px-4 pb-3">
                    <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b76]" />
                        <input
                            type="search"
                            placeholder="Search artists, venues, events"
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] text-sm outline-none"
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {/* Sub Navigation Bar (Desktop) */}
            <nav className="border-t border-[#e6e6ea] bg-white hidden md:block">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-11 flex items-center gap-8 text-sm font-medium text-[#1b1b1f]">
                    <Link href="/top-creators" className="hover:text-[#eb4e62] transition">
                        Top Creators
                    </Link>
                    <Link
                        href="/top-creators?view=hire"
                        className="hover:text-[#eb4e62] transition"
                    >
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

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-[#e6e6ea] bg-white px-4 py-4 space-y-3">
                    <Link
                        href="/top-creators"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-base font-medium text-[#1b1b1f] hover:text-[#eb4e62]"
                    >
                        Top Creators
                    </Link>
                    <Link
                        href="/top-creators?view=hire"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-base font-medium text-[#1b1b1f] hover:text-[#eb4e62]"
                    >
                        Hire Artists
                    </Link>
                    <Link
                        href="#events"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-base font-medium text-[#1b1b1f] hover:text-[#eb4e62]"
                    >
                        Events &amp; Shows
                    </Link>
                    <Link
                        href="#venues"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-base font-medium text-[#1b1b1f] hover:text-[#eb4e62]"
                    >
                        Venues
                    </Link>
                </div>
            )}
        </header>
    );
}
