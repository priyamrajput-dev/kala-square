import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Artist } from '@/lib/types';

interface ArtistCardProps {
  artist: Artist;
  isSelected?: boolean;
  badgeType?: string;
}

export default function ArtistCard({ artist, isSelected }: ArtistCardProps) {
  // Check if artist has a photo or needs a fallback initial letter
  const hasPhoto = Boolean(artist.photoUrl && artist.photoUrl.trim() !== '');
  const initialChar = artist.name ? artist.name.replace(/^Dr\.\s*/i, '').charAt(0) : 'A';
  const selectedBorder = isSelected || artist.name === 'Ajay Hooda' || artist.name === 'Tanya Bose';
  const isDirectImage = hasPhoto && (
    artist.photoUrl.startsWith('data:') ||
    artist.photoUrl.startsWith('blob:') ||
    artist.photoUrl.startsWith('/uploads/') ||
    artist.photoUrl.startsWith('http://localhost')
  );
  const categoryLabel = artist.cat || (Array.isArray(artist.categories) && artist.categories.length > 0 ? artist.categories[0] : 'Artist');

  return (
    <Link
      href={`/top-creators/${artist.slug}`}
      className={`group w-[204px] shrink-0 rounded-[20px] bg-white p-3 border transition-all duration-200 block text-left ${
        selectedBorder
          ? 'border-[1.5px] border-[#eb4e62]'
          : 'border-[#e6e6ea] hover:border-[#eb4e62]'
      }`}
    >
      {/* Photo or Letter Avatar */}
      <div className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-[#f0f0f2] flex items-center justify-center">
        {hasPhoto ? (
          isDirectImage ? (
            <img
              src={artist.photoUrl}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src={artist.photoUrl}
              alt={artist.name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="204px"
            />
          )
        ) : (
          <span className="font-heading font-extrabold text-3xl text-[#eb4e62] select-none">
            {initialChar}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-heading font-extrabold text-[16px] text-[#1b1b1f] mt-2.5 mb-0.5 truncate tracking-tight group-hover:text-[#eb4e62] transition">
        {artist.name}
      </h3>

      {/* Category and City */}
      <span className="text-[13px] text-[#6b6b76] truncate block">
        {categoryLabel} · {artist.city}
      </span>
    </Link>
  );
}
