import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section
      className="overflow-hidden border-b border-[#e6e6ea]"
      style={{
        background: 'radial-gradient(900px 520px at 72% 35%, #FFE9ED, transparent 70%), #FFFFFF',
      }}
    >
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtext, Buttons */}
          <div className="lg:col-span-6 space-y-4">
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[54px] text-[#1b1b1f] tracking-tight leading-[1.06]">
              <span className="block">Where India&apos;s</span>
              <span className="block text-[#eb4e62]">Creative</span>
              <span className="block">Industry Connects</span>
            </h1>

            {/* Coral Bar Underline */}
            <div className="w-24 h-1 rounded-full bg-[#eb4e62] my-4" />

            <p className="text-[17px] text-[#6b6b76] max-w-md leading-relaxed">
              Discover artists, venues, events, gigs and collaborations, all in one place.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="#talent"
                className="h-11 px-6 rounded-[10px] bg-[#eb4e62] hover:bg-[#d63a50] text-white font-heading font-bold text-sm transition flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(235,78,98,0.8)]"
              >
                Explore talent
              </Link>
              <button
                type="button"
                className="h-11 px-6 rounded-[10px] bg-white border border-[#e6e6ea] hover:border-[#eb4e62] text-[#1b1b1f] font-heading font-bold text-sm transition flex items-center justify-center shadow-xs cursor-pointer"
              >
                Join as artist
              </button>
            </div>
          </div>

          {/* Right Column: Visual Collage (.mw) */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[520px] aspect-[1.42] select-none">
              {/* Dotted Grid Decoration in bottom-left */}
              <div className="absolute -bottom-4 left-6 grid grid-cols-6 gap-2 opacity-35 pointer-events-none z-0">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#6b6b76]" />
                ))}
              </div>

              {/* Tile 1: Top-Left Singer (Microphone icon) */}
              <div
                className="absolute left-[3%] top-0 w-[39%] h-[62%] rounded-[22px] overflow-hidden flex items-center justify-center shadow-lg -rotate-2"
                style={{
                  backgroundImage: 'linear-gradient(150deg, #f58a9a 0%, #eb4e62 100%)',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12 text-white stroke-current fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
                >
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                </svg>
              </div>

              {/* Tile 2: Top-Right Star icon */}
              <div
                className="absolute right-0 top-[7%] w-[27%] h-[48%] rounded-[22px] overflow-hidden flex items-center justify-center shadow-lg rotate-3"
                style={{
                  backgroundImage: 'linear-gradient(150deg, #f7a08f 0%, #d63a50 100%)',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-10 h-10 text-white stroke-current fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
                >
                  <path d="M12 3l2.5 5.5 6 .7-4.5 4 1.3 6L12 16.3 6.7 19.2 8 13.2 3.5 9.2l6-.7z" />
                </svg>
              </div>

              {/* Tile 3: Bottom-Left Camera icon */}
              <div
                className="absolute left-[15%] bottom-0 w-[42%] h-[42%] rounded-[22px] overflow-hidden flex items-center justify-center shadow-lg -rotate-[1.5deg]"
                style={{
                  backgroundImage: 'linear-gradient(150deg, #ee6579 0%, #b62c44 100%)',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-10 h-10 text-white stroke-current fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
                >
                  <rect x="3" y="7" width="18" height="12" rx="3" />
                  <circle cx="12" cy="13" r="3.5" />
                  <path d="M8 7l1.5-2.5h5L16 7" />
                </svg>
              </div>

              {/* Tile 4: Bottom-Right Crowd icon */}
              <div
                className="absolute right-0 bottom-[1%] w-[36%] h-[40%] rounded-[22px] overflow-hidden flex items-center justify-center shadow-lg rotate-2"
                style={{
                  backgroundImage: 'linear-gradient(150deg, #f0647a 0%, #c23048 100%)',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-10 h-10 text-white stroke-current fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
                >
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 5.5a3 3 0 0 1 0 5.5M17 14.5c2.3.7 4 2.8 4 5.5" />
                </svg>
              </div>

              {/* Overlapping Card 1: Venue Card (.vc) */}
              <div className="absolute left-[43%] -top-[2%] w-[27%] h-[50%] bg-white rounded-[20px] p-2 shadow-2xl rotate-2 z-10 border border-[#e6e6ea]/60">
                <div
                  className="h-[68%] rounded-[14px] flex items-center justify-center relative shadow-inner"
                  style={{
                    backgroundImage: 'linear-gradient(150deg, #f58a9a 0%, #eb4e62 60%, #c23048 100%)',
                  }}
                >
                  <span className="absolute top-2 left-2 bg-[#eb4e62] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Popular venue
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-white stroke-current fill-none stroke-[1.6]"
                  >
                    <path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" />
                  </svg>
                </div>
                <div className="pt-2 px-1">
                  <b className="font-heading font-extrabold text-[13px] text-[#1b1b1f] block truncate">
                    Rasā – The Stage
                  </b>
                  <small className="text-[11px] text-[#6b6b76] block truncate">
                    Mumbai
                  </small>
                </div>
              </div>

              {/* Overlapping Card 2: Artist Card (.pc) */}
              <Link
                href="/top-creators/jai-vijay-sachan"
                className="absolute -left-[5%] top-[50%] w-[42%] bg-white hover:border-[#eb4e62] transition-all rounded-[18px] p-3 shadow-2xl flex items-center gap-3 z-20 border border-[#e6e6ea]/60 group cursor-pointer"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                    alt="Jai Vijay Sachan"
                    fill
                    className="object-cover group-hover:scale-105 transition"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <b className="font-heading font-extrabold text-[14px] text-[#1b1b1f] group-hover:text-[#eb4e62] transition block truncate">
                    Jai Vijay Sachan
                  </b>
                  <em className="text-[11.5px] text-[#eb4e62] font-bold not-italic block truncate">
                    Actor
                  </em>
                  <span className="text-[11px] text-[#6b6b76] block truncate">
                    Delhi
                  </span>
                  <span className="text-[11px] text-[#1b1b1f] font-semibold block truncate">
                    ✓ Platinum artist
                  </span>
                </div>
              </Link>

              {/* Overlapping Card 3: Dark Opportunity Card (.dk) */}
              <div className="absolute left-[47%] top-[50%] w-[25%] bg-[#17171c] text-white rounded-[16px] p-3 shadow-2xl rotate-1 z-30">
                <small className="text-[11px] font-bold text-[#eb4e62] block">
                  Looking for
                </small>
                <b className="font-heading font-extrabold text-[14px] leading-tight block mt-1">
                  Anchor needed for corporate show
                </b>
                <span className="text-[11px] text-white/70 block mt-1">
                  Delhi
                </span>
                <Link
                  href="#events"
                  className="block mt-2.5 bg-[#eb4e62] text-center text-white text-[11px] font-bold py-1.5 rounded-md hover:bg-[#d63a50] transition"
                >
                  View details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
