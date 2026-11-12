import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { EventItem } from '@/lib/types';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  const badgeClasses: Record<string, string> = {
    Trending: 'bg-[#eb4e62] text-white',
    New: 'bg-[#1a8a57] text-white',
    'Filling Fast': 'bg-[#d97706] text-white',
    'KS Original': 'bg-[#1b1b1f] text-white',
  };

  const badgeClass = badgeClasses[event.badge] || 'bg-[#1b1b1f] text-white';

  return (
    <div className="group relative bg-white rounded-[18px] border border-[#e6e6ea] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Poster Image Container */}
      <div className="relative aspect-[16/10] w-full bg-[#f6f6f7] overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top-Left Badge */}
        {event.badge !== 'none' && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${badgeClass}`}>
              {event.badge}
            </span>
          </div>
        )}

        {/* Bottom Poster Info (Date & City on image) */}
        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{event.city}</span>
          </span>
          <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <Calendar className="h-3 w-3" />
            <span>{event.date}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-bold text-base text-[#1b1b1f] group-hover:text-[#eb4e62] transition line-clamp-1">
            {event.title}
          </h3>
          {event.venueName && (
            <p className="text-xs text-[#6b6b76] mt-1 truncate">
              Venue: {event.venueName}
            </p>
          )}
          {event.description && (
            <p className="text-xs text-[#6b6b76] mt-1.5 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[#f6f6f7] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#eb4e62]">
            Book Show &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
