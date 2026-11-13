'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Award,
  Calendar,
  Building2,
  HelpCircle,
  Layout,
  MessageSquare,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Search,
  ExternalLink,
} from 'lucide-react';
import { HomeConfig } from '@/lib/validators/home-config';

interface HomeSectionEditorProps {
  activeSectionId: string;
  config: HomeConfig;
  onChange: (newConfig: HomeConfig) => void;
  availableArtists: {
    id: string;
    name: string;
    slug: string;
    photoUrl: string;
    categories?: string[];
    cat?: string;
    artistClass?: string;
    tier?: string;
  }[];
  availableEvents: {
    id: string;
    title: string;
    date: string;
    city: string;
    imageUrl: string;
  }[];
  availableVenues: {
    id: string;
    name: string;
    city: string;
    category: string;
    imageUrl?: string;
  }[];
}

export default function HomeSectionEditor({
  activeSectionId,
  config,
  onChange,
  availableArtists,
  availableEvents,
  availableVenues,
}: HomeSectionEditorProps) {
  const [artistSearchQuery, setArtistSearchQuery] = useState('');

  // -------------------------------------------------------------
  // Section 1: Hero Editor
  // -------------------------------------------------------------
  if (activeSectionId === 'hero') {
    const hero = config.hero;
    const updateHero = (fields: Partial<typeof hero>) => {
      onChange({ ...config, hero: { ...hero, ...fields } });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#1b1b1f]">
            Hero Section Settings
          </h2>
          <p className="text-xs text-[#6b6b76] mt-0.5">
            Configure primary headlines, search call-to-actions, and live platform stats.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
              Eyebrow / Badge Text
            </label>
            <input
              type="text"
              value={hero.eyebrow}
              onChange={(e) => updateHero({ eyebrow: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              placeholder="e.g. KalaSquare Talent Network"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
              Main Heading *
            </label>
            <input
              type="text"
              value={hero.heading}
              onChange={(e) => updateHero({ heading: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              placeholder="Book India’s Finest Performing Artists & Venues"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
              Subtext / Lead Paragraph *
            </label>
            <textarea
              rows={3}
              value={hero.subtext}
              onChange={(e) => updateHero({ subtext: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              placeholder="Describe what organizers and clients find on KalaSquare..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Primary Button Text
              </label>
              <input
                type="text"
                value={hero.primaryButtonText}
                onChange={(e) => updateHero({ primaryButtonText: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={hero.secondaryButtonText}
                onChange={(e) => updateHero({ secondaryButtonText: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Stats Box */}
          <div className="p-4 rounded-xl border border-[#e6e6ea] bg-[#f9f9fb] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-[#1b1b1f]">
                Show Live Platform Stats
              </span>
              <input
                type="checkbox"
                checked={hero.showStats}
                onChange={(e) => updateHero({ showStats: e.target.checked })}
                className="w-4 h-4 rounded text-[#eb4e62] focus:ring-[#eb4e62] cursor-pointer"
              />
            </div>

            {hero.showStats && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                    Artists Count
                  </label>
                  <input
                    type="text"
                    value={hero.artistsCount}
                    onChange={(e) => updateHero({ artistsCount: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-[#e6e6ea] bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                    Events Count
                  </label>
                  <input
                    type="text"
                    value={hero.eventsCount}
                    onChange={(e) => updateHero({ eventsCount: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-[#e6e6ea] bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                    Trust Rating
                  </label>
                  <input
                    type="text"
                    value={hero.rating}
                    onChange={(e) => updateHero({ rating: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-[#e6e6ea] bg-white text-xs font-bold"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Section 2, 3, 7: Artist Row Selector (Platinum, New, Rising)
  // -------------------------------------------------------------
  if (
    activeSectionId === 'platinum' ||
    activeSectionId === 'newTalent' ||
    activeSectionId === 'rising'
  ) {
    const secKey = activeSectionId as 'platinum' | 'newTalent' | 'rising';
    const sectionData = config[secKey];
    const updateSection = (fields: Partial<typeof sectionData>) => {
      onChange({ ...config, [secKey]: { ...sectionData, ...fields } });
    };

    const selectedArtists = sectionData.artistIds
      .map((id) => availableArtists.find((a) => a.id === id || a.slug === id))
      .filter(Boolean);

    const isPlatinum = secKey === 'platinum';

    const handleAddArtist = (artistId: string) => {
      if (sectionData.artistIds.length >= 4) return;
      if (!sectionData.artistIds.includes(artistId)) {
        updateSection({ artistIds: [...sectionData.artistIds, artistId] });
      }
      setArtistSearchQuery('');
    };

    const handleRemoveArtist = (artistId: string) => {
      updateSection({
        artistIds: sectionData.artistIds.filter((id) => id !== artistId),
      });
    };

    const filteredCandidates = availableArtists.filter(
      (a) =>
        !sectionData.artistIds.includes(a.id) &&
        (a.name.toLowerCase().includes(artistSearchQuery.toLowerCase()) ||
          (a.categories || [a.cat || 'Performer']).some((c) =>
            c.toLowerCase().includes(artistSearchQuery.toLowerCase())
          ))
    );

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#1b1b1f] capitalize">
            {isPlatinum
              ? 'Platinum Artists'
              : secKey === 'newTalent'
              ? 'New on KalaSquare'
              : 'Rising Artists'}{' '}
            Section
          </h2>
          <p className="text-xs text-[#6b6b76] mt-0.5">
            Select up to 4 featured artists to showcase on the home page carousel row.
          </p>
        </div>

        {/* Warning if less than 4 */}
        {selectedArtists.length < 4 && (
          <div className="p-3.5 rounded-xl bg-[#fff4d6] border border-[#8a6508]/20 flex items-start gap-2.5 text-xs text-[#8a6508]">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <strong>Row incomplete ({selectedArtists.length}/4 selected):</strong>{' '}
              {isPlatinum
                ? 'Platinum section requires 4 artists to fill the desktop row without empty gaps.'
                : 'Select 4 artists for the best desktop grid presentation.'}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Section Title *
              </label>
              <input
                type="text"
                value={sectionData.title}
                onChange={(e) => updateSection({ title: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                View All Link Text
              </label>
              <input
                type="text"
                value={sectionData.viewAllText}
                onChange={(e) => updateSection({ viewAllText: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={sectionData.subtitle}
              onChange={(e) => updateSection({ subtitle: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
            />
          </div>

          {/* Selected Artists Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1b1b1f]">
                Selected Artists ({selectedArtists.length} / 4)
              </label>
              <span className="text-[11px] text-[#6b6b76]">Max 4</span>
            </div>

            <div className="p-3 rounded-xl border border-[#e6e6ea] bg-[#f9f9fb] min-h-[50px] flex flex-wrap gap-2">
              {selectedArtists.map((artist) => {
                if (!artist) return null;
                return (
                  <div
                    key={artist.id}
                    className="inline-flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-white border border-[#e6e6ea] shadow-xs text-xs font-bold text-[#1b1b1f]"
                  >
                    <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={artist.photoUrl}
                        alt={artist.name}
                        fill
                        className="object-cover"
                        sizes="20px"
                      />
                    </div>
                    <span>{artist.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveArtist(artist.id)}
                      className="ml-1 text-[#6b6b76] hover:text-[#eb4e62] transition"
                      aria-label={`Remove ${artist.name}`}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}

              {selectedArtists.length === 0 && (
                <span className="text-xs text-[#6b6b76] py-1">
                  No artists selected. Search below to add artists.
                </span>
              )}
            </div>
          </div>

          {/* Search to Add Artist */}
          {sectionData.artistIds.length < 4 && (
            <div className="space-y-2 pt-2 border-t border-[#e6e6ea]">
              <label className="text-xs font-bold text-[#1b1b1f] block">
                Add an Artist
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b76]" />
                <input
                  type="text"
                  value={artistSearchQuery}
                  onChange={(e) => setArtistSearchQuery(e.target.value)}
                  placeholder="Type artist name or category to search..."
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#e6e6ea] bg-white text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
                />
              </div>

              {artistSearchQuery.trim() && (
                <div className="max-h-48 overflow-y-auto rounded-xl border border-[#e6e6ea] bg-white divide-y divide-[#f6f6f7] shadow-sm">
                  {filteredCandidates.slice(0, 6).map((candidate) => (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => handleAddArtist(candidate.id)}
                      className="w-full p-2.5 flex items-center justify-between hover:bg-[#fde6ea]/30 text-left transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 bg-neutral-100">
                          <Image
                            src={candidate.photoUrl}
                            alt={candidate.name}
                            fill
                            className="object-cover"
                            sizes="28px"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#1b1b1f] block">
                            {candidate.name}
                          </span>
                          <span className="text-[10px] text-[#6b6b76]">
                            {(candidate.categories || [candidate.cat || 'Performer']).join(', ')}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#eb4e62] flex items-center gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </span>
                    </button>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <div className="p-3 text-center text-xs text-[#6b6b76]">
                      No matching artists available to add.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Section 4: Categories Editor
  // -------------------------------------------------------------
  if (activeSectionId === 'categories') {
    const categories = config.categories;
    const updateCategories = (fields: Partial<typeof categories>) => {
      onChange({ ...config, categories: { ...categories, ...fields } });
    };

    const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
      const items = [...categories.items];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return;
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      updateCategories({ items });
    };

    const handleToggleCategoryVisible = (index: number) => {
      const items = [...categories.items];
      items[index] = { ...items[index], isVisible: !items[index].isVisible };
      updateCategories({ items });
    };

    const handleUpdateCount = (index: number, count: number) => {
      const items = [...categories.items];
      items[index] = { ...items[index], count };
      updateCategories({ items });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#1b1b1f]">
            Find Talent By Category
          </h2>
          <p className="text-xs text-[#6b6b76] mt-0.5">
            Reorder categories, toggle individual visibility, and calibrate displayed artist counts.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Section Title *
              </label>
              <input
                type="text"
                value={categories.title}
                onChange={(e) => updateCategories({ title: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={categories.subtitle}
                onChange={(e) => updateCategories({ subtitle: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1b1b1f] block">
              Category Order &amp; Counts ({categories.items.length} Categories)
            </span>

            <div className="divide-y divide-[#e6e6ea] border border-[#e6e6ea] rounded-xl overflow-hidden bg-white">
              {categories.items.map((cat, idx) => (
                <div
                  key={cat.slug}
                  className={`p-3 flex items-center justify-between gap-3 text-xs ${
                    cat.isVisible ? 'bg-white' : 'bg-neutral-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-neutral-400 font-bold text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-[#1b1b1f] truncate">
                      {cat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#6b6b76]">
                      <span>Count:</span>
                      <input
                        type="number"
                        min={0}
                        value={cat.count}
                        onChange={(e) => handleUpdateCount(idx, Number(e.target.value))}
                        className="w-16 h-8 px-2 rounded-lg border border-[#e6e6ea] text-xs font-bold text-center"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCategoryVisible(idx)}
                      className={`p-1.5 rounded-lg border transition ${
                        cat.isVisible
                          ? 'border-[#1a8a57]/40 text-[#1a8a57] bg-[#e1f5ea]'
                          : 'border-[#e6e6ea] text-[#6b6b76]'
                      }`}
                      title={cat.isVisible ? 'Hide Category' : 'Show Category'}
                    >
                      {cat.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveCategory(idx, 'up')}
                        className="p-1 rounded-md border border-[#e6e6ea] hover:bg-[#f6f6f7] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === categories.items.length - 1}
                        onClick={() => handleMoveCategory(idx, 'down')}
                        className="p-1 rounded-md border border-[#e6e6ea] hover:bg-[#f6f6f7] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Section 5: Stage & Spotlights Editor
  // -------------------------------------------------------------
  if (activeSectionId === 'spotlights') {
    const spotlights = config.spotlights;
    const updateSpotlights = (fields: Partial<typeof spotlights>) => {
      onChange({ ...config, spotlights: { ...spotlights, ...fields } });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#1b1b1f]">
            Stage &amp; Spotlights
          </h2>
          <p className="text-xs text-[#6b6b76] mt-0.5">
            Featured headliner banner plus two auxiliary articles for the main stage section.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Section Title *
              </label>
              <input
                type="text"
                value={spotlights.title}
                onChange={(e) => updateSpotlights({ title: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={spotlights.subtitle}
                onChange={(e) => updateSpotlights({ subtitle: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Main Featured Banner */}
          <div className="p-4 rounded-xl border border-[#e6e6ea] bg-[#f9f9fb] space-y-3">
            <span className="font-heading font-bold text-xs text-[#1b1b1f] uppercase tracking-wider block">
              1. Main Featured Banner (Large)
            </span>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                  Banner Title *
                </label>
                <input
                  type="text"
                  value={spotlights.featuredArticle.title}
                  onChange={(e) =>
                    updateSpotlights({
                      featuredArticle: { ...spotlights.featuredArticle, title: e.target.value },
                    })
                  }
                  className="w-full h-9 px-3 rounded-lg border border-[#e6e6ea] bg-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={spotlights.featuredArticle.description}
                  onChange={(e) =>
                    updateSpotlights({
                      featuredArticle: { ...spotlights.featuredArticle, description: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-[#e6e6ea] bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={spotlights.featuredArticle.imageUrl}
                    onChange={(e) =>
                      updateSpotlights({
                        featuredArticle: { ...spotlights.featuredArticle, imageUrl: e.target.value },
                      })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-[#e6e6ea] bg-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                    Target Link
                  </label>
                  <input
                    type="text"
                    value={spotlights.featuredArticle.link}
                    onChange={(e) =>
                      updateSpotlights({
                        featuredArticle: { ...spotlights.featuredArticle, link: e.target.value },
                      })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-[#e6e6ea] bg-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2 Small Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {spotlights.smallArticles.map((art, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#e6e6ea] bg-[#f9f9fb] space-y-3"
              >
                <span className="font-heading font-bold text-xs text-[#1b1b1f] uppercase tracking-wider block">
                  Small Article {idx + 1}
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={art.title}
                    onChange={(e) => {
                      const updated = [...spotlights.smallArticles];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      updateSpotlights({ smallArticles: updated });
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-[#e6e6ea] bg-white text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={art.tag}
                      onChange={(e) => {
                        const updated = [...spotlights.smallArticles];
                        updated[idx] = { ...updated[idx], tag: e.target.value };
                        updateSpotlights({ smallArticles: updated });
                      }}
                      className="w-full h-8 px-2.5 rounded-lg border border-[#e6e6ea] bg-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#6b6b76] mb-1">
                      Link URL
                    </label>
                    <input
                      type="text"
                      value={art.link}
                      onChange={(e) => {
                        const updated = [...spotlights.smallArticles];
                        updated[idx] = { ...updated[idx], link: e.target.value };
                        updateSpotlights({ smallArticles: updated });
                      }}
                      className="w-full h-8 px-2.5 rounded-lg border border-[#e6e6ea] bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Section 6: Featured Events Editor
  // -------------------------------------------------------------
  if (activeSectionId === 'events') {
    const events = config.events;
    const updateEvents = (fields: Partial<typeof events>) => {
      onChange({ ...config, events: { ...events, ...fields } });
    };

    const handleUpdateBadge = (idx: number, badge: any) => {
      const items = [...events.items];
      items[idx] = { ...items[idx], badge };
      updateEvents({ items });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#1b1b1f]">
            Featured Events
          </h2>
          <p className="text-xs text-[#6b6b76] mt-0.5">
            Select up to 4 upcoming event posters and assign highlight badges.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Section Title *
              </label>
              <input
                type="text"
                value={events.title}
                onChange={(e) => updateEvents({ title: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={events.subtitle}
                onChange={(e) => updateEvents({ subtitle: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#1b1b1f] block">
              Featured Event Slots (Max 4)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {events.items.map((slot, idx) => {
                const matchedEvent = availableEvents.find((e) => e.id === slot.id);

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#e6e6ea] bg-white shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#6b6b76] uppercase">
                        Slot {idx + 1}
                      </span>
                      <select
                        value={slot.badge}
                        onChange={(e) => handleUpdateBadge(idx, e.target.value)}
                        className="h-7 px-2 rounded-md border border-[#e6e6ea] bg-[#fde6ea] text-[#eb4e62] text-[11px] font-bold"
                      >
                        <option value="Trending">Trending</option>
                        <option value="New">New</option>
                        <option value="Filling Fast">Filling Fast</option>
                        <option value="KS Original">KS Original</option>
                        <option value="none">No Badge</option>
                      </select>
                    </div>

                    <select
                      value={slot.id}
                      onChange={(e) => {
                        const items = [...events.items];
                        items[idx] = { ...items[idx], id: e.target.value };
                        updateEvents({ items });
                      }}
                      className="w-full h-9 px-2.5 rounded-lg border border-[#e6e6ea] text-xs font-bold text-[#1b1b1f]"
                    >
                      {availableEvents.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title} ({ev.city})
                        </option>
                      ))}
                    </select>

                    {matchedEvent && (
                      <span className="text-[11px] text-[#6b6b76] block truncate">
                        {matchedEvent.date} · {matchedEvent.city}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Section 8: Venues Editor
  // -------------------------------------------------------------
  if (activeSectionId === 'venues') {
    const venues = config.venues;
    const updateVenues = (fields: Partial<typeof venues>) => {
      onChange({ ...config, venues: { ...venues, ...fields } });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#1b1b1f]">
            Venues Section
          </h2>
          <p className="text-xs text-[#6b6b76] mt-0.5">
            Select 3 premium venue partner stages to feature on the home page.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Section Title *
              </label>
              <input
                type="text"
                value={venues.title}
                onChange={(e) => updateVenues({ title: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={venues.subtitle}
                onChange={(e) => updateVenues({ subtitle: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#1b1b1f] block">
              Featured Venues (Max 3)
            </label>

            <div className="space-y-2.5">
              {[0, 1, 2].map((idx) => {
                const currentId = venues.venueIds[idx] || '';
                const venueObj = availableVenues.find((v) => v.id === currentId);

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#e6e6ea] bg-white flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-bold text-[#6b6b76] w-6">
                      #{idx + 1}
                    </span>
                    <select
                      value={currentId}
                      onChange={(e) => {
                        const newIds = [...venues.venueIds];
                        newIds[idx] = e.target.value;
                        updateVenues({ venueIds: newIds.filter(Boolean).slice(0, 3) });
                      }}
                      className="flex-1 h-9 px-3 rounded-lg border border-[#e6e6ea] text-xs font-bold text-[#1b1b1f]"
                    >
                      <option value="">Select a venue...</option>
                      {availableVenues.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.city} · {v.category})
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Section 9: FAQ Editor
  // -------------------------------------------------------------
  if (activeSectionId === 'faq') {
    const faq = config.faq;
    const updateFaq = (fields: Partial<typeof faq>) => {
      onChange({ ...config, faq: { ...faq, ...fields } });
    };

    const handleAddFaq = () => {
      if (faq.items.length >= 4) return;
      updateFaq({
        items: [
          ...faq.items,
          {
            question: 'How do payments work for talent bookings?',
            answer: 'Payments are handled securely via escrow: 50% advance upon contract signing and 50% upon arrival.',
          },
        ],
      });
    };

    const handleRemoveFaq = (index: number) => {
      updateFaq({ items: faq.items.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#1b1b1f]">
            Home Page FAQs
          </h2>
          <p className="text-xs text-[#6b6b76] mt-0.5">
            Configure up to 4 high-priority questions to resolve common organizer objections.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Section Title *
              </label>
              <input
                type="text"
                value={faq.title}
                onChange={(e) => updateFaq({ title: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Concierge Button Text
              </label>
              <input
                type="text"
                value={faq.buttonText}
                onChange={(e) => updateFaq({ buttonText: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1b1b1f]">
                FAQ Questions ({faq.items.length} / 4)
              </label>
              <button
                type="button"
                disabled={faq.items.length >= 4}
                onClick={handleAddFaq}
                className="text-xs font-bold text-[#eb4e62] hover:text-[#d63a50] disabled:opacity-40 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faq.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#e6e6ea] bg-white space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#6b6b76] uppercase">
                      Question {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-neutral-400 hover:text-[#eb4e62] transition"
                      aria-label="Remove Question"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const updated = [...faq.items];
                      updated[idx] = { ...updated[idx], question: e.target.value };
                      updateFaq({ items: updated });
                    }}
                    placeholder="Enter question..."
                    className="w-full h-9 px-3 rounded-lg border border-[#e6e6ea] text-xs font-bold text-[#1b1b1f]"
                  />

                  <textarea
                    rows={2}
                    value={item.answer}
                    onChange={(e) => {
                      const updated = [...faq.items];
                      updated[idx] = { ...updated[idx], answer: e.target.value };
                      updateFaq({ items: updated });
                    }}
                    placeholder="Enter answer..."
                    className="w-full p-2.5 rounded-lg border border-[#e6e6ea] text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Section 10: Footer Editor
  // -------------------------------------------------------------
  if (activeSectionId === 'footer') {
    const footer = config.footer;
    const updateFooter = (fields: Partial<typeof footer>) => {
      onChange({ ...config, footer: { ...footer, ...fields } });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#1b1b1f]">
            Footer Links &amp; Social
          </h2>
          <p className="text-xs text-[#6b6b76] mt-0.5">
            Manage corporate links, social channels, and copyright statement.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={footer.instagramUrl}
                onChange={(e) => updateFooter({ instagramUrl: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                YouTube URL
              </label>
              <input
                type="text"
                value={footer.youtubeUrl}
                onChange={(e) => updateFooter({ youtubeUrl: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={footer.facebookUrl}
                onChange={(e) => updateFooter({ facebookUrl: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
                X / Twitter URL
              </label>
              <input
                type="text"
                value={footer.xUrl}
                onChange={(e) => updateFooter({ xUrl: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
              Copyright Notice
            </label>
            <input
              type="text"
              value={footer.copyrightText}
              onChange={(e) => updateFooter({ copyrightText: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium"
            />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Section 11: Enquiry CTA Editor
  // -------------------------------------------------------------
  if (activeSectionId === 'enquiryCta') {
    const cta = config.enquiryCta;
    const updateCta = (fields: Partial<typeof cta>) => {
      onChange({ ...config, enquiryCta: { ...cta, ...fields } });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#1b1b1f]">
            Enquiry Floating CTA
          </h2>
          <p className="text-xs text-[#6b6b76] mt-0.5">
            Configure mobile sticky enquiry action bar and desktop prompt text.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
              Callout Title *
            </label>
            <input
              type="text"
              value={cta.title}
              onChange={(e) => updateCta({ title: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b1b1f] mb-1">
              Button Label *
            </label>
            <input
              type="text"
              value={cta.buttonText}
              onChange={(e) => updateCta({ buttonText: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl border border-[#e6e6ea] text-xs font-medium focus:border-[#eb4e62] focus:outline-hidden"
            />
          </div>

          <div className="p-4 rounded-xl border border-[#e6e6ea] bg-[#f9f9fb] flex items-center justify-between">
            <div>
              <span className="font-heading font-bold text-xs text-[#1b1b1f] block">
                Mobile Only Toggle
              </span>
              <span className="text-xs text-[#6b6b76]">
                When enabled, the sticky bar only shows on viewports under 768px.
              </span>
            </div>
            <input
              type="checkbox"
              checked={cta.mobileOnly}
              onChange={(e) => updateCta({ mobileOnly: e.target.checked })}
              className="w-4 h-4 rounded text-[#eb4e62] focus:ring-[#eb4e62] cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-xs text-[#6b6b76]">
      Select a section from the left navigation to edit its settings.
    </div>
  );
}
