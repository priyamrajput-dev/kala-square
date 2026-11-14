'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArtistProfile } from '@/lib/types';
import { mapRecordToArtistProfile, mockArtists } from '@/lib/mock-data';
import {
  ArtistHero,
  ArtistTabs,
  ArtistAbout,
  ArtistQuickStats,
  FanbaseChart,
  GalleryLightbox,
  VideoGrid,
  ClipGrid,
  TopSongs,
  CampaignsAwards,
  IMDbSection,
  FAQAccordion,
  ReviewsSection,
  SimilarArtists,
  EnquiryCard,
} from '@/components/artist';

interface ArtistProfileViewProps {
  initialArtist: ArtistProfile | null;
  slug: string;
}

export default function ArtistProfileView({ initialArtist, slug }: ArtistProfileViewProps) {
  const [artist, setArtist] = useState<ArtistProfile | null>(initialArtist);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('kalasquare_admin_artists');
      if (raw) {
        const list: any[] = JSON.parse(raw);
        const normalized = decodeURIComponent(slug).toLowerCase().trim();
        const found = list.find(
          (a) =>
            (a.slug && a.slug.toLowerCase().trim() === normalized) ||
            (a.id && a.id.toLowerCase().trim() === normalized)
        );
        if (found) {
          if (found.status === 'draft' || found.status === 'pending') {
            if (!initialArtist) {
              setArtist(null);
            }
            return;
          }
          const mapped = mapRecordToArtistProfile(found);
          setArtist(mapped);
        }
      }
    } catch {}
  }, [slug, initialArtist]);

  if (!artist) {
    return (
      <div className="wrap" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--hf)', fontSize: '32px', marginBottom: '12px' }}>
          Artist Not Found
        </h1>
        <p style={{ color: 'var(--mute)', marginBottom: '24px' }}>
          We could not find the artist profile for &ldquo;{slug}&rdquo;.
        </p>
        <Link href="/" className="btn fill">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pp flex-1">
      {/* 1. Hero Section */}
      <ArtistHero artist={artist} />

      {/* 2. Quick Stats strip directly under hero (rendered only if stats exist) */}
      <ArtistQuickStats stats={artist.quickStats || (artist as any).stats} />

      {/* 3. Sticky Profile Tabs */}
      <ArtistTabs artist={artist} />

      {/* Main Content & Sidebar Grid */}
      <div className="wrap pp-g">
        {/* Main Content Column */}
        <main className="pp-main">
          {/* About + Physical Stats */}
          <ArtistAbout artist={artist} />

          {/* Fanbase Distribution */}
          <FanbaseChart fanbase={artist.fanbase} />

          {/* Photo Gallery & Lightbox */}
          <GalleryLightbox gallery={artist.gallery} />

          {/* Latest Videos */}
          <VideoGrid videos={artist.videos} />

          {/* Reels & Short Clips */}
          <ClipGrid clips={artist.clips} />

          {/* Top Songs (Singer only) */}
          <TopSongs categories={artist.categories} songs={artist.topSongs} />

          {/* Work & Recognition (Campaigns & Awards) */}
          <CampaignsAwards campaigns={artist.campaigns} awards={artist.awards} />

          {/* IMDb (Actor only) */}
          <IMDbSection categories={artist.categories} imdb={artist.imdb} />

          {/* Client Reviews & Ratings */}
          <ReviewsSection
            rating={artist.rating}
            reviewsCount={artist.reviewsCount || 0}
            reviews={artist.reviews || []}
          />

          {/* Frequently Asked Questions (Platinum tier with FAQs only) */}
          <FAQAccordion
            artistClass={artist.artistClass}
            artistName={artist.name}
            faqs={artist.faqs}
          />

          {/* Page head · from Admin → SEO manager (line 2061 of manager.html) */}
          <section className="pp-s pp-seo">
            <small>Page head · from Admin → SEO manager</small>
            <b>{(artist as any).metaTitle || `${artist.name} | KalaSquare`}</b>
            <span>
              {(artist as any).metaDescription ||
                (artist.bio ? artist.bio.slice(0, 160) : 'No description set')}
            </span>
          </section>
        </main>

        {/* Sticky Book Sidebar Card */}
        <EnquiryCard artist={artist} />
      </div>

      {/* Similar Artists Section */}
      <SimilarArtists currentArtist={artist} allArtists={mockArtists} />

      {/* Mobile Sticky Enquiry Bar (matching line 2060 of manager.html) */}
      <div className="pp-mb">
        <a
          className="btn fill"
          href="#ppBook"
          onClick={(e) => {
            e.preventDefault();
            const bookEl = document.getElementById('ppBook');
            if (bookEl) {
              const y = bookEl.getBoundingClientRect().top + window.scrollY - 120;
              window.scrollTo({ top: y, behavior: 'smooth' });
              const input = bookEl.querySelector('input');
              if (input) setTimeout(() => input.focus({ preventScroll: true }), 400);
            }
          }}
        >
          Send enquiry
        </a>
        {artist.phone && (
          <a className="btn line" href={`tel:${artist.phone}`}>
            Call
          </a>
        )}
      </div>
    </div>
  );
}

