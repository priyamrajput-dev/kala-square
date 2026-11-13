'use client';

import React, { useEffect, useState } from 'react';
import { ArtistProfile } from '@/lib/types';

interface TabItem {
  id: string;
  label: string;
}

interface ArtistTabsProps {
  artist: ArtistProfile;
}

export default function ArtistTabs({ artist }: ArtistTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('about');

  const tabs: TabItem[] = [
    { id: 'about', label: 'About' },
    ...(artist.fanbase && artist.fanbase.length > 0
      ? [{ id: 'fanbase', label: 'Fanbase' }]
      : []),
    ...(artist.gallery && artist.gallery.length > 0
      ? [{ id: 'gallery', label: `Gallery (${artist.gallery.length})` }]
      : []),
    ...(artist.videos && artist.videos.length > 0
      ? [{ id: 'videos', label: 'Videos' }]
      : []),
    ...(artist.clips && artist.clips.length > 0
      ? [{ id: 'reels', label: 'Reels' }]
      : []),
    ...(artist.categories.includes('Singer') && artist.topSongs && artist.topSongs.length > 0
      ? [{ id: 'music', label: 'Spotify' }]
      : []),
    ...((artist.campaigns && artist.campaigns.length > 0) || (artist.awards && artist.awards.length > 0)
      ? [{ id: 'work', label: 'Work' }]
      : []),
    ...(artist.categories.includes('Actor') && artist.imdb
      ? [{ id: 'imdb', label: 'IMDb' }]
      : []),
    ...(artist.artistClass === 'platinum' && artist.faqs && artist.faqs.length > 0
      ? [{ id: 'faq', label: 'FAQs' }]
      : []),
    {
      id: 'reviews',
      label: `Reviews${artist.reviewsCount ? ` (${artist.reviewsCount})` : ''}`,
    },
  ];

  // Scrollspy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (let i = tabs.length - 1; i >= 0; i--) {
        const el = document.getElementById(`pp-${tabs[i].id}`);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveTab(tabs[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabs]);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(`pp-${id}`);
    if (element) {
      const yOffset = -120; // Account for sticky header + tabs
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-b border-[#e6e6ea] shadow-xs">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'text-[#eb4e62] bg-[#fde6ea]/50'
                    : 'text-[#6b6b76] hover:text-[#1b1b1f] hover:bg-[#f6f6f7]'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#eb4e62] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

