'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  Globe,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
} from 'lucide-react';
import { mockArtistProfiles } from '@/lib/mock-data';
import { ArtistProfile } from '@/lib/types';
import { calculateCompleteness } from '@/lib/completeness';
import {
  fetchAdminArtists,
  deleteArtist,
  duplicateArtist,
  publishArtist,
  unpublishArtist,
} from '@/lib/api';
import ConfirmModal from './ConfirmModal';

interface ManagedArtist {
  id: string;
  name: string;
  slug: string;
  photoUrl: string;
  categories: string[];
  city: string;
  artistClass: 'platinum' | 'gold' | 'rising' | 'new' | 'emerging' | 'standard';
  status: 'published' | 'draft';
  completeness: number;
  priceNumeric: number;
  priceLabel: string;
  updatedAt: string;
  rawProfile?: Partial<ArtistProfile>;
}

const CATEGORY_FILTER_OPTIONS = [
  'All',
  'Actor',
  'Singer',
  'Musician',
  'Band',
  'Dancer',
  'Comedian',
  'Emcee',
  'Speaker',
  'Magician',
  'DJ',
  'Photographer',
  'Crew / Company',
];

const CLASS_FILTER_OPTIONS = ['All', 'Platinum', 'Gold', 'Rising', 'New'];
const STATUS_FILTER_OPTIONS = ['All', 'Published', 'Draft'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export default function ArtistsTable() {
  const [artists, setArtists] = useState<ManagedArtist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals & Toasts
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Load: Fetch from API with fallback to mockArtistProfiles and localStorage
  const loadArtists = async () => {
    try {
      const res = await fetchAdminArtists();
      if (res && res.data && res.data.length > 0) {
        const mapped: ManagedArtist[] = res.data.map((item: any, idx: number) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          photoUrl: item.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          categories: item.categories || ['Singer'],
          city: item.city || 'Delhi',
          artistClass: (item.artistClass as ManagedArtist['artistClass']) || 'standard',
          status: item.status === 'live' || item.status === 'published' ? 'published' : 'draft',
          completeness: item.completeness || 90,
          priceNumeric: 50000 + idx * 10000,
          priceLabel: item.priceLabel || 'From ₹50,000',
          updatedAt: (item.updatedAt || new Date().toISOString()).split('T')[0],
        }));
        setArtists(mapped);
        return;
      }
    } catch {
      // API fallback
    }

    // Base mock artists mapped to ManagedArtist
    const baseList: ManagedArtist[] = mockArtistProfiles.map((p, idx) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      photoUrl: p.photoUrl,
      categories: p.categories,
      city: p.city,
      artistClass: (p.artistClass as ManagedArtist['artistClass']) || 'platinum',
      status: 'published',
      completeness: calculateCompleteness(p as any).score || (idx === 0 ? 95 : 85),
      priceNumeric: 50000 + idx * 25000,
      priceLabel: p.priceLabel || 'From ₹50,000',
      updatedAt: '2026-11-12',
      rawProfile: p,
    }));

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('kalasquare_admin_artists');
        if (raw) {
          const savedList = JSON.parse(raw);
          if (Array.isArray(savedList)) {
            savedList.forEach((item: any) => {
              const existingIdx = baseList.findIndex(
                (a) => a.id === item.id || a.slug === item.slug
              );
              const managedItem: ManagedArtist = {
                id: item.id || `art-${Date.now()}`,
                name: item.name || 'Unnamed Artist',
                slug: item.slug || 'unnamed',
                photoUrl: item.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                categories: item.categories || ['Singer'],
                city: item.city || 'Delhi',
                artistClass: item.artistClass || 'rising',
                status: item.status || 'draft',
                completeness: calculateCompleteness(item).score,
                priceNumeric: Number(item.priceFrom) || 50000,
                priceLabel: item.priceFrom ? `From ₹${Number(item.priceFrom).toLocaleString()}` : 'From ₹50,000',
                updatedAt: (item.updatedAt || new Date().toISOString()).split('T')[0],
                rawProfile: item,
              };

              if (existingIdx >= 0) {
                baseList[existingIdx] = managedItem;
              } else {
                baseList.unshift(managedItem);
              }
            });
          }
        }
      } catch (e) {
        console.error('Failed to parse saved artists from localStorage', e);
      }
    }

    setArtists(baseList);
  };

  useEffect(() => {
    loadArtists();
  }, []);

  // Sync back changes to localStorage
  const persistArtistsToStorage = (updatedList: ManagedArtist[]) => {
    setArtists(updatedList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kalasquare_admin_artists', JSON.stringify(updatedList));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
  };

  // 2. Filter & Sort Logic
  const filteredArtists = useMemo(() => {
    let result = [...artists];

    // Search filter (name, city, category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.categories.some((c) => c.toLowerCase().includes(q)) ||
          a.slug.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((a) =>
        a.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // Class filter
    if (selectedClass !== 'All') {
      result = result.filter((a) => a.artistClass.toLowerCase() === selectedClass.toLowerCase());
    }

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter((a) => a.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      if (selectedSort === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (selectedSort === 'price-asc') {
        return a.priceNumeric - b.priceNumeric;
      }
      if (selectedSort === 'price-desc') {
        return b.priceNumeric - a.priceNumeric;
      }
      // 'newest' default
      return b.updatedAt.localeCompare(a.updatedAt);
    });

    return result;
  }, [artists, searchQuery, selectedCategory, selectedClass, selectedStatus, selectedSort]);

  // 3. Pagination Slicing
  const totalPages = Math.max(1, Math.ceil(filteredArtists.length / itemsPerPage));
  const paginatedArtists = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArtists.slice(start, start + itemsPerPage);
  }, [filteredArtists, currentPage]);

  const showingFrom = filteredArtists.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(currentPage * itemsPerPage, filteredArtists.length);

  // 4. Actions
  // Toggle Publish / Unpublish
  const handleToggleStatus = async (id: string) => {
    const target = artists.find((a) => a.id === id);
    if (!target) return;
    const isPub = target.status === 'published';
    try {
      if (isPub) {
        await unpublishArtist(id);
      } else {
        await publishArtist(id);
      }
    } catch {
      // Fallback
    }

    const nextStatus = isPub ? 'draft' : 'published';
    const updated = artists.map((a) => {
      if (a.id === id) {
        return { ...a, status: nextStatus as 'published' | 'draft' };
      }
      return a;
    });
    persistArtistsToStorage(updated);
    showToast(`Artist "${target.name}" is now ${nextStatus === 'published' ? 'Published' : 'Draft'}`);
  };

  // Duplicate Artist
  const handleDuplicate = async (artist: ManagedArtist) => {
    try {
      const res = await duplicateArtist(artist.id);
      if (res) {
        showToast(`Created duplicate: "${artist.name} (Copy)"`);
        await loadArtists();
        return;
      }
    } catch {
      // Fallback
    }

    const copySlug = `${artist.slug}-copy-${Math.floor(Math.random() * 900 + 100)}`;
    const copyId = `art-${Date.now()}`;
    const copyName = `${artist.name} (Copy)`;

    const duplicated: ManagedArtist = {
      ...artist,
      id: copyId,
      name: copyName,
      slug: copySlug,
      status: 'draft',
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const nextList = [duplicated, ...artists];
    persistArtistsToStorage(nextList);
    showToast(`Created duplicate: "${copyName}"`);
  };

  // Delete Single Artist
  const handleDeleteSingle = async () => {
    if (!deleteTargetId) return;
    const target = artists.find((a) => a.id === deleteTargetId);
    try {
      await deleteArtist(deleteTargetId);
    } catch {
      // Fallback
    }
    const updated = artists.filter((a) => a.id !== deleteTargetId);
    persistArtistsToStorage(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId));
    setDeleteTargetId(null);
    showToast(`Artist "${target?.name || ''}" removed successfully.`);
  };

  // Bulk Actions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedArtists.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkPublish = () => {
    const updated = artists.map((a) =>
      selectedIds.includes(a.id) ? { ...a, status: 'published' as const } : a
    );
    persistArtistsToStorage(updated);
    showToast(`Published ${selectedIds.length} selected artists.`);
    setSelectedIds([]);
  };

  const handleBulkUnpublish = () => {
    const updated = artists.map((a) =>
      selectedIds.includes(a.id) ? { ...a, status: 'draft' as const } : a
    );
    persistArtistsToStorage(updated);
    showToast(`Unpublished ${selectedIds.length} selected artists.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    const updated = artists.filter((a) => !selectedIds.includes(a.id));
    persistArtistsToStorage(updated);
    showToast(`Deleted ${selectedIds.length} artists.`);
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  const isAllPageSelected =
    paginatedArtists.length > 0 &&
    paginatedArtists.every((a) => selectedIds.includes(a.id));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b1b1f] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in border border-white/10">
          <CheckCircle2 className="h-4 w-4 text-[#eb4e62]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6e6ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
              All Artists
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#fde6ea] text-[#eb4e62]">
              {artists.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6b6b76] mt-1">
            Search, filter, update tier status, and manage artist profiles across KalaSquare.
          </p>
        </div>

        <Link
          href="/admin/artists/new"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-white font-bold text-xs shadow-md transition self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Artist</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e6e6ea] shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b76]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, city, category, or slug..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] text-sm text-[#1b1b1f] placeholder:text-[#6b6b76] focus:bg-white focus:border-[#eb4e62] focus:outline-hidden transition"
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider block">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs font-semibold text-[#1b1b1f] focus:border-[#eb4e62] focus:outline-hidden"
            >
              {CATEGORY_FILTER_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Class Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider block">
              Artist Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs font-semibold text-[#1b1b1f] focus:border-[#eb4e62] focus:outline-hidden"
            >
              {CLASS_FILTER_OPTIONS.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider block">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs font-semibold text-[#1b1b1f] focus:border-[#eb4e62] focus:outline-hidden"
            >
              {STATUS_FILTER_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider block">
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs font-semibold text-[#1b1b1f] focus:border-[#eb4e62] focus:outline-hidden"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Bar when items selected */}
      {selectedIds.length > 0 && (
        <div className="bg-[#1b1b1f] text-white p-3.5 px-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-fade-in border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#eb4e62] text-xs font-bold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold">artists selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkPublish}
              className="px-3 py-1.5 rounded-lg bg-[#1a8a57] hover:bg-[#157348] text-xs font-bold text-white transition"
            >
              Publish Selected
            </button>
            <button
              type="button"
              onClick={handleBulkUnpublish}
              className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-xs font-bold text-white transition"
            >
              Unpublish Selected
            </button>
            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#eb4e62] hover:bg-[#d63a50] text-xs font-bold text-white transition"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Artists Table View (Desktop) & Cards View (Mobile) */}
      <div className="bg-white rounded-2xl border border-[#e6e6ea] shadow-xs overflow-hidden">
        {filteredArtists.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#fde6ea] text-[#eb4e62] flex items-center justify-center mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#1b1b1f]">
              No artists found
            </h3>
            <p className="text-xs text-[#6b6b76] leading-relaxed">
              No artist profiles match your current search query or active filter combination.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedClass('All');
                  setSelectedStatus('All');
                }}
                className="h-9 px-4 rounded-xl border border-[#e6e6ea] hover:bg-[#f6f6f7] text-xs font-bold text-[#1b1b1f] transition"
              >
                Clear Filters
              </button>
              <Link
                href="/admin/artists/new"
                className="h-9 px-4 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Artist</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e6e6ea] bg-[#f9f9fb] text-[11px] font-bold text-[#6b6b76] uppercase tracking-wider">
                    <th className="p-4 pl-5 w-10">
                      <input
                        type="checkbox"
                        checked={isAllPageSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded text-[#eb4e62] focus:ring-[#eb4e62] cursor-pointer"
                        aria-label="Select all on this page"
                      />
                    </th>
                    <th className="p-4">Artist</th>
                    <th className="p-4">Categories</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Completeness</th>
                    <th className="p-4">Updated</th>
                    <th className="p-4 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6e6ea] text-xs font-medium text-[#1b1b1f]">
                  {paginatedArtists.map((artist) => {
                    const isSelected = selectedIds.includes(artist.id);

                    return (
                      <tr
                        key={artist.id}
                        className={`hover:bg-[#f9f9fb] transition ${
                          isSelected ? 'bg-[#fde6ea]/30' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-4 pl-5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectOne(artist.id)}
                            className="w-4 h-4 rounded text-[#eb4e62] focus:ring-[#eb4e62] cursor-pointer"
                            aria-label={`Select ${artist.name}`}
                          />
                        </td>

                        {/* Photo + Name + Slug */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100 shrink-0 border border-[#e6e6ea]">
                              <Image
                                src={artist.photoUrl}
                                alt={artist.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="min-w-0 max-w-[200px]">
                              <span className="font-heading font-bold text-sm text-[#1b1b1f] block truncate hover:text-[#eb4e62] transition">
                                {artist.name}
                              </span>
                              <span className="text-[11px] font-mono text-[#6b6b76] block truncate">
                                /{artist.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category Pills */}
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-[160px]">
                            {artist.categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat}
                                className="px-2 py-0.5 rounded-md bg-[#fde6ea] text-[#eb4e62] text-[11px] font-semibold truncate"
                              >
                                {cat}
                              </span>
                            ))}
                            {artist.categories.length > 2 && (
                              <span className="text-[10px] text-[#6b6b76] font-bold">
                                +{artist.categories.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* City */}
                        <td className="p-4 text-[#6b6b76] whitespace-nowrap">
                          {artist.city}
                        </td>

                        {/* Class Badge */}
                        <td className="p-4">
                          {artist.artistClass === 'platinum' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fbefc7] text-[#8a6508] border border-[#8a6508]/20">
                              Platinum
                            </span>
                          ) : artist.artistClass === 'rising' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1b1b1f] text-white">
                              Rising
                            </span>
                          ) : artist.artistClass === 'new' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fde6ea] text-[#eb4e62] border border-[#eb4e62]/20">
                              New
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f6f6f7] text-[#6b6b76]">
                              {artist.artistClass}
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="p-4">
                          {artist.status === 'published' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e1f5ea] text-[#1a8a57]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1a8a57]" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f6f6f7] text-[#6b6b76]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#6b6b76]" />
                              Draft
                            </span>
                          )}
                        </td>

                        {/* Completeness Bar */}
                        <td className="p-4 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-[#e6e6ea] overflow-hidden">
                              <div
                                className="h-full bg-[#eb4e62] rounded-full"
                                style={{ width: `${artist.completeness}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-[#6b6b76]">
                              {artist.completeness}%
                            </span>
                          </div>
                        </td>

                        {/* Updated Date */}
                        <td className="p-4 text-[#6b6b76] text-[11px] whitespace-nowrap">
                          {artist.updatedAt}
                        </td>

                        {/* Row Actions */}
                        <td className="p-4 pr-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Live Profile */}
                            <Link
                              href={`/top-creators/${artist.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg border border-[#e6e6ea] hover:border-[#eb4e62] text-[#6b6b76] hover:text-[#eb4e62] transition"
                              title="View Public Profile"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/admin/artists/${artist.slug}/edit`}
                              className="p-1.5 rounded-lg border border-[#e6e6ea] hover:border-[#eb4e62] text-[#6b6b76] hover:text-[#eb4e62] transition"
                              title="Edit Artist"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Link>

                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={() => handleDuplicate(artist)}
                              className="p-1.5 rounded-lg border border-[#e6e6ea] hover:border-[#1b1b1f] text-[#6b6b76] hover:text-[#1b1b1f] transition"
                              title="Duplicate Profile"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                            {/* Toggle Publish/Unpublish */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(artist.id)}
                              className={`p-1.5 rounded-lg border transition ${
                                artist.status === 'published'
                                  ? 'border-[#1a8a57]/40 bg-[#e1f5ea] text-[#1a8a57]'
                                  : 'border-[#e6e6ea] text-[#6b6b76] hover:text-[#1b1b1f]'
                              }`}
                              title={
                                artist.status === 'published'
                                  ? 'Unpublish (Make Draft)'
                                  : 'Publish Live'
                              }
                            >
                              <Globe className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setDeleteTargetId(artist.id)}
                              className="p-1.5 rounded-lg border border-[#e6e6ea] hover:border-[#eb4e62] hover:bg-[#fde6ea] text-[#6b6b76] hover:text-[#eb4e62] transition"
                              title="Delete Profile"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-[#e6e6ea]">
              {paginatedArtists.map((artist) => {
                const isSelected = selectedIds.includes(artist.id);

                return (
                  <div
                    key={artist.id}
                    className={`p-4 space-y-3 ${isSelected ? 'bg-[#fde6ea]/30' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(artist.id)}
                          className="w-4 h-4 rounded text-[#eb4e62] focus:ring-[#eb4e62]"
                        />
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-100 shrink-0 border border-[#e6e6ea]">
                          <Image
                            src={artist.photoUrl}
                            alt={artist.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-[#1b1b1f]">
                            {artist.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#6b6b76] block">
                            /{artist.slug}
                          </span>
                        </div>
                      </div>

                      {artist.status === 'published' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e1f5ea] text-[#1a8a57]">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f6f6f7] text-[#6b6b76]">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {artist.categories.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded bg-[#fde6ea] text-[#eb4e62] text-[10px] font-semibold"
                        >
                          {c}
                        </span>
                      ))}
                      <span className="text-neutral-300">·</span>
                      <span className="text-[#6b6b76] text-xs">{artist.city}</span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-[#8a6508] font-bold text-xs capitalize">
                        {artist.artistClass}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#f6f6f7]">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-[#e6e6ea] overflow-hidden">
                          <div
                            className="h-full bg-[#eb4e62]"
                            style={{ width: `${artist.completeness}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#6b6b76]">
                          {artist.completeness}%
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/top-creators/${artist.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-[#e6e6ea] text-[#6b6b76]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/admin/artists/${artist.slug}/edit`}
                          className="p-1.5 rounded-lg border border-[#e6e6ea] text-[#eb4e62]"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(artist)}
                          className="p-1.5 rounded-lg border border-[#e6e6ea] text-[#6b6b76]"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(artist.id)}
                          className="p-1.5 rounded-lg border border-[#e6e6ea] text-[#eb4e62]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Row */}
            <div className="p-4 sm:p-5 border-t border-[#e6e6ea] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#6b6b76]">
              <div>
                Showing <span className="text-[#1b1b1f] font-bold">{showingFrom}</span> to{' '}
                <span className="text-[#1b1b1f] font-bold">{showingTo}</span> of{' '}
                <span className="text-[#1b1b1f] font-bold">{filteredArtists.length}</span> artists
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-3 rounded-lg border border-[#e6e6ea] hover:bg-[#f6f6f7] disabled:opacity-40 disabled:cursor-not-allowed text-[#1b1b1f] flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                      currentPage === pg
                        ? 'bg-[#eb4e62] text-white'
                        : 'border border-[#e6e6ea] hover:bg-[#f6f6f7] text-[#1b1b1f]'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 px-3 rounded-lg border border-[#e6e6ea] hover:bg-[#f6f6f7] disabled:opacity-40 disabled:cursor-not-allowed text-[#1b1b1f] flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Single Artist Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Artist Profile?"
        description="Are you sure you want to delete this artist profile? This action will remove the artist from listings and return a 404 on their public page."
        confirmLabel="Delete Artist"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteSingle}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        title={`Delete ${selectedIds.length} Selected Artists?`}
        description={`This will permanently remove ${selectedIds.length} artist profiles from the platform. This action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.length} Artists`}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleBulkDelete}
        onCancel={() => setIsBulkDeleteModalOpen(false)}
      />
    </div>
  );
}

