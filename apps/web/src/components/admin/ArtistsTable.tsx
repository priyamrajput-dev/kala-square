'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { fetchAdminArtists } from '@/lib/api';
import { parseFollowerCount, formatFollowers } from '@/lib/followers';

export interface ArtistItem {
  id: string;
  name: string;
  slug: string;
  cat: string;
  city: string;
  tier: 'platinum' | 'emerging' | 'rising' | 'standard';
  docs: boolean;
  fol: number;
  status: 'live' | 'pending' | 'draft';
  booked: number;
  trend: number;
  joined: string;
  photoUrl?: string;
}

// 26 Default artists ordered to match manager.html and media_1794562500635_0c9c86e2.jpg exactly
export const DEFAULT_26_ARTISTS: ArtistItem[] = [
  { id: 'a8', name: 'Ria Bally', slug: 'ria-bally', cat: 'Singer', city: 'Mumbai', tier: 'rising', docs: true, fol: 64000, status: 'live', booked: 85, trend: 72, joined: '2026-09-24' },
  { id: 'a17', name: 'Neha Arora', slug: 'neha-arora', cat: 'Dancer', city: 'Mumbai', tier: 'emerging', docs: true, fol: 61000, status: 'live', booked: 62, trend: 65, joined: '2026-09-22' },
  { id: 'a26', name: 'Rishabh Jain', slug: 'rishabh-jain', cat: 'Gaming', city: 'Haryana', tier: 'standard', docs: false, fol: 31000, status: 'live', booked: 40, trend: 50, joined: '2026-09-15' },
  { id: 'a15', name: 'Sahil Badal', slug: 'sahil-badal', cat: 'Singer', city: 'Haryana', tier: 'platinum', docs: true, fol: 50000, status: 'live', booked: 95, trend: 88, joined: '2026-09-10' },
  { id: 'a24', name: 'Manish Tiwari', slug: 'manish-tiwari', cat: 'Speaker', city: 'Lucknow', tier: 'standard', docs: false, fol: 6000, status: 'live', booked: 25, trend: 30, joined: '2026-09-08' },
  { id: 'a6', name: 'Kabir Anand', slug: 'kabir-anand', cat: 'Fitness', city: 'Mumbai', tier: 'platinum', docs: true, fol: 520000, status: 'live', booked: 90, trend: 85, joined: '2026-09-05' },
  { id: 'a22', name: 'Rahul Dubey', slug: 'rahul-dubey', cat: 'Writer', city: 'Varanasi', tier: 'standard', docs: false, fol: 4000, status: 'live', booked: 20, trend: 22, joined: '2026-09-01' },
  { id: 'a4', name: 'Dr. Mansi Dwivedi', slug: 'dr-mansi-dwivedi', cat: 'Poets', city: 'Lucknow', tier: 'platinum', docs: true, fol: 96000, status: 'live', booked: 75, trend: 68, joined: '2026-08-25' },
  { id: 'a13', name: 'Sana Qureshi', slug: 'sana-qureshi', cat: 'Dancer', city: 'Delhi', tier: 'rising', docs: false, fol: 45000, status: 'pending', booked: 45, trend: 48, joined: '2026-08-22' },
  { id: 'a11', name: 'Tanya Bose', slug: 'tanya-bose', cat: 'Anchors', city: 'Bangalore', tier: 'rising', docs: true, fol: 29000, status: 'live', booked: 55, trend: 52, joined: '2026-08-20' },
  { id: 'a1', name: 'Jai Vijay Sachan', slug: 'jai-vijay-sachan', cat: 'Actor', city: 'Delhi', tier: 'platinum', docs: true, fol: 1800000, status: 'live', booked: 98, trend: 94, joined: '2026-08-18' },
  { id: 'a2', name: 'Vijay Vikram Singh', slug: 'vijay-vikram-singh', cat: 'Actor', city: 'Delhi', tier: 'platinum', docs: true, fol: 420000, status: 'live', booked: 92, trend: 89, joined: '2026-08-15' },
  { id: 'a3', name: 'Dinesh Bawra', slug: 'dinesh-bawra', cat: 'Poets', city: 'Delhi', tier: 'platinum', docs: true, fol: 210000, status: 'live', booked: 80, trend: 74, joined: '2026-08-10' },
  { id: 'a5', name: 'Ajay Hooda', slug: 'ajay-hooda', cat: 'Singer', city: 'Haryana', tier: 'platinum', docs: true, fol: 340000, status: 'live', booked: 88, trend: 82, joined: '2026-08-05' },
  { id: 'a7', name: 'Rohan Kapoor', slug: 'rohan-kapoor', cat: 'Influencer', city: 'Delhi', tier: 'platinum', docs: true, fol: 1200000, status: 'live', booked: 91, trend: 86, joined: '2026-08-01' },
  { id: 'a9', name: 'Khushboo Choubey', slug: 'khushboo-choubey', cat: 'Singer', city: 'Varanasi', tier: 'rising', docs: true, fol: 38000, status: 'live', booked: 60, trend: 58, joined: '2026-07-25' },
  { id: 'a10', name: 'Aarav Mehta', slug: 'aarav-mehta', cat: 'Standup Comedy', city: 'Delhi', tier: 'rising', docs: true, fol: 72000, status: 'live', booked: 70, trend: 75, joined: '2026-07-20' },
  { id: 'a12', name: 'Ishaan Rao', slug: 'ishaan-rao', cat: 'Gaming', city: 'Bangalore', tier: 'emerging', docs: true, fol: 110000, status: 'live', booked: 68, trend: 64, joined: '2026-07-10' },
  { id: 'a14', name: 'Meher Sethi', slug: 'meher-sethi', cat: 'Food Vloggers', city: 'Delhi', tier: 'emerging', docs: false, fol: 87000, status: 'pending', booked: 52, trend: 55, joined: '2026-07-01' },
  { id: 'a16', name: 'Keshav Nagar', slug: 'keshav-nagar', cat: 'Singer', city: 'Delhi', tier: 'emerging', docs: true, fol: 22000, status: 'live', booked: 48, trend: 44, joined: '2026-06-25' },
  { id: 'a18', name: 'Kunal Verma', slug: 'kunal-verma', cat: 'Actor', city: 'Mumbai', tier: 'standard', docs: false, fol: 8000, status: 'live', booked: 32, trend: 35, joined: '2026-06-20' },
  { id: 'a19', name: 'Pooja Rathi', slug: 'pooja-rathi', cat: 'Anchors', city: 'Delhi', tier: 'standard', docs: false, fol: 12000, status: 'pending', booked: 36, trend: 38, joined: '2026-06-15' },
  { id: 'a20', name: 'Arjun Menon', slug: 'arjun-menon', cat: 'Fitness', city: 'Bangalore', tier: 'emerging', docs: true, fol: 93000, status: 'live', booked: 58, trend: 62, joined: '2026-06-10' },
  { id: 'a21', name: 'Simran Kaur', slug: 'simran-kaur', cat: 'Influencer', city: 'Delhi', tier: 'standard', docs: false, fol: 15000, status: 'draft', booked: 28, trend: 31, joined: '2026-06-05' },
  { id: 'a23', name: 'Zoya Ansari', slug: 'zoya-ansari', cat: 'Singer', city: 'Lucknow', tier: 'emerging', docs: true, fol: 27000, status: 'live', booked: 50, trend: 49, joined: '2026-06-01' },
  { id: 'a25', name: 'Isha Malhotra', slug: 'isha-malhotra', cat: 'Standup Comedy', city: 'Mumbai', tier: 'standard', docs: false, fol: 18000, status: 'draft', booked: 34, trend: 37, joined: '2026-05-25' },
];

const CITIES = ['All cities', 'Bangalore', 'Delhi', 'Haryana', 'Lucknow', 'Mumbai', 'Varanasi'];
const CATEGORIES = [
  'All categories',
  'Actor',
  'Anchors',
  'Dancer',
  'Fitness',
  'Food Vloggers',
  'Gaming',
  'Influencer',
  'Models',
  'Poets',
  'Singer',
  'Speaker',
  'Standup Comedy',
  'Writer',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'booked', label: 'Most booked' },
  { value: 'trend', label: 'Trending' },
  { value: 'name', label: 'Name A to Z' },
];

const PAGE_SIZE = 10;

function getInitialLetter(name: string): string {
  return name.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();
}

export default function ArtistsTable() {
  const [artists, setArtists] = useState<ArtistItem[]>(DEFAULT_26_ARTISTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All cities');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeClassTab, setActiveClassTab] = useState<'all' | 'platinum' | 'emerging' | 'rising' | 'standard'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Load artists from API or localStorage overrides on mount
  useEffect(() => {
    const load = async () => {
      let baseList = [...DEFAULT_26_ARTISTS];
      try {
        const res = await fetchAdminArtists();
        if (res && res.data && res.data.length >= 20) {
          baseList = res.data.map((item: any, i: number) => ({
            id: item.id || `a${i + 1}`,
            name: item.name,
            slug: item.slug,
            cat: Array.isArray(item.categories) && item.categories.length > 0 ? item.categories[0] : (item.category || 'Singer'),
            city: item.city || 'Delhi',
            tier: item.artistClass || 'standard',
            docs: Boolean(item.isVerified || item.docsVerified),
            fol: item.followers || (item.totalFollowersLabel ? parseFollowerCount(item.totalFollowersLabel, item) : 0),
            status: item.status === 'live' || item.status === 'published' ? 'live' : item.status === 'pending' ? 'pending' : 'draft',
            booked: 50 + i * 2,
            trend: 60 + i,
            joined: (item.updatedAt || '2026-08-01').split('T')[0],
            photoUrl: item.profilePhotoUrl || item.photoUrl,
          }));
        }
      } catch {}

      // Merge local storage artists and overrides
      if (typeof window !== 'undefined') {
        try {
          const localRaw = localStorage.getItem('kalasquare_admin_artists');
          if (localRaw) {
            const localArtists: any[] = JSON.parse(localRaw);
            const existingIds = new Set(baseList.map((a) => a.id));
            const existingSlugs = new Set(baseList.map((a) => a.slug));
            const mappedLocal: ArtistItem[] = [];

            for (const item of localArtists) {
              if (!existingIds.has(item.id) && !existingSlugs.has(item.slug)) {
                mappedLocal.push({
                  id: item.id,
                  name: item.name,
                  slug: item.slug,
                  cat: Array.isArray(item.categories) && item.categories.length > 0 ? item.categories[0] : (item.category || 'Singer'),
                  city: item.city || 'Delhi',
                  tier: item.artistClass || 'standard',
                  docs: Boolean(item.isVerified),
                  fol: parseFollowerCount(item.totalFollowersLabel, item),
                  status: item.status === 'published' || item.status === 'live' ? 'live' : item.status === 'pending' ? 'pending' : 'draft',
                  booked: 80,
                  trend: 85,
                  joined: (item.updatedAt || new Date().toISOString()).split('T')[0],
                  photoUrl: item.photoUrl || item.profilePhotoUrl,
                });
              } else {
                baseList = baseList.map((a) => {
                  if (a.id === item.id || a.slug === item.slug) {
                    return {
                      ...a,
                      id: item.id || a.id,
                      name: item.name || a.name,
                      slug: item.slug || a.slug,
                      cat: Array.isArray(item.categories) && item.categories.length > 0 ? item.categories[0] : a.cat,
                      city: item.city || a.city,
                      tier: item.artistClass || a.tier,
                      docs: item.isVerified !== undefined ? Boolean(item.isVerified) : a.docs,
                      fol: parseFollowerCount(item.totalFollowersLabel, item),
                      status: item.status === 'published' || item.status === 'live' ? 'live' : item.status === 'pending' ? 'pending' : 'draft',
                      photoUrl: item.photoUrl || item.profilePhotoUrl || a.photoUrl,
                    };
                  }
                  return a;
                });
              }
            }
            baseList = [...mappedLocal, ...baseList];
          }

          const savedOverrides = localStorage.getItem('kalasquare_artist_classes');
          if (savedOverrides) {
            const parsed = JSON.parse(savedOverrides);
            baseList = baseList.map((a) => {
              if (parsed[a.id]?.tier) {
                return {
                  ...a,
                  tier: parsed[a.id].tier || a.tier,
                };
              }
              return a;
            });
          }
        } catch {}
      }

      setArtists(baseList);
    };

    load();
  }, []);

  // Filter and sort artists
  const filteredArtists = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return artists.filter((a) => {
      // 1. Search Query
      if (q && !(a.name.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q) || a.city.toLowerCase().includes(q))) {
        return false;
      }
      // 2. City
      if (selectedCity !== 'All cities' && a.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      // 3. Category
      if (selectedCategory !== 'All categories' && a.cat.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // 4. Verified Only
      if (verifiedOnly && !a.docs) {
        return false;
      }
      // 5. Class Tab
      if (activeClassTab !== 'all' && a.tier !== activeClassTab) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'newest') {
        return b.joined.localeCompare(a.joined);
      }
      if (selectedSort === 'booked') {
        return b.booked - a.booked;
      }
      if (selectedSort === 'trend') {
        return b.trend - a.trend;
      }
      if (selectedSort === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [artists, searchQuery, selectedCity, selectedCategory, verifiedOnly, activeClassTab, selectedSort]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, selectedCategory, verifiedOnly, activeClassTab, selectedSort]);

  // Tab counts
  const countAll = artists.length;
  const countPlatinum = artists.filter((a) => a.tier === 'platinum').length;
  const countEmerging = artists.filter((a) => a.tier === 'emerging').length;
  const countRising = artists.filter((a) => a.tier === 'rising').length;
  const countStandard = artists.filter((a) => a.tier === 'standard').length;

  // Pagination calculation
  const totalItems = filteredArtists.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const paginatedArtists = filteredArtists.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 pb-12 font-sans text-[#1b1b1f]">
      {/* 1. Page Header matching manager.html */}
      <div>
        <h1 className="font-heading font-black text-[28px] text-[#1b1b1f] tracking-tight leading-tight">
          View all artists
        </h1>
        <p className="text-[13.5px] text-[#6b6b76] mt-0.5">
          Every artist on the platform. Filter by city or category, sort the list and open a profile to edit it.
        </p>
      </div>

      {/* 2. Main Card Container with exact styles from manager.html */}
      <div className="bg-white rounded-2xl border border-[#e6e6ea] shadow-[0_1px_2px_rgba(27,27,31,.04),0_14px_30px_-20px_rgba(27,27,31,.28)] p-6 sm:p-7 space-y-5">
        {/* Card Header with "+ Add artist" button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-[18px] text-[#1b1b1f]">
              Artists
            </h2>
            <p className="text-[13px] text-[#6b6b76] mt-0.5">
              Same filters as the Top Creators page on the website.
            </p>
          </div>
          <Link
            href="/admin/artists/new"
            className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-[#d63a50] hover:bg-[#c23048] text-white font-bold text-[12.5px] shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add artist</span>
          </Link>
        </div>

        {/* Filters Row matching manager.html .fl */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3.5 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#6b6b76] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, category or city"
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#e6e6ea] bg-[#f6f6f7] text-[13px] font-medium text-[#1b1b1f] outline-none focus:border-[#eb4e62] focus:bg-white transition"
            />
          </div>

          {/* City Dropdown */}
          <div className="w-full lg:w-44 space-y-1">
            <label className="block text-[13px] font-semibold text-[#1b1b1f]">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#e6e6ea] bg-[#f6f6f7] text-[13px] font-medium text-[#1b1b1f] outline-none focus:border-[#eb4e62] focus:bg-white cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="w-full lg:w-48 space-y-1">
            <label className="block text-[13px] font-semibold text-[#1b1b1f]">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#e6e6ea] bg-[#f6f6f7] text-[13px] font-medium text-[#1b1b1f] outline-none focus:border-[#eb4e62] focus:bg-white cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full lg:w-44 space-y-1">
            <label className="block text-[13px] font-semibold text-[#1b1b1f]">Sort by</label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#e6e6ea] bg-[#f6f6f7] text-[13px] font-medium text-[#1b1b1f] outline-none focus:border-[#eb4e62] focus:bg-white cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Verified Only Checkbox */}
          <div className="flex items-center pb-2.5 lg:pl-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[13px] font-semibold text-[#1b1b1f]">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-[#e6e6ea] text-[#eb4e62] focus:ring-[#eb4e62] cursor-pointer"
              />
              <span>Verified only</span>
            </label>
          </div>
        </div>

        {/* Class Filter Tabs (.ctabs in manager.html) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
          <button
            type="button"
            onClick={() => setActiveClassTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeClassTab === 'all'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>All</span>
            <span className="text-[11.5px] opacity-85">{countAll}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveClassTab('platinum')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeClassTab === 'platinum'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>Platinum</span>
            <span className="text-[11.5px] opacity-85">{countPlatinum}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveClassTab('emerging')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeClassTab === 'emerging'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>Emerging</span>
            <span className="text-[11.5px] opacity-85">{countEmerging}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveClassTab('rising')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeClassTab === 'rising'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>Rising</span>
            <span className="text-[11.5px] opacity-85">{countRising}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveClassTab('standard')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeClassTab === 'standard'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>Standard</span>
            <span className="text-[11.5px] opacity-85">{countStandard}</span>
          </button>
        </div>

        {/* 3. Artists Table matching manager.html */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead className="border-b border-[#e6e6ea] text-[#6b6b76] font-bold text-[12px]">
              <tr>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">Artist</th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">Category</th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">City</th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">Class</th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">Badge</th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">Followers</th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">Status</th>
                <th className="py-2.5 text-right font-bold text-[#6b6b76]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e6ea]">
              {paginatedArtists.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#6b6b76]">
                    <b className="block text-[15px] font-heading font-bold text-[#1b1b1f] mb-1">No artists match</b>
                    <span>Change the city, category or search query.</span>
                  </td>
                </tr>
              ) : (
                paginatedArtists.map((a) => (
                  <tr key={a.id} className="hover:bg-[#fafafc] transition">
                    {/* Artist letter avatar & Name */}
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#f58a9a] to-[#eb4e62] text-white font-heading font-extrabold text-[15px] flex items-center justify-center shrink-0 shadow-xs">
                          {getInitialLetter(a.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[13.5px] text-[#1b1b1f] leading-snug">
                            {a.name}
                          </span>
                          <span className="text-[12px] text-[#6b6b76]">
                            /top-creators/{a.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 pr-3 text-[13px] text-[#1b1b1f]">
                      {a.cat}
                    </td>

                    {/* City */}
                    <td className="py-3 pr-3 text-[13px] text-[#1b1b1f]">
                      {a.city}
                    </td>

                    {/* Class Tag (.tg in manager.html) */}
                    <td className="py-3 pr-3">
                      {a.tier === 'rising' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e1f5ea] text-[#1a8a57]">
                          Rising
                        </span>
                      ) : a.tier === 'emerging' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e1effd] text-[#1469c4]">
                          Emerging
                        </span>
                      ) : a.tier === 'platinum' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#fbefc7] text-[#8a6508]">
                          Platinum
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f6f6f7] text-[#6b6b76]">
                          Standard
                        </span>
                      )}
                    </td>

                    {/* Badge */}
                    <td className="py-3 pr-3">
                      {a.tier === 'platinum' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fbefc7] text-[#8a6508]">
                          Golden badge
                        </span>
                      ) : a.docs ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e1effd] text-[#1469c4]">
                          ✓ Blue tick
                        </span>
                      ) : (
                        <span className="text-[12px] text-[#6b6b76] font-normal">
                          No badge
                        </span>
                      )}
                    </td>

                    {/* Followers */}
                    <td className="py-3 pr-3 font-semibold text-[13px] text-[#1b1b1f] tabular-nums">
                      {formatFollowers(a.fol)}
                    </td>

                    {/* Status (.statTag in manager.html) */}
                    <td className="py-3 pr-3">
                      {a.status === 'live' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e1f5ea] text-[#1a8a57]">
                          Live
                        </span>
                      ) : a.status === 'pending' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#fff1cf] text-[#8f5a00]">
                          Pending review
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#f6f6f7] text-[#6b6b76]">
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Actions: Edit + View on site */}
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/artists/new?edit=${a.id}`}
                          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-[#e6e6ea] bg-white hover:border-[#eb4e62] hover:text-[#eb4e62] text-[12px] font-semibold text-[#1b1b1f] transition shadow-2xs"
                        >
                          <Edit className="w-3 h-3 text-[#6b6b76]" />
                          <span>Edit</span>
                        </Link>
                        <Link
                          href={`/top-creators/${a.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg border border-[#e6e6ea] bg-white hover:border-[#eb4e62] hover:text-[#eb4e62] text-[#6b6b76] inline-flex items-center justify-center transition shadow-2xs"
                          title={`View ${a.name} on the site`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Page Change Option / Pagination (.pager in manager.html and media_1794562500635_0c9c86e2.jpg) */}
        <div className="flex items-center justify-between pt-4 border-t border-[#e6e6ea] text-[13px] text-[#6b6b76]">
          <span className="font-medium">
            Showing {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} of {totalItems}
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === currentPageSafe;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                      isActive
                        ? 'bg-[#d63a50] text-white shadow-xs'
                        : 'bg-white hover:bg-[#f6f6f7] text-[#1b1b1f] border border-[#e6e6ea]'
                    }`}
                    aria-label={`Go to page ${p}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
