import React from 'react';
import Image from 'next/image';
import { Home, Users, MapPin, Tag } from 'lucide-react';
import { VenueItem } from '@/lib/types';

interface VenueCardProps {
  venue: VenueItem;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className="group bg-white rounded-[18px] border border-[#e6e6ea] hover:border-[#eb4e62] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Top Banner / Image / Gradient with house icon */}
      <div className="relative aspect-[16/9] w-full gradient-card overflow-hidden flex items-center justify-center">
        {venue.imageUrl ? (
          <>
            <Image
              src={venue.imageUrl}
              alt={venue.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <Home className="h-14 w-14 text-white/80" />
        )}

        {/* Code Badge Overlapping bottom right */}
        <span className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white text-[#eb4e62] font-heading font-extrabold text-sm flex items-center justify-center shadow-md">
          {venue.code}
        </span>
      </div>

      {/* Bottom Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-[#1b1b1f] group-hover:text-[#eb4e62] transition truncate">
            {venue.name}
          </h3>
          <p className="flex items-center gap-1 text-sm text-[#6b6b76] mt-1">
            <MapPin className="h-3.5 w-3.5 text-[#eb4e62]" />
            <span>{venue.city}</span>
            <span className="text-neutral-300">·</span>
            <span className="truncate">{venue.category}</span>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f6f6f7] flex items-center justify-between text-xs text-[#6b6b76]">
          {venue.capacity && (
            <span className="flex items-center gap-1 font-medium">
              <Users className="h-3.5 w-3.5" />
              <span>{venue.capacity}</span>
            </span>
          )}
          {venue.priceLabel && (
            <span className="flex items-center gap-1 font-bold text-[#eb4e62]">
              <Tag className="h-3.5 w-3.5" />
              <span>{venue.priceLabel}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
