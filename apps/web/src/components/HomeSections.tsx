'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import DemoBar from './DemoBar';
import Header from './Header';
import Hero from './Hero';
import ArtistCard from './ArtistCard';
import CategoryCard from './CategoryCard';
import EventCard from './EventCard';
import VenueCard from './VenueCard';
import FAQSection from './FAQSection';
import Footer from './Footer';
import KalaMitraWidget from './KalaMitraWidget';
import {
  mockArtists,
  mockCategories,
  mockEvents,
  mockVenues,
} from '@/lib/mock-data';

interface HomeSectionsProps {
  initialData?: any;
}

export default function HomeSections({ initialData }: HomeSectionsProps) {
  // References for horizontal scrolling rails
  const platinumRailRef = useRef<HTMLDivElement>(null);
  const newRailRef = useRef<HTMLDivElement>(null);
  const eventsRailRef = useRef<HTMLDivElement>(null);
  const risingRailRef = useRef<HTMLDivElement>(null);
  const venuesRailRef = useRef<HTMLDivElement>(null);

  const scrollRail = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Listen for local admin artists
  const [extraArtists, setExtraArtists] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('kalasquare_admin_artists');
        if (raw) {
          const list: any[] = JSON.parse(raw);
          setExtraArtists(list.filter((a) => a.status === 'published' || a.status === 'live'));
        }
      } catch {}
    }
  }, []);

  const localPlatinum = useMemo(() => {
    return extraArtists
      .filter((a) => a.artistClass === 'platinum')
      .map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        cat: Array.isArray(a.categories) && a.categories.length > 0 ? a.categories[0] : (a.category || 'Artist'),
        city: a.city || 'Delhi',
        photoUrl: a.photoUrl || a.profilePhotoUrl || '',
        tier: 'platinum' as const,
      }));
  }, [extraArtists]);

  const localRising = useMemo(() => {
    return extraArtists
      .filter((a) => a.artistClass === 'rising')
      .map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        cat: Array.isArray(a.categories) && a.categories.length > 0 ? a.categories[0] : (a.category || 'Artist'),
        city: a.city || 'Delhi',
        photoUrl: a.photoUrl || a.profilePhotoUrl || '',
        tier: 'rising' as const,
      }));
  }, [extraArtists]);

  const localNew = useMemo(() => {
    return extraArtists
      .slice(0, 3)
      .map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        cat: Array.isArray(a.categories) && a.categories.length > 0 ? a.categories[0] : (a.category || 'Artist'),
        city: a.city || 'Delhi',
        photoUrl: a.photoUrl || a.profilePhotoUrl || '',
        tier: a.artistClass || 'standard',
      }));
  }, [extraArtists]);

  const dedupeArtists = (list: any[]) => {
    const seen = new Set<string>();
    return list.filter((item) => {
      if (!item) return false;
      const key = item.id || item.slug;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const platinumArtists = useMemo(() => {
    const existingSlugs = new Set(localPlatinum.map((a) => a.slug));
    const base = (initialData?.platinumArtists && initialData.platinumArtists.length > 0
      ? initialData.platinumArtists
      : mockArtists.slice(0, 5)).filter((a: any) => !existingSlugs.has(a.slug));
    return dedupeArtists([...localPlatinum, ...base]);
  }, [localPlatinum, initialData]);

  const newArtists = useMemo(() => {
    const existingSlugs = new Set(localNew.map((a) => a.slug));
    const base = (initialData?.newArtists && initialData.newArtists.length > 0
      ? initialData.newArtists
      : [mockArtists.find((a) => a.slug === 'priyam') || mockArtists[5]]).filter((a: any) => !existingSlugs.has(a.slug));
    return dedupeArtists([...localNew, ...base]);
  }, [localNew, initialData]);

  const risingArtists = useMemo(() => {
    const existingSlugs = new Set(localRising.map((a) => a.slug));
    const base = (initialData?.risingArtists && initialData.risingArtists.length > 0
      ? initialData.risingArtists
      : mockArtists.filter((a) => ['ria-bally', 'khushboo-choubey', 'aarav-mehta', 'tanya-bose'].includes(a.slug))).filter((a: any) => !existingSlugs.has(a.slug));
    return dedupeArtists([...localRising, ...base]);
  }, [localRising, initialData]);

  const eventsList =
    initialData?.events && initialData.events.length > 0 ? initialData.events : mockEvents.slice(0, 4);

  const venuesList =
    initialData?.venues && initialData.venues.length > 0 ? initialData.venues : mockVenues.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] text-[#1b1b1f]">
      {/* 1. Top Kalasquare Live Demo Bar */}
      <DemoBar currentPage="home" />

      {/* Global Public Header */}
      <Header />

      <main className="flex-1">
        {/* 4. Hero Section */}
        <Hero />

        {/* 5. Platinum Artists Section */}
        <section id="artists" className="py-12 sm:py-16 bg-white border-b border-[#e6e6ea]">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Platinum artists
                </h2>
                <p className="text-[14px] text-[#6b6b76] mt-1">
                  India&apos;s finest artists, ready to book.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/top-creators"
                  className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition mr-1"
                >
                  See all
                </Link>
                <button
                  type="button"
                  onClick={() => scrollRail(platinumRailRef, 'left')}
                  className="w-9 h-9 rounded-full border border-[#e6e6ea] bg-white hover:bg-[#eb4e62] hover:border-[#eb4e62] hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail(platinumRailRef, 'right')}
                  className="w-9 h-9 rounded-full border border-[#e6e6ea] bg-white hover:bg-[#eb4e62] hover:border-[#eb4e62] hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Horizontal Rail */}
            <div
              ref={platinumRailRef}
              className="flex gap-4.5 overflow-x-auto scroll-smooth no-scrollbar py-2"
            >
              {platinumArtists.map((artist: any) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        </section>

        {/* 6. New on KalaSquare Section */}
        <section id="new" className="py-10 sm:py-14 bg-white border-b border-[#e6e6ea]">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  New on KalaSquare
                </h2>
                <p className="text-[14px] text-[#6b6b76] mt-1">
                  Artists who just joined.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollRail(newRailRef, 'left')}
                  className="w-9 h-9 rounded-full border border-[#e6e6ea] bg-white hover:bg-[#eb4e62] hover:border-[#eb4e62] hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail(newRailRef, 'right')}
                  className="w-9 h-9 rounded-full border border-[#e6e6ea] bg-white hover:bg-[#eb4e62] hover:border-[#eb4e62] hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Horizontal Rail */}
            <div
              ref={newRailRef}
              className="flex gap-4.5 overflow-x-auto scroll-smooth no-scrollbar py-2"
            >
              {newArtists.map((artist: any) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        </section>

        {/* 7. Find Talent By Category Section (12 categories) */}
        <section id="talent" className="py-12 sm:py-16 bg-[#f6f6f7] border-b border-[#e6e6ea] relative">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
            {/* Top Right Edit in Admin pill */}
            <div className="flex justify-end mb-2">
              <Link
                href="/admin/home-page"
                className="bg-[#17171c] hover:bg-black text-white text-[12px] font-bold px-3 py-1 rounded-full transition shadow-xs"
              >
                Edit in Admin
              </Link>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Find talent by category
                </h2>
                <p className="text-[14px] text-[#6b6b76] mt-1">
                  Pick the kind of performer you need.
                </p>
              </div>

              <Link
                href="/top-creators"
                className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition"
              >
                View all
              </Link>
            </div>

            {/* 12 Category Cards: 2 rows of 6 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6">
              {mockCategories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* 8. Stage & Spotlights Section */}
        <section id="events" className="py-12 sm:py-16 bg-white border-b border-[#e6e6ea] relative">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
            {/* Top Right Edit in Admin pill */}
            <div className="flex justify-end mb-3">
              <Link
                href="/admin/home-page"
                className="bg-[#17171c] hover:bg-black text-white text-[12px] font-bold px-3 py-1 rounded-full transition shadow-xs"
              >
                Edit in Admin
              </Link>
            </div>

            {/* Spotlight Banner Card */}
            <div
              className="relative rounded-[24px] overflow-hidden p-8 sm:p-12 text-white shadow-md flex flex-col justify-center min-h-[220px] sm:min-h-[260px]"
              style={{
                backgroundImage: 'linear-gradient(150deg, #ee6579 0%, #eb4e62 50%, #b62c44 100%)',
              }}
            >
              <span className="text-[13px] font-medium text-white/90 block mb-1">
                Now on KalaSquare
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight mb-2">
                India&apos;s Next Voice
              </h2>
              <p className="text-sm sm:text-base text-white/90 mb-5">
                Tap to see details and book your spot.
              </p>
              <div>
                <a
                  href="#events"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-[10px] bg-white text-[#1b1b1f] hover:bg-neutral-100 font-heading font-bold text-xs shadow-xs transition"
                >
                  View event
                </a>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-2 mt-4 mb-12">
              <span className="w-5 h-1.5 rounded-full bg-[#eb4e62]" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
            </div>

            {/* 9. Featured events & shows */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Featured events &amp; shows
                </h2>
                <p className="text-[14px] text-[#6b6b76] mt-1">
                  Live on KalaSquare.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/home-page"
                  className="bg-[#17171c] hover:bg-black text-white text-[12px] font-bold px-3 py-1 rounded-full transition shadow-xs mr-2"
                >
                  Edit in Admin
                </Link>
                <button
                  type="button"
                  onClick={() => scrollRail(eventsRailRef, 'left')}
                  className="w-9 h-9 rounded-full border border-[#e6e6ea] bg-white hover:bg-[#eb4e62] hover:border-[#eb4e62] hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail(eventsRailRef, 'right')}
                  className="w-9 h-9 rounded-full border border-[#e6e6ea] bg-white hover:bg-[#eb4e62] hover:border-[#eb4e62] hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Horizontal Rail for Events */}
            <div
              ref={eventsRailRef}
              className="flex gap-4.5 overflow-x-auto scroll-smooth no-scrollbar py-2"
            >
              {eventsList.map((event: any, i: number) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* 10. Rising artists Section */}
        <section id="rising" className="py-12 sm:py-16 bg-[#f6f6f7] border-b border-[#e6e6ea] relative">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
            {/* Top Right Edit in Admin pill */}
            <div className="flex justify-end mb-2">
              <Link
                href="/admin/home-page"
                className="bg-[#17171c] hover:bg-black text-white text-[12px] font-bold px-3 py-1 rounded-full transition shadow-xs"
              >
                Edit in Admin
              </Link>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Rising artists
                </h2>
                <p className="text-[14px] text-[#6b6b76] mt-1">
                  Emerging talent to watch.
                </p>
              </div>

              <Link
                href="/top-creators"
                className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition"
              >
                See all
              </Link>
            </div>

            {/* Horizontal Rail for Rising Artists */}
            <div
              ref={risingRailRef}
              className="flex gap-4.5 overflow-x-auto scroll-smooth no-scrollbar py-2"
            >
              {risingArtists.map((artist: any) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        </section>

        {/* 11. Venues Section */}
        <section id="venues" className="py-12 sm:py-16 bg-white border-b border-[#e6e6ea] relative">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Venues
                </h2>
                <p className="text-[14px] text-[#6b6b76] mt-1">
                  Stages and studios for your next event.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="#venues"
                  className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition mr-1"
                >
                  All venues
                </Link>
                <button
                  type="button"
                  onClick={() => scrollRail(venuesRailRef, 'left')}
                  className="w-9 h-9 rounded-full border border-[#e6e6ea] bg-white hover:bg-[#eb4e62] hover:border-[#eb4e62] hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail(venuesRailRef, 'right')}
                  className="w-9 h-9 rounded-full border border-[#e6e6ea] bg-white hover:bg-[#eb4e62] hover:border-[#eb4e62] hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Horizontal Rail for Venues */}
            <div
              ref={venuesRailRef}
              className="flex gap-4.5 overflow-x-auto scroll-smooth no-scrollbar py-2"
            >
              {venuesList.map((venue: any) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </div>
        </section>

        {/* 12. Questions, answered. (FAQ Section) */}
        <FAQSection />
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* 14. Floating Kala Mitra AI Guide Mascot Widget */}
      <KalaMitraWidget />
    </div>
  );
}
