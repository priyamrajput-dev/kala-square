import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EventItem } from '@/lib/types';

interface EventCardProps {
  event: EventItem;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  // Gradients matching HTML reference
  const gradients = [
    'linear-gradient(150deg, #f58a9a 0%, #eb4e62 100%)',
    'linear-gradient(150deg, #f7a08f 0%, #e25b6e 100%)',
    'linear-gradient(150deg, #f38e82 0%, #de5e50 100%)',
    'linear-gradient(150deg, #ee6579 0%, #b62c44 100%)',
  ];
  const bgGradient = gradients[index % gradients.length];

  // Tag pill styling based on screenshot
  const renderTag = () => {
    if (event.badge === 'Trending') {
      return (
        <span className="bg-[#eb4e62] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
          Trending
        </span>
      );
    }
    if (event.badge === 'New') {
      return (
        <span className="bg-white text-[#1b1b1f] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
          New
        </span>
      );
    }
    if (event.badge === 'Filling fast' || event.badge === 'Filling Fast') {
      return (
        <span className="bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
          Filling fast
        </span>
      );
    }
    return (
      <span className="bg-white text-[#1b1b1f] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
        {event.badge || 'KS Original'}
      </span>
    );
  };

  return (
    <Link href="#events" className="group w-[210px] shrink-0 block text-left">
      {/* Poster Box */}
      <div
        className="relative h-[210px] rounded-[20px] overflow-hidden p-4 flex flex-col justify-between shadow-xs transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5"
        style={{ backgroundImage: bgGradient }}
      >
        {/* Top-Left Tag Badge */}
        <div>{renderTag()}</div>

        {/* Poster Image (if provided) or Bold Event Name in White */}
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover -z-10"
          />
        ) : (
          <b className="font-heading font-extrabold text-white text-xl sm:text-2xl leading-tight drop-shadow-xs">
            {event.title}
          </b>
        )}
      </div>

      {/* Details Below Poster */}
      <div className="mt-2.5 space-y-0.5">
        <span className="text-[12px] text-[#6b6b76] block">
          {event.city}
        </span>
        <h3 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-[#1b1b1f] tracking-tight truncate group-hover:text-[#eb4e62] transition">
          {event.title}
        </h3>
        <span className="text-[13px] text-[#6b6b76] block truncate">
          {event.date}
        </span>
      </div>
    </Link>
  );
}
