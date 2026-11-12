'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  Check,
  Star,
  MapPin,
  Share2,
  Heart,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { ArtistProfile } from '@/lib/types';

interface ArtistHeroProps {
  artist: ArtistProfile;
}

export default function ArtistHero({ artist }: ArtistHeroProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${artist.name} | KalaSquare`,
          text: artist.tagline || `Book ${artist.name} on KalaSquare`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (typeof window !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const socialList = [
    { name: 'Instagram', url: artist.social.instagram },
    { name: 'YouTube', url: artist.social.youtube },
    { name: 'Facebook', url: artist.social.facebook },
    { name: 'Spotify', url: artist.social.spotify },
    { name: 'IMDb', url: artist.social.imdb },
    { name: 'X', url: artist.social.x },
  ].filter((s) => Boolean(s.url));

  return (
    <header className="relative bg-white border-b border-[#e6e6ea] pt-6 pb-10 overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#fde6ea]/60 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#fde6ea]/40 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Top bar: Back to Home link */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b6b76] hover:text-[#eb4e62] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>

          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center text-xs font-bold text-[#eb4e62] hover:text-[#d63a50] px-3 py-1.5 rounded-lg border border-[#e6e6ea] bg-white transition"
          >
            Edit in Admin
          </Link>
        </div>

        {/* Hero Grid: Photo Left + Info Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Profile Photo (Square 800x800, rounded 20px, 320px on desktop) */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
            <div className="relative w-full max-w-[320px] aspect-square rounded-[20px] overflow-hidden border border-[#e6e6ea] shadow-md bg-[#f6f6f7] group">
              <Image
                src={artist.photoUrl}
                alt={artist.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 320px"
              />

              {/* Rating Star Badge overlaid at bottom of photo */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold text-[#1b1b1f]">
                <Star className="h-4 w-4 fill-[#eb4e62] text-[#eb4e62]" />
                <span>{artist.rating.toFixed(1)}</span>
                <span className="text-[#6b6b76] font-normal">
                  ({artist.reviewsCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Badges, Name, Tagline, Location, Categories, Action Buttons */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              {artist.artistClass === 'platinum' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fff4d6] text-[#8a5a00] border border-[#fde199]">
                  <Award className="h-3.5 w-3.5" />
                  <span>Platinum artist</span>
                </span>
              )}
              {artist.isVerified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e8f3ff] text-[#0066cc] border border-[#cce4ff]">
                  <Check className="h-3.5 w-3.5" />
                  <span>Verified by KalaSquare</span>
                </span>
              )}
            </div>

            {/* Name & Tagline */}
            <div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[40px] text-[#1b1b1f] tracking-tight leading-tight">
                {artist.name}
              </h1>
              {artist.tagline && (
                <p className="text-base sm:text-lg text-[#6b6b76] mt-1.5 leading-snug">
                  {artist.tagline}
                </p>
              )}
            </div>

            {/* Location & Categories */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#6b6b76]">
              <span className="inline-flex items-center gap-1 font-medium text-[#1b1b1f]">
                <MapPin className="h-4 w-4 text-[#eb4e62]" />
                {artist.city}
                {artist.state && `, ${artist.state}`}
              </span>
              <span className="text-neutral-300">·</span>
              <span className="font-medium text-[#1b1b1f]">
                {artist.categories.join(' · ')}
              </span>
            </div>

            {/* Specializations Pills (Peach bg, Coral text) */}
            {artist.specializations && artist.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {artist.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fde6ea] text-[#eb4e62]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {/* Primary: Send Enquiry */}
              <a
                href="#pp-enquiry"
                className="h-11 px-7 rounded-[10px] bg-[#eb4e62] hover:bg-[#d63a50] text-white font-bold text-sm shadow-md transition flex items-center justify-center"
              >
                Send Enquiry
              </a>

              {/* Secondary: Talk to creator (tel link) */}
              {artist.phone && (
                <a
                  href={`tel:${artist.phone}`}
                  className="h-11 px-5 rounded-[10px] bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-[#1b1b1f] font-bold text-sm transition flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-[#eb4e62]" />
                  <span>Talk to creator</span>
                </a>
              )}

              {/* Tertiary: Share */}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share profile"
                className="h-11 w-11 rounded-[10px] bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-[#1b1b1f] flex items-center justify-center transition"
                title={copied ? 'Link copied!' : 'Share profile'}
              >
                <Share2 className="h-4 w-4" />
              </button>

              {/* Quaternary: Save */}
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                aria-label="Save artist"
                aria-pressed={isSaved}
                className={`h-11 w-11 rounded-[10px] border transition flex items-center justify-center ${
                  isSaved
                    ? 'bg-[#fde6ea] border-[#eb4e62] text-[#eb4e62]'
                    : 'bg-white border-[#e6e6ea] hover:border-[#eb4e62] text-[#1b1b1f]'
                }`}
                title={isSaved ? 'Saved to favorites' : 'Save to favorites'}
              >
                <Heart
                  className={`h-4 w-4 ${isSaved ? 'fill-[#eb4e62]' : ''}`}
                />
              </button>

              {copied && (
                <span className="text-xs font-semibold text-[#eb4e62]">
                  Link copied!
                </span>
              )}
            </div>

            {/* Social Links */}
            {socialList.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#6b6b76]">
                <span className="font-semibold text-[#1b1b1f]">Connect on:</span>
                {socialList.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#eb4e62] hover:underline transition font-medium"
                  >
                    {soc.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
