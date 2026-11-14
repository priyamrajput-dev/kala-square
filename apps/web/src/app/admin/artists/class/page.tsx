'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, AlertCircle, Check } from 'lucide-react';
import { fetchAdminArtists, updateArtist } from '@/lib/api';
import { parseFollowerCount } from '@/lib/followers';

export interface ClassArtistItem {
  id: string;
  name: string;
  slug: string;
  cat: string;
  city: string;
  tier: 'platinum' | 'emerging' | 'rising' | 'standard';
  docs: boolean;
  about: boolean;
  fol: number;
}

// 26 Default artists exactly matching manager.html and media_1794562812298_b59a8ebe.jpg & media_1794562846417_20a110ad.jpg
const DEFAULT_CLASS_ARTISTS: ClassArtistItem[] = [
  { id: 'a1', name: 'Jai Vijay Sachan', slug: 'jai-vijay-sachan', cat: 'Actor', city: 'Delhi', tier: 'platinum', docs: true, about: true, fol: 1800000 },
  { id: 'a2', name: 'Vijay Vikram Singh', slug: 'vijay-vikram-singh', cat: 'Actor', city: 'Mumbai', tier: 'platinum', docs: true, about: false, fol: 420000 },
  { id: 'a3', name: 'Dinesh Bawra', slug: 'dinesh-bawra', cat: 'Poets', city: 'Delhi', tier: 'platinum', docs: true, about: false, fol: 210000 },
  { id: 'a4', name: 'Dr. Mansi Dwivedi', slug: 'dr-mansi-dwivedi', cat: 'Poets', city: 'Lucknow', tier: 'platinum', docs: true, about: false, fol: 96000 },
  { id: 'a5', name: 'Ajay Hooda', slug: 'ajay-hooda', cat: 'Singer', city: 'Haryana', tier: 'platinum', docs: true, about: false, fol: 340000 },
  { id: 'a6', name: 'Kabir Anand', slug: 'kabir-anand', cat: 'Fitness', city: 'Mumbai', tier: 'platinum', docs: true, about: false, fol: 520000 },
  { id: 'a7', name: 'Rohan Kapoor', slug: 'rohan-kapoor', cat: 'Influencer', city: 'Delhi', tier: 'platinum', docs: true, about: false, fol: 1200000 },
  { id: 'a8', name: 'Ria Bally', slug: 'ria-bally', cat: 'Singer', city: 'Mumbai', tier: 'rising', docs: true, about: false, fol: 64000 },
  { id: 'a9', name: 'Khushboo Choubey', slug: 'khushboo-choubey', cat: 'Singer', city: 'Varanasi', tier: 'rising', docs: true, about: false, fol: 38000 },
  { id: 'a10', name: 'Aarav Mehta', slug: 'aarav-mehta', cat: 'Standup Comedy', city: 'Delhi', tier: 'rising', docs: true, about: false, fol: 72000 },
  { id: 'a11', name: 'Tanya Bose', slug: 'tanya-bose', cat: 'Anchors', city: 'Bangalore', tier: 'rising', docs: true, about: false, fol: 29000 },
  { id: 'a12', name: 'Ishaan Rao', slug: 'ishaan-rao', cat: 'Gaming', city: 'Bangalore', tier: 'emerging', docs: true, about: false, fol: 110000 },
  { id: 'a13', name: 'Sana Qureshi', slug: 'sana-qureshi', cat: 'Dancer', city: 'Delhi', tier: 'rising', docs: false, about: false, fol: 45000 },
  { id: 'a14', name: 'Meher Sethi', slug: 'meher-sethi', cat: 'Food Vloggers', city: 'Delhi', tier: 'emerging', docs: false, about: false, fol: 87000 },
  { id: 'a15', name: 'Sahil Badal', slug: 'sahil-badal', cat: 'Singer', city: 'Haryana', tier: 'platinum', docs: true, about: true, fol: 50000 },
  { id: 'a16', name: 'Keshav Nagar', slug: 'keshav-nagar', cat: 'Singer', city: 'Delhi', tier: 'emerging', docs: true, about: false, fol: 22000 },
  { id: 'a17', name: 'Neha Arora', slug: 'neha-arora', cat: 'Dancer', city: 'Mumbai', tier: 'emerging', docs: true, about: false, fol: 61000 },
  { id: 'a18', name: 'Kunal Verma', slug: 'kunal-verma', cat: 'Actor', city: 'Mumbai', tier: 'standard', docs: false, about: false, fol: 8000 },
  { id: 'a19', name: 'Pooja Rathi', slug: 'pooja-rathi', cat: 'Anchors', city: 'Delhi', tier: 'standard', docs: false, about: false, fol: 12000 },
  { id: 'a20', name: 'Arjun Menon', slug: 'arjun-menon', cat: 'Fitness', city: 'Bangalore', tier: 'emerging', docs: true, about: false, fol: 93000 },
  { id: 'a21', name: 'Simran Kaur', slug: 'simran-kaur', cat: 'Influencer', city: 'Delhi', tier: 'standard', docs: false, about: false, fol: 15000 },
  { id: 'a22', name: 'Rahul Dubey', slug: 'rahul-dubey', cat: 'Writer', city: 'Varanasi', tier: 'standard', docs: false, about: false, fol: 4000 },
  { id: 'a23', name: 'Zoya Ansari', slug: 'zoya-ansari', cat: 'Singer', city: 'Lucknow', tier: 'emerging', docs: true, about: false, fol: 27000 },
  { id: 'a24', name: 'Manish Tiwari', slug: 'manish-tiwari', cat: 'Speaker', city: 'Lucknow', tier: 'standard', docs: false, about: false, fol: 6000 },
  { id: 'a25', name: 'Isha Malhotra', slug: 'isha-malhotra', cat: 'Standup Comedy', city: 'Mumbai', tier: 'standard', docs: false, about: false, fol: 18000 },
  { id: 'a26', name: 'Rishabh Jain', slug: 'rishabh-jain', cat: 'Gaming', city: 'Haryana', tier: 'standard', docs: false, about: false, fol: 31000 },
];

const CLASSES = [
  {
    id: 'platinum' as const,
    name: 'Platinum',
    badge: 'Golden badge',
    rule: 'Top, well-established artists. Shown in the Platinum row and listed first.',
  },
  {
    id: 'emerging' as const,
    name: 'Emerging',
    badge: 'Blue tick',
    rule: 'Average artists with a verified profile. Shown in the Emerging group.',
  },
  {
    id: 'rising' as const,
    name: 'Rising',
    badge: 'Blue tick',
    rule: 'Growing artists with verified documents. Can appear in the home page Rising row.',
  },
  {
    id: 'standard' as const,
    name: 'Standard',
    badge: 'No badge',
    rule: 'Basic listing. No badge until the profile is verified.',
  },
];

const ABOUT_MAX = 6;

function getInitialLetter(name: string): string {
  return name.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();
}

export default function ArtistClassPage() {
  const [artists, setArtists] = useState<ClassArtistItem[]>(DEFAULT_CLASS_ARTISTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'platinum' | 'emerging' | 'rising' | 'standard'>('all');
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [bulkTargetClass, setBulkTargetClass] = useState<'platinum' | 'emerging' | 'rising' | 'standard'>('rising');
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load from localStorage or API
  useEffect(() => {
    const load = async () => {
      let baseList = [...DEFAULT_CLASS_ARTISTS];
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
            about: Boolean(item.isExclusive || item.showInAboutExclusive || i === 0 || i === 14),
            fol: item.followers || (item.totalFollowersLabel ? parseFollowerCount(item.totalFollowersLabel, item) : 0),
          }));
        }
      } catch {}

      if (typeof window !== 'undefined') {
        try {
          const localRaw = localStorage.getItem('kalasquare_admin_artists');
          if (localRaw) {
            const localArtists: any[] = JSON.parse(localRaw);
            const existingIds = new Set(baseList.map((a) => a.id));
            const existingSlugs = new Set(baseList.map((a) => a.slug));
            const mappedLocal: ClassArtistItem[] = [];

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
                  about: Boolean(item.showInAboutUs || item.isFeatured),
                  fol: parseFollowerCount(item.totalFollowersLabel, item),
                });
              } else {
                baseList = baseList.map((a) => {
                  if (a.id === item.id || a.slug === item.slug) {
                    return {
                      ...a,
                      name: item.name || a.name,
                      cat: Array.isArray(item.categories) && item.categories.length > 0 ? item.categories[0] : a.cat,
                      city: item.city || a.city,
                      tier: item.artistClass || a.tier,
                      docs: item.isVerified !== undefined ? Boolean(item.isVerified) : a.docs,
                      about: item.showInAboutUs !== undefined ? Boolean(item.showInAboutUs) : a.about,
                    };
                  }
                  return a;
                });
              }
            }
            baseList = [...mappedLocal, ...baseList];
          }

          const saved = localStorage.getItem('kalasquare_artist_classes');
          if (saved) {
            const parsed = JSON.parse(saved);
            baseList = baseList.map((a) => {
              if (parsed[a.id]) {
                return {
                  ...a,
                  tier: parsed[a.id].tier || a.tier,
                  about: parsed[a.id].about !== undefined ? parsed[a.id].about : a.about,
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

  const persistArtist = (updated: ClassArtistItem[]) => {
    setArtists(updated);
    if (typeof window !== 'undefined') {
      const map: Record<string, { tier: string; about: boolean }> = {};
      updated.forEach((a) => {
        map[a.id] = { tier: a.tier, about: a.about };
      });
      localStorage.setItem('kalasquare_artist_classes', JSON.stringify(map));

      // Also keep kalasquare_admin_artists updated
      try {
        const localRaw = localStorage.getItem('kalasquare_admin_artists');
        if (localRaw) {
          const list: any[] = JSON.parse(localRaw);
          const nextList = list.map((item) => {
            if (map[item.id]) {
              return {
                ...item,
                artistClass: map[item.id].tier,
                showInAboutUs: map[item.id].about,
              };
            }
            return item;
          });
          localStorage.setItem('kalasquare_admin_artists', JSON.stringify(nextList));
        }
      } catch {}
    }
  };

  const handleSetClass = async (id: string, newTier: 'platinum' | 'emerging' | 'rising' | 'standard') => {
    const target = artists.find((a) => a.id === id);
    if (!target) return;

    if (newTier === 'rising' && !target.docs) {
      showToast(`${target.name} needs verified documents before moving to Rising.`, true);
      return;
    }
    if (newTier === 'platinum' && !target.docs) {
      showToast(`${target.name} needs verified documents (blue tick) before Platinum.`, true);
      return;
    }

    const updated = artists.map((a) => (a.id === id ? { ...a, tier: newTier } : a));
    persistArtist(updated);

    try {
      await updateArtist(id, { artistClass: newTier });
    } catch {}

    const clsName = CLASSES.find((c) => c.id === newTier)?.name || newTier;
    showToast(`${target.name} moved to ${clsName}.`);
  };

  const handleToggleAbout = (id: string) => {
    const target = artists.find((a) => a.id === id);
    if (!target) return;

    const currentAboutCount = artists.filter((a) => a.about).length;
    if (!target.about && currentAboutCount >= ABOUT_MAX) {
      showToast(`About us exclusive section is full (max ${ABOUT_MAX}). Remove one first.`, true);
      return;
    }

    const nextVal = !target.about;
    const updated = artists.map((a) => (a.id === id ? { ...a, about: nextVal } : a));
    persistArtist(updated);

    showToast(
      nextVal
        ? `${target.name} added to About us exclusive.`
        : `${target.name} removed from About us exclusive.`
    );
  };

  // Bulk selection
  const selectedCount = Object.keys(selectedIds).filter((k) => selectedIds[k]).length;

  const handleSelectAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    if (checked) {
      filteredArtists.forEach((a) => {
        next[a.id] = true;
      });
    }
    setSelectedIds(next);
  };

  const handleBulkApply = () => {
    const idsToUpdate = Object.keys(selectedIds).filter((k) => selectedIds[k]);
    if (idsToUpdate.length === 0) return;

    let blockedCount = 0;
    const updated = artists.map((a) => {
      if (idsToUpdate.includes(a.id)) {
        if ((bulkTargetClass === 'rising' || bulkTargetClass === 'platinum') && !a.docs) {
          blockedCount++;
          return a;
        }
        return { ...a, tier: bulkTargetClass };
      }
      return a;
    });

    persistArtist(updated);
    setSelectedIds({});

    const clsName = CLASSES.find((c) => c.id === bulkTargetClass)?.name || bulkTargetClass;
    if (blockedCount > 0) {
      showToast(
        `Updated eligible artists to ${clsName}. ${blockedCount} artists skipped (require verified documents).`,
        true
      );
    } else {
      showToast(`${idsToUpdate.length} artists moved to ${clsName}.`);
    }
  };

  const handleBulkClear = () => {
    setSelectedIds({});
  };

  // Filter artists
  const filteredArtists = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return artists.filter((a) => {
      const matchesTab = activeTab === 'all' || a.tier === activeTab;
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.cat.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [artists, searchQuery, activeTab]);

  const aboutExclusiveCount = artists.filter((a) => a.about).length;

  // Counts
  const countAll = artists.length;
  const countPlatinum = artists.filter((a) => a.tier === 'platinum').length;
  const countEmerging = artists.filter((a) => a.tier === 'emerging').length;
  const countRising = artists.filter((a) => a.tier === 'rising').length;
  const countStandard = artists.filter((a) => a.tier === 'standard').length;

  return (
    <div className="space-y-6 pb-12 font-sans text-[#1b1b1f]">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 transition-all ${
            toastMessage.isError
              ? 'bg-[#d63a50] text-white border-red-600'
              : 'bg-[#1b1b1f] text-white border-black/10'
          }`}
        >
          {toastMessage.isError ? (
            <AlertCircle className="w-4 h-4 text-white" />
          ) : (
            <Check className="w-4 h-4 text-[#eb4e62]" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Page Header matching manager.html */}
      <div className="space-y-2">
        <h1 className="font-heading font-black text-[28px] text-[#1b1b1f] tracking-tight leading-tight">
          Artist class
        </h1>
        <p className="text-[13.5px] text-[#6b6b76]">
          Decide which class each artist belongs to, and who appears in the exclusive section on the About us page.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fde6ea] text-[#d63a50]">
            Class sets the badge
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fde6ea] text-[#d63a50]">
            About us exclusive
          </span>
        </div>
      </div>

      {/* 2. Four Class Summary Cards matching manager.html classCards() */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Platinum */}
        <div className="bg-white rounded-2xl p-5 border border-[#e6e6ea] shadow-[0_1px_2px_rgba(27,27,31,.04),0_14px_30px_-20px_rgba(27,27,31,.28)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#fbefc7] text-[#8a6508]">
              Platinum
            </span>
            <b className="font-heading font-black text-[22px] text-[#1b1b1f]">{countPlatinum}</b>
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-[16px] text-[#1b1b1f] mb-1">Platinum</h3>
            <p className="text-[12px] text-[#6b6b76] leading-relaxed">
              Top, well-established artists. Shown in the Platinum row and listed first.
            </p>
          </div>
          <div className="pt-2.5 border-t border-[#f0f0f4] flex items-center justify-between text-xs">
            <span className="text-[#6b6b76] font-medium">Badge</span>
            <b className="text-[#1b1b1f] font-bold">Golden badge</b>
          </div>
        </div>

        {/* Card 2: Emerging */}
        <div className="bg-white rounded-2xl p-5 border border-[#e6e6ea] shadow-[0_1px_2px_rgba(27,27,31,.04),0_14px_30px_-20px_rgba(27,27,31,.28)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#e1effd] text-[#1469c4]">
              Emerging
            </span>
            <b className="font-heading font-black text-[22px] text-[#1b1b1f]">{countEmerging}</b>
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-[16px] text-[#1b1b1f] mb-1">Emerging</h3>
            <p className="text-[12px] text-[#6b6b76] leading-relaxed">
              Average artists with a verified profile. Shown in the Emerging group.
            </p>
          </div>
          <div className="pt-2.5 border-t border-[#f0f0f4] flex items-center justify-between text-xs">
            <span className="text-[#6b6b76] font-medium">Badge</span>
            <b className="text-[#1b1b1f] font-bold">Blue tick</b>
          </div>
        </div>

        {/* Card 3: Rising */}
        <div className="bg-white rounded-2xl p-5 border border-[#e6e6ea] shadow-[0_1px_2px_rgba(27,27,31,.04),0_14px_30px_-20px_rgba(27,27,31,.28)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#e1f5ea] text-[#1a8a57]">
              Rising
            </span>
            <b className="font-heading font-black text-[22px] text-[#1b1b1f]">{countRising}</b>
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-[16px] text-[#1b1b1f] mb-1">Rising</h3>
            <p className="text-[12px] text-[#6b6b76] leading-relaxed">
              Growing artists with verified documents. Can appear in the home page Rising row.
            </p>
          </div>
          <div className="pt-2.5 border-t border-[#f0f0f4] flex items-center justify-between text-xs">
            <span className="text-[#6b6b76] font-medium">Badge</span>
            <b className="text-[#1b1b1f] font-bold">Blue tick</b>
          </div>
        </div>

        {/* Card 4: Standard */}
        <div className="bg-white rounded-2xl p-5 border border-[#e6e6ea] shadow-[0_1px_2px_rgba(27,27,31,.04),0_14px_30px_-20px_rgba(27,27,31,.28)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f6f6f7] text-[#6b6b76] border border-[#e6e6ea]">
              Standard
            </span>
            <b className="font-heading font-black text-[22px] text-[#1b1b1f]">{countStandard}</b>
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-[16px] text-[#1b1b1f] mb-1">Standard</h3>
            <p className="text-[12px] text-[#6b6b76] leading-relaxed">
              Basic listing. No badge until the profile is verified.
            </p>
          </div>
          <div className="pt-2.5 border-t border-[#f0f0f4] flex items-center justify-between text-xs">
            <span className="text-[#6b6b76] font-medium">Badge</span>
            <b className="text-[#1b1b1f] font-bold">No badge</b>
          </div>
        </div>
      </div>

      {/* 3. Main Card with Search, Subheader, Tabs & Class Table */}
      <div className="bg-white rounded-2xl border border-[#e6e6ea] shadow-[0_1px_2px_rgba(27,27,31,.04),0_14px_30px_-20px_rgba(27,27,31,.28)] p-6 sm:p-7 space-y-4">
        {/* Full-width Search Input inside the card */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#6b6b76] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search an artist to change class"
            className="w-full h-11 pl-9 pr-4 rounded-xl border border-[#e6e6ea] bg-[#f6f6f7] text-[13px] text-[#1b1b1f] outline-none focus:border-[#eb4e62] focus:bg-white transition"
          />
        </div>

        {/* Subheader Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h2 className="font-heading font-extrabold text-[16px] text-[#1b1b1f]">
              Assign classes and placements
            </h2>
            <p className="text-[12.5px] text-[#6b6b76] mt-0.5">
              Change an artist’s class here. The badge and the places they appear follow automatically.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full border border-[#e6e6ea] bg-white text-[#6b6b76] self-start sm:self-auto">
            About us exclusive: <b className="text-[#1b1b1f] font-bold">{aboutExclusiveCount}</b> of {ABOUT_MAX}
          </span>
        </div>

        {/* Class Filter Tabs (.ctabs from manager.html) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>All</span>
            <span className="text-[11.5px] opacity-85">{countAll}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('platinum')}
            className={`px-3.5 py-1 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'platinum'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>Platinum</span>
            <span className="text-[11.5px] opacity-85">{countPlatinum}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('emerging')}
            className={`px-3.5 py-1 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'emerging'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>Emerging</span>
            <span className="text-[11.5px] opacity-85">{countEmerging}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rising')}
            className={`px-3.5 py-1 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rising'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>Rising</span>
            <span className="text-[11.5px] opacity-85">{countRising}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`px-3.5 py-1 rounded-full text-[13px] font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'standard'
                ? 'bg-[#fde6ea] text-[#d63a50] border-transparent font-bold'
                : 'bg-white border border-[#e6e6ea] text-[#6b6b76] hover:bg-[#f6f6f7]'
            }`}
          >
            <span>Standard</span>
            <span className="text-[11.5px] opacity-85">{countStandard}</span>
          </button>
        </div>

        {/* Bulk Action Bar (if checked) */}
        {selectedCount > 0 && (
          <div className="p-3 bg-[#fde6ea] rounded-xl border border-[#eb4e62]/20 flex items-center justify-between gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-2.5">
              <b className="text-[#d63a50]">{selectedCount} selected</b>
              <span className="text-[#6b6b76]">Move to</span>
              <select
                value={bulkTargetClass}
                onChange={(e) => setBulkTargetClass(e.target.value as any)}
                className="h-8 px-2.5 rounded-lg border border-[#e6e6ea] bg-white text-xs font-semibold text-[#1b1b1f] outline-none"
              >
                {CLASSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleBulkApply}
                className="h-8 px-3 rounded-lg bg-[#d63a50] hover:bg-[#c23048] text-white text-xs font-bold transition cursor-pointer"
              >
                Apply
              </button>
            </div>
            <button
              type="button"
              onClick={handleBulkClear}
              className="text-xs font-semibold text-[#6b6b76] hover:text-[#1b1b1f] underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* 4. Artists Class Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead className="border-b border-[#e6e6ea] text-[#6b6b76] font-bold text-[12px]">
              <tr>
                <th className="py-2.5 pr-2 w-9">
                  <input
                    type="checkbox"
                    checked={
                      filteredArtists.length > 0 &&
                      filteredArtists.every((a) => selectedIds[a.id])
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-[#e6e6ea] text-[#eb4e62] focus:ring-[#eb4e62] cursor-pointer"
                    aria-label="Select all"
                  />
                </th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">Artist</th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">Class</th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">Badge</th>
                <th className="py-2.5 pr-3 font-bold text-[#6b6b76]">About us · Exclusive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e6ea]">
              {filteredArtists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#6b6b76]">
                    <b className="block text-[15px] font-heading font-bold text-[#1b1b1f] mb-1">No artists match</b>
                    <span>Change the class tab or search query.</span>
                  </td>
                </tr>
              ) : (
                filteredArtists.map((a) => (
                  <tr key={a.id} className="hover:bg-[#fafafc] transition">
                    {/* Checkbox */}
                    <td className="py-3 pr-2 w-9">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedIds[a.id])}
                        onChange={(e) =>
                          setSelectedIds({
                            ...selectedIds,
                            [a.id]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-[#e6e6ea] text-[#eb4e62] focus:ring-[#eb4e62] cursor-pointer"
                        aria-label={`Select ${a.name}`}
                      />
                    </td>

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
                            {a.cat} · {a.city}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Class Select Dropdown */}
                    <td className="py-3 pr-3">
                      <select
                        value={a.tier}
                        onChange={(e) => handleSetClass(a.id, e.target.value as any)}
                        className="h-8 px-2.5 rounded-lg border border-[#e6e6ea] bg-[#f6f6f7] text-[12px] font-medium text-[#1b1b1f] outline-none focus:border-[#eb4e62] focus:bg-white cursor-pointer"
                      >
                        {CLASSES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Badge */}
                    <td className="py-3 pr-3">
                      {a.tier === 'platinum' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fbefc7] text-[#8a6508]">
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

                    {/* About us · Exclusive Toggle Switch */}
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={a.about}
                        onClick={() => handleToggleAbout(a.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                          a.about ? 'bg-[#d63a50]' : 'bg-[#e6e6ea]'
                        }`}
                        aria-label={`About us exclusive for ${a.name}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-[2px] ml-[2px] ${
                            a.about ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
