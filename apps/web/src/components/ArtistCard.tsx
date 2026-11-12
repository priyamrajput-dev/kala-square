'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, Award, Sparkles, TrendingUp } from 'lucide-react';
import { Artist } from '@/lib/types';

interface ArtistCardProps {
  artist: Artist;
  badgeType?: 'platinum' | 'new' | 'rising';
}

export default function ArtistCard({ artist, badgeType = 'platinum' }: ArtistCardProps) {
  const [liked, setLiked] = useState(false);
  const activeBadge = artist.badgeType || badgeType;

  return (
    <div className="group bg-white rounded-[18px] border border-[#e6e6ea] hover:border-[#eb4e62] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* Top Image Container */}
      <Link href={`/top-creators/${artist.slug}`} className="relative w-full aspect-[4/3] bg-[#f6f6f7] overflow-hidden block">
        <Image
          src={artist.photoUrl}
          alt={artist.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Top-Left Badge */}
        <div className="absolute top-3 left-3 z-10">
          {activeBadge === 'platinum' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#fff4d6] text-[#8a5a00] shadow-sm">
              <Award className="h-3.5 w-3.5" />
              <span>Platinum</span>
            </span>
          )}
          {activeBadge === 'new' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#eb4e62] text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>New</span>
            </span>
          )}
          {activeBadge === 'rising' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#1b1b1f] text-white shadow-sm">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Rising</span>
            </span>
          )}
        </div>

        {/* Top-Right Heart Save Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center transition shadow-sm"
          aria-label="Save artist"
        >
          <Heart
            className={`h-4 w-4 transition ${
              liked ? 'fill-[#eb4e62] text-[#eb4e62]' : 'text-[#1b1b1f] hover:text-[#eb4e62]'
            }`}
          />
        </button>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/top-creators/${artist.slug}`}>
            <h3 className="font-heading font-bold text-lg text-[#1b1b1f] group-hover:text-[#eb4e62] transition truncate">
              {artist.name}
            </h3>
          </Link>
          <p className="text-sm text-[#6b6b76] mt-0.5 truncate">
            {artist.cat} · {artist.city}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-[#f6f6f7] flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1 text-sm font-semibold text-[#1b1b1f]">
            <Star className="h-4 w-4 fill-[#eb4e62] text-[#eb4e62]" />
            <span>{artist.rating.toFixed(1)}</span>
            <span className="text-xs text-[#6b6b76] font-normal">({artist.reviewsCount})</span>
          </div>

          {/* Price Label */}
          <span className="text-xs font-bold text-[#eb4e62] bg-[#fde6ea] px-2 py-0.5 rounded-md">
            {artist.priceLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
