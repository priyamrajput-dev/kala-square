import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { ClipItem } from '@/lib/types';

interface ClipGridProps {
  clips: ClipItem[];
}

export default function ClipGrid({ clips }: ClipGridProps) {
  if (!clips || clips.length === 0) return null;

  // Background gradients for reel cards
  const gradients = [
    'from-[#eb4e62]/90 to-[#b82a3d]',
    'from-[#3b82f6]/90 to-[#1d4ed8]',
    'from-[#8b5cf6]/90 to-[#6d28d9]',
    'from-[#f59e0b]/90 to-[#d97706]',
  ];

  return (
    <section className="scroll-mt-36 bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6" id="pp-reels">
      <div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
          Reels &amp; short clips
        </h2>
        <p className="text-sm text-[#6b6b76] mt-1">
          Quick moments from shows, rehearsals, backstage experiments, and viral clips.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {clips.map((clip, idx) => {
          const grad = gradients[idx % gradients.length];

          return (
            <a
              key={clip.id}
              href={clip.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-gradient-to-br ${grad} p-4 flex flex-col justify-between text-white shadow-xs hover:shadow-lg transition-transform duration-300 hover:-translate-y-1`}
            >
              {/* Play Icon Top Right */}
              <div className="flex justify-end">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:bg-white group-hover:text-[#eb4e62] transition">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </div>
              </div>

              {/* Clip Title & External Link Bottom */}
              <div className="space-y-1.5 z-10">
                <p className="font-heading font-bold text-xs sm:text-sm line-clamp-3 leading-snug">
                  {clip.title}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/80 group-hover:text-white transition">
                  <span>Watch clip</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </span>
              </div>

              {/* Decorative Subtle Pattern */}
              <div className="absolute inset-0 bg-radial from-transparent to-black/30 pointer-events-none" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
