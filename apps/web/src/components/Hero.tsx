import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Music2, Mic, Video, Palette, MapPin, Briefcase } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-[#f3f3f5] py-12 md:py-20 overflow-hidden border-b border-[#e6e6ea]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtext, Buttons, Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fde6ea] text-[#eb4e62] text-xs font-bold tracking-wider uppercase">
              <span>DISCOVER &amp; HIRE VERIFIED ARTISTS</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[54px] text-[#1b1b1f] tracking-tight leading-[1.08]">
              Book India&apos;s Top Talent For Your Next Big Event
            </h1>

            <p className="text-lg text-[#6b6b76] max-w-xl leading-relaxed">
              Directly connect with 12,000+ curated performers, musicians, comedians, and creators. Transparent pricing, verified reviews, seamless booking.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/top-creators"
                className="h-12 px-7 rounded-[10px] bg-[#eb4e62] hover:bg-[#d63a50] text-white font-bold text-base transition flex items-center justify-center shadow-sm"
              >
                Explore Artists
              </Link>
              <Link
                href="/admin"
                className="h-12 px-7 rounded-[10px] bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-[#1b1b1f] font-bold text-base transition flex items-center justify-center shadow-sm"
              >
                List Your Talent
              </Link>
            </div>

            {/* Quick Stats: 12,000+ Verified Artists, 850+ Live Venues, 4.9★ Average Rating */}
            <div className="pt-8 border-t border-[#e6e6ea] grid grid-cols-3 gap-6">
              <div>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f]">12,000+</p>
                <p className="text-xs sm:text-sm text-[#6b6b76] mt-0.5">Verified Artists</p>
              </div>
              <div>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f]">850+</p>
                <p className="text-xs sm:text-sm text-[#6b6b76] mt-0.5">Live Venues</p>
              </div>
              <div>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f]">4.9★</p>
                <p className="text-xs sm:text-sm text-[#6b6b76] mt-0.5">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Gradient Tiles + 3 Overlapping Floating Cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[500px] h-[460px] sm:h-[480px]">
              {/* 2x2 Grid of Gradient Tiles */}
              <div className="grid grid-cols-2 gap-4 w-full h-full p-2">
                {/* Tile 1: Music note icon, Coral gradient */}
                <div className="gradient-hero-1 rounded-[20px] p-6 flex flex-col justify-between text-white shadow-sm transition hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Music2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-sm">Singers &amp; Musicians</span>
                </div>

                {/* Tile 2: Mic icon, Orange gradient */}
                <div className="gradient-hero-2 rounded-[20px] p-6 flex flex-col justify-between text-white shadow-sm transition hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-sm">Stand-up &amp; Emcees</span>
                </div>

                {/* Tile 3: Video / Camera icon, Blue gradient */}
                <div className="gradient-hero-3 rounded-[20px] p-6 flex flex-col justify-between text-white shadow-sm transition hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-sm">Dancers &amp; Actors</span>
                </div>

                {/* Tile 4: Palette icon, Violet gradient */}
                <div className="gradient-hero-4 rounded-[20px] p-6 flex flex-col justify-between text-white shadow-sm transition hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-sm">Creators &amp; Visual</span>
                </div>
              </div>

              {/* Overlapping Card 1: Artist card - Sahil Badal, Singer, "Featured Artist" */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-white rounded-[16px] p-3.5 shadow-xl border border-[#e6e6ea] flex items-center gap-3.5 w-64 z-20 animate-fade-in">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#f6f6f7]">
                  <Image
                    src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&auto=format&fit=crop&q=80"
                    alt="Sahil Badal"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-[#eb4e62]">
                    Featured Artist
                  </span>
                  <h4 className="font-bold text-sm text-[#1b1b1f] truncate">Sahil Badal</h4>
                  <p className="text-xs text-[#6b6b76] truncate">Singer · Delhi-NCR</p>
                </div>
              </div>

              {/* Overlapping Card 2: Venue card - Siri Fort Auditorium, Delhi, "Top Venue" */}
              <div className="absolute bottom-16 -left-3 sm:-left-5 bg-white rounded-[16px] p-3.5 shadow-xl border border-[#e6e6ea] flex items-center gap-3 w-64 z-20">
                <div className="w-11 h-11 rounded-xl bg-[#fde6ea] flex items-center justify-center flex-shrink-0 text-[#eb4e62]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#eb4e62]">Top Venue</span>
                  <h4 className="font-bold text-sm text-[#1b1b1f] truncate">Siri Fort Auditorium</h4>
                  <p className="text-xs text-[#6b6b76]">Delhi · 1,865 Capacity</p>
                </div>
              </div>

              {/* Overlapping Card 3: Opportunity card - "Bollywood Playback", Delhi, "Live Audition" */}
              <div className="absolute -bottom-4 right-6 bg-white rounded-[16px] p-3.5 shadow-xl border border-[#e6e6ea] flex items-center gap-3 w-64 z-20">
                <div className="w-10 h-10 rounded-xl bg-[#f6f6f7] flex items-center justify-center flex-shrink-0 text-[#1b1b1f]">
                  <Briefcase className="h-5 w-5 text-[#eb4e62]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#eb4e62]">Live Audition</span>
                  <h4 className="font-bold text-xs text-[#1b1b1f] truncate">Bollywood Playback</h4>
                  <p className="text-xs text-[#6b6b76]">Delhi · Open Call</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
