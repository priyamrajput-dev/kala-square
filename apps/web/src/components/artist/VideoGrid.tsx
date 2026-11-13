import React from 'react';
import Image from 'next/image';
import { Play, ExternalLink } from 'lucide-react';
import { VideoItem } from '@/lib/types';

interface VideoGridProps {
  videos: VideoItem[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="scroll-mt-36 bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6" id="pp-videos">
      <div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
          Latest Videos
        </h2>
        <p className="text-sm text-[#6b6b76] mt-1">
          Interviews, performances, live concert recordings, and talks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((vid) => {
          const thumbnail = vid.youtubeId
            ? `https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`
            : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80';

          return (
            <a
              key={vid.id}
              href={vid.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden border border-[#e6e6ea] hover:border-[#eb4e62] bg-[#f6f6f7] shadow-xs hover:shadow-md transition duration-300"
            >
              {/* Video Thumbnail with Play Button */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/20">
                <Image
                  src={thumbnail}
                  alt={vid.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/95 group-hover:bg-[#eb4e62] text-[#eb4e62] group-hover:text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </div>

                {vid.views && (
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 text-[11px] font-semibold text-white">
                    {vid.views}
                  </span>
                )}
              </div>

              {/* Video Info */}
              <div className="p-4 space-y-1">
                <h3 className="font-heading font-bold text-sm text-[#1b1b1f] group-hover:text-[#eb4e62] transition line-clamp-2">
                  {vid.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#eb4e62]">
                  <span>Watch now</span>
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

