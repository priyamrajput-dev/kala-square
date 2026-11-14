'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  Check,
  Star,
  MapPin,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import DemoBar from '@/components/DemoBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockArtists } from '@/lib/mock-data';
import { Artist } from '@/lib/types';

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'Singer', name: 'Singers' },
  { id: 'Poets', name: 'Poets' },
  { id: 'Actor', name: 'Actors' },
  { id: 'Anchors', name: 'Anchors' },
  { id: 'Influencers', name: 'Influencers' },
  { id: 'Writers', name: 'Writers' },
  { id: 'Standup comedy', name: 'Standup comedy' },
  { id: 'Food vloggers', name: 'Food vloggers' },
  { id: 'Dancers', name: 'Dancers' },
  { id: 'Fitness', name: 'Fitness' },
  { id: 'Speakers', name: 'Speakers' },
  { id: 'Gaming', name: 'Gaming' },
];

const CITIES = ['All', 'Delhi', 'Mumbai', 'Lucknow', 'Haryana', 'Varanasi', 'Bangalore'];
const TIERS = ['All', 'platinum', 'rising', 'standard'];

export default function TopCreatorsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'followers' | 'rating' | 'name'>('trending');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filtered & sorted artists list
  const filteredArtists = useMemo(() => {
    return mockArtists.filter((a) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          a.cat.toLowerCase() === selectedCategory.toLowerCase() ||
          (a.categories || [a.cat]).some((c) => c.toLowerCase() === selectedCategory.toLowerCase());
        if (!matchesCategory) return false;
      }
      // City filter
      if (selectedCity !== 'All' && a.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      // Tier filter
      if (selectedTier !== 'All' && a.tier !== selectedTier) {
        return false;
      }
      // Verified filter
      if (verifiedOnly && !a.isVerified) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          a.name.toLowerCase().includes(q) ||
          a.cat.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          (a.tagline && a.tagline.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'followers') {
        const parseF = (s?: string) => {
          if (!s) return 0;
          const num = parseFloat(s.replace(/[^0-9.]/g, ''));
          if (s.includes('M')) return num * 1000000;
          if (s.includes('K')) return num * 1000;
          return num;
        };
        return parseF(b.followers) - parseF(a.followers);
      }
      // Default: trending (platinum first, then ratings)
      return (b.tier === 'platinum' ? 1 : 0) - (a.tier === 'platinum' ? 1 : 0);
    });
  }, [selectedCategory, selectedCity, selectedTier, verifiedOnly, searchQuery, sortBy]);

  // Featured artists (top 4 platinum)
  const featuredArtists = useMemo(() => {
    return mockArtists.filter((a) => a.tier === 'platinum').slice(0, 4);
  }, []);

  const totalCitiesCount = useMemo(() => {
    const set = new Set(mockArtists.map((a) => a.city).filter(Boolean));
    return set.size;
  }, []);

  const totalPlatinumCount = useMemo(() => {
    return mockArtists.filter((a) => a.tier === 'platinum').length;
  }, []);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('All');
    setSelectedTier('All');
    setVerifiedOnly(false);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCity !== 'All' ||
    selectedTier !== 'All' ||
    verifiedOnly ||
    Boolean(searchQuery.trim());

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] text-[#1b1b1f]">
      {/* 1. Top Kalasquare Live Demo Bar */}
      <DemoBar currentPage="directory" />

      {/* 2. Global Public Header */}
      <Header />

      {/* 3. Hero Header Section */}
      <section className="bg-gradient-to-b from-[#fde6ea]/30 via-white to-white border-b border-[#e6e6ea] pt-8 pb-10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b6b76] hover:text-[#eb4e62] transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fde6ea] text-[#eb4e62] mb-3">
                <Award className="h-3.5 w-3.5" />
                <span>KalaSquare Top Creators</span>
              </span>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1b1b1f] tracking-tight leading-tight">
                Top <em className="text-[#eb4e62] not-italic">Creators</em> & Artists
              </h1>
              <p className="text-[#6b6b76] text-base sm:text-lg mt-2 leading-relaxed">
                Artists with a strong track record, verified and handpicked by KalaSquare. Clear profiles, quick responses and a safe booking process.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white border border-[#e6e6ea] rounded-xl px-4 py-2.5 shadow-xs text-center min-w-[90px]">
                <b className="font-heading font-extrabold text-xl text-[#1b1b1f] block leading-tight">
                  {mockArtists.length}
                </b>
                <span className="text-[11px] font-medium text-[#6b6b76]">Creators</span>
              </div>
              <div className="bg-white border border-[#e6e6ea] rounded-xl px-4 py-2.5 shadow-xs text-center min-w-[90px]">
                <b className="font-heading font-extrabold text-xl text-[#eb4e62] block leading-tight">
                  {totalPlatinumCount}
                </b>
                <span className="text-[11px] font-medium text-[#6b6b76]">Platinum</span>
              </div>
              <div className="bg-white border border-[#e6e6ea] rounded-xl px-4 py-2.5 shadow-xs text-center min-w-[90px]">
                <b className="font-heading font-extrabold text-xl text-[#1b1b1f] block leading-tight">
                  {totalCitiesCount}
                </b>
                <span className="text-[11px] font-medium text-[#6b6b76]">Cities</span>
              </div>
            </div>
          </div>

          {/* Featured Artists Showcase Strip */}
          <div className="mt-8 pt-6 border-t border-[#e6e6ea]/60">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6b6b76] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#eb4e62]" />
                Featured Platinum Talent
              </span>
              <span className="text-xs text-[#6b6b76]">Handpicked for corporate galas & concerts</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {featuredArtists.map((fa) => (
                <Link
                  key={fa.id}
                  href={`/top-creators/${fa.slug}`}
                  className="group bg-white border border-[#e6e6ea] hover:border-[#eb4e62] rounded-xl p-3 flex items-center gap-3 transition shadow-xs"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#f0f0f2] shrink-0 flex items-center justify-center">
                    {fa.photoUrl ? (
                      <Image
                        src={fa.photoUrl}
                        alt={fa.name}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                        sizes="48px"
                      />
                    ) : (
                      <span className="font-heading font-extrabold text-lg text-[#eb4e62]">
                        {fa.name.replace(/^Dr\.\s*/i, '').charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <b className="font-heading font-bold text-sm text-[#1b1b1f] group-hover:text-[#eb4e62] transition truncate block leading-tight">
                      {fa.name}
                    </b>
                    <span className="text-xs text-[#6b6b76] truncate block mt-0.5">
                      {fa.cat} · {fa.city}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Category Filter Tabs (Pills) */}
      <section className="bg-white border-b border-[#e6e6ea] sticky top-[68px] z-30 shadow-xs">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map((c) => {
              const isSelected = selectedCategory === c.id;
              const count =
                c.id === 'all'
                  ? mockArtists.length
                  : mockArtists.filter(
                      (a) =>
                        a.cat.toLowerCase() === c.id.toLowerCase() ||
                        (a.categories || [a.cat]).some((cat) => cat.toLowerCase() === c.id.toLowerCase())
                    ).length;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#eb4e62] text-white shadow-xs'
                      : 'bg-[#f6f6f7] hover:bg-[#e6e6ea] text-[#1b1b1f]'
                  }`}
                >
                  <span>{c.name}</span>
                  <em
                    className={`not-italic text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#6b6b76]'
                    }`}
                  >
                    {count}
                  </em>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Main Content: Sidebar + Grid */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filters (4 cols on lg, modal toggle on mobile) */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Search Box */}
            <div className="bg-white border border-[#e6e6ea] rounded-2xl p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-sm text-[#1b1b1f]">Filters</span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-semibold text-[#eb4e62] hover:underline cursor-pointer"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="h-4 w-4 text-[#6b6b76] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, category, city"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] text-xs text-[#1b1b1f] placeholder:text-[#6b6b76] focus:outline-2 focus:outline-[#eb4e62] focus:bg-white transition"
                />
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-xs font-bold text-[#6b6b76] mb-1.5 uppercase tracking-wider">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[#f6f6f7] border border-[#e6e6ea] text-xs font-semibold text-[#1b1b1f] focus:outline-2 focus:outline-[#eb4e62]"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city === 'All' ? 'All Cities' : city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class/Tier Filter */}
              <div>
                <label className="block text-xs font-bold text-[#6b6b76] mb-1.5 uppercase tracking-wider">
                  Artist Class
                </label>
                <div className="space-y-1.5">
                  {TIERS.map((tier) => (
                    <label
                      key={tier}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#f6f6f7] cursor-pointer text-xs font-medium text-[#1b1b1f]"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="tierFilter"
                          checked={selectedTier === tier}
                          onChange={() => setSelectedTier(tier)}
                          className="accent-[#eb4e62]"
                        />
                        <span className="capitalize">{tier === 'All' ? 'All Classes' : tier}</span>
                      </div>
                      <span className="text-[11px] text-[#6b6b76]">
                        {tier === 'All'
                          ? mockArtists.length
                          : mockArtists.filter((a) => a.tier === tier).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Filter */}
              <div className="pt-2 border-t border-[#e6e6ea]">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#1b1b1f]">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#eb4e62]"
                  />
                  <span>Verified artists only</span>
                </label>
              </div>
            </div>

            {/* Promo Card: Sign up as artist */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1d1119] via-[#4a1730] to-[#eb4e62] text-white shadow-sm space-y-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-white/80">
                For Artists & Creators
              </span>
              <h4 className="font-heading font-extrabold text-base leading-snug">
                Join India&apos;s finest creative community
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Get discovered by brands, event organisers, and media houses. Free to list.
              </p>
              <Link
                href="/admin/artists/new"
                className="inline-block w-full text-center bg-white hover:bg-white/90 text-[#eb4e62] font-heading font-extrabold text-xs py-2 px-4 rounded-xl transition shadow-xs"
              >
                Join as Artist
              </Link>
            </div>
          </aside>

          {/* Right Column: Grid & Sort (9 cols on lg) */}
          <section className="lg:col-span-9 space-y-5">
            {/* Results header & Sort bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#e6e6ea] rounded-xl px-4 py-3 shadow-xs">
              <span className="text-xs font-semibold text-[#6b6b76]">
                Showing <b className="text-[#1b1b1f]">{filteredArtists.length}</b> of{' '}
                <b className="text-[#1b1b1f]">{mockArtists.length}</b> Creators
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#6b6b76]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-8 px-2.5 rounded-lg bg-[#f6f6f7] border border-[#e6e6ea] text-xs font-semibold text-[#1b1b1f] focus:outline-2 focus:outline-[#eb4e62]"
                >
                  <option value="trending">Trending & Platinum</option>
                  <option value="followers">Most Followers</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A to Z</option>
                </select>
              </div>
            </div>

            {/* Grid of Artist Cards */}
            {filteredArtists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredArtists.map((artist) => {
                  const hasPhoto = Boolean(artist.photoUrl && artist.photoUrl.trim() !== '');
                  const initialChar = artist.name
                    ? artist.name.replace(/^Dr\.\s*/i, '').charAt(0)
                    : 'A';
                  const isPlatinum = artist.tier === 'platinum';

                  return (
                    <article
                      key={artist.id}
                      className="group bg-white rounded-2xl border border-[#e6e6ea] hover:border-[#eb4e62] p-3 transition-all duration-200 flex flex-col hover:shadow-md"
                    >
                      {/* Photo / Letter Box */}
                      <Link
                        href={`/top-creators/${artist.slug}`}
                        className="relative w-full aspect-[4/4.2] rounded-xl overflow-hidden bg-[#f0f0f2] flex items-center justify-center block"
                      >
                        {hasPhoto ? (
                          <Image
                            src={artist.photoUrl}
                            alt={artist.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#fde6ea] to-[#f6f6f7]">
                            <span className="font-heading font-extrabold text-5xl text-[#eb4e62] select-none">
                              {initialChar}
                            </span>
                          </div>
                        )}

                        {/* Badge overlay */}
                        <div className="absolute top-2 left-2 z-10">
                          {isPlatinum ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fff4d6] text-[#8a5a00] border border-[#fde199] shadow-xs">
                              <Award className="h-3 w-3" />
                              <span>Platinum</span>
                            </span>
                          ) : artist.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f3ff] text-[#0066cc] border border-[#cce4ff] shadow-xs">
                              <Check className="h-3 w-3" />
                              <span>Verified</span>
                            </span>
                          ) : null}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="pt-3 flex-1 flex flex-col justify-between">
                        <div>
                          <Link href={`/top-creators/${artist.slug}`}>
                            <h3 className="font-heading font-bold text-[15px] text-[#1b1b1f] group-hover:text-[#eb4e62] transition truncate leading-snug">
                              {artist.name}
                            </h3>
                          </Link>
                          <span className="text-xs text-[#6b6b76] truncate block mt-0.5">
                            {artist.cat} · {artist.city}
                          </span>
                        </div>

                        {/* Meta: Followers + Rating */}
                        <div className="pt-2 mt-2 border-t border-[#f0f0f2] flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#1b1b1f]">
                            {artist.followers || 'Verified'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[#8a5a00] font-bold">
                            <Star className="h-3.5 w-3.5 fill-[#eb4e62] text-[#eb4e62]" />
                            {artist.rating ? artist.rating.toFixed(1) : '5.0'}
                          </span>
                        </div>

                        {/* CTA button */}
                        <Link
                          href={`/top-creators/${artist.slug}`}
                          className="mt-3 w-full h-8 rounded-lg bg-[#eb4e62] hover:bg-[#d63a50] text-white font-bold text-xs flex items-center justify-center transition shadow-xs"
                        >
                          Book now
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-[#e6e6ea] rounded-2xl p-12 text-center space-y-3">
                <span className="font-heading font-bold text-lg text-[#1b1b1f] block">
                  No creators match these filters
                </span>
                <p className="text-xs text-[#6b6b76] max-w-md mx-auto">
                  Try clearing some filters or searching with different keywords. New creators join every week.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-2 px-5 py-2 rounded-xl bg-[#eb4e62] text-white font-bold text-xs hover:bg-[#d63a50] transition shadow-xs cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* End of results note */}
            {filteredArtists.length > 0 && (
              <div className="bg-[#f6f6f7] border border-dashed border-[#e6e6ea] rounded-2xl p-6 text-center space-y-2 mt-8">
                <b className="font-heading font-bold text-sm text-[#1b1b1f] block">
                  You have seen all {filteredArtists.length} creators
                </b>
                <p className="text-xs text-[#6b6b76]">
                  Cannot find the exact artist you need? Our talent coordinators will curate a custom shortlist for you.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link
                    href="/"
                    className="px-4 py-2 rounded-xl bg-white border border-[#e6e6ea] hover:border-[#eb4e62] text-xs font-bold text-[#1b1b1f] transition"
                  >
                    Back to home
                  </Link>
                  <Link
                    href="/admin/enquiries"
                    className="px-4 py-2 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-xs font-bold text-white transition shadow-xs"
                  >
                    Send custom request
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 6. Global Public Footer */}
      <Footer />
    </div>
  );
}
