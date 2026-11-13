'use client';

import React, { useState } from 'react';
import { Ruler, CheckCircle2 } from 'lucide-react';
import { ArtistProfile } from '@/lib/types';

interface ArtistAboutProps {
  artist: ArtistProfile;
}

export default function ArtistAbout({ artist }: ArtistAboutProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const firstName = artist.name.replace(/^Dr\.\s*/, '').split(' ')[0];
  const p = artist.physicalStats;

  const physItems = [
    { label: 'Height', value: p?.height },
    { label: 'Weight', value: p?.weight },
    { label: 'Waist', value: p?.waist },
    { label: 'Chest', value: p?.chest },
    { label: 'Hair Type', value: p?.hairType },
    { label: 'Hair Length', value: p?.hairLength },
    { label: 'Languages', value: p?.languages?.join(', ') },
  ].filter((item) => Boolean(item.value));

  const hasPhysicalStats = physItems.length > 0;
  const isBioLong = (artist.bio?.length || 0) > 350;

  return (
    <section className="scroll-mt-36" id="pp-about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left (2/3 or full): Bio */}
        <div className={hasPhysicalStats ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-4">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
              About {firstName}
            </h2>

            <div
              className={`text-[#6b6b76] text-base leading-relaxed space-y-3 transition-all duration-300 ${
                !isExpanded && isBioLong ? 'line-clamp-4' : ''
              }`}
            >
              {artist.bio ? (
                <p>{artist.bio}</p>
              ) : (
                <p className="italic text-[#6b6b76]/80">No biography added yet.</p>
              )}
            </div>

            {isBioLong && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                <span>{isExpanded ? '↑' : '↓'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right (1/3): Physical Stats Card */}
        {hasPhysicalStats && (
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[20px] p-6 border border-[#e6e6ea] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#fde6ea] flex items-center justify-center text-[#eb4e62]">
                  <Ruler className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1b1b1f]">
                  Physical Stats
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {physItems.map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl bg-[#f6f6f7] flex flex-col justify-between"
                  >
                    <span className="text-xs text-[#6b6b76] font-medium">
                      {item.label}
                    </span>
                    <span className="font-heading font-bold text-sm text-[#1b1b1f] mt-1">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="flex items-center gap-1.5 text-xs text-[#6b6b76] pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#1a8a57] shrink-0" />
                <span>All measurements are current and professionally verified.</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

