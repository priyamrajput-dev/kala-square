import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VenueItem } from '@/lib/types';

interface VenueCardProps {
  venue: VenueItem;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link
      href="#venues"
      className="group w-[290px] shrink-0 rounded-[20px] overflow-hidden bg-white border border-[#e6e6ea] hover:border-[#eb4e62] transition-all duration-300 shadow-xs hover:shadow-md block text-left"
    >
      {/* Top Graphic / Photo Area with House SVG */}
      <div
        className="relative h-[160px] w-full flex items-center justify-center p-4"
        style={{
          backgroundImage: 'linear-gradient(150deg, #f58a9a 0%, #eb4e62 60%, #c23048 100%)',
        }}
      >
        {venue.imageUrl ? (
          <Image
            src={venue.imageUrl}
            alt={venue.name}
            fill
            className="object-cover"
          />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-14 h-14 text-white stroke-current fill-none stroke-[1.6] stroke-linecap-round stroke-linejoin-round"
            aria-hidden="true"
          >
            <path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" />
          </svg>
        )}

        {/* Code Badge at Bottom Left (Overlapping) */}
        <span className="absolute bottom-3 left-4 bg-white text-[#1b1b1f] font-heading font-extrabold text-[12px] px-2.5 py-1 rounded-md shadow-xs">
          {venue.code}
        </span>
      </div>

      {/* Bottom Text Area */}
      <div className="p-4 bg-white">
        <h3 className="font-heading font-extrabold text-[16px] text-[#1b1b1f] tracking-tight group-hover:text-[#eb4e62] transition truncate">
          {venue.name}
        </h3>
        <span className="text-[13px] text-[#6b6b76] block mt-0.5">
          {venue.city}
        </span>
      </div>
    </Link>
  );
}
