'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './Header';
import Hero from './Hero';
import ArtistCard from './ArtistCard';
import CategoryCard from './CategoryCard';
import EventCard from './EventCard';
import VenueCard from './VenueCard';
import FAQSection from './FAQSection';
import Footer from './Footer';
import {
  mockArtists,
  mockCategories,
  mockEvents,
  mockVenues,
  mockFAQs,
  mockSpotlights,
} from '@/lib/mock-data';

export default function HomeSections() {
  // Platinum Artists: first 4 artists with platinum badge
  const platinumArtists = mockArtists.filter((a) => a.tier === 'platinum').slice(0, 4);

  // New on KalaSquare: 4 artists with new badge
  const newArtists = mockArtists.filter((a) => a.badgeType === 'new').slice(0, 4);

  // Rising Artists: 4 artists with rising badge
  const risingArtists = mockArtists.filter((a) => a.badgeType === 'rising').slice(0, 4);

  // Main featured spotlight and side spotlights
  const mainSpotlight = mockSpotlights[0];
  const sideSpotlights = mockSpotlights.slice(1, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f3f5]">
      {/* 1. Header (Sticky) */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Platinum Artists Section */}
        <section className="py-14 sm:py-18 bg-white border-b border-[#e6e6ea]" id="platinum">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Platinum Artists
                </h2>
                <p className="text-sm text-[#6b6b76] mt-1">
                  India&apos;s finest artists, ready to book.
                </p>
              </div>
              <Link
                href="/top-creators?tier=platinum"
                className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
              >
                <span>View All</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {platinumArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} badgeType="platinum" />
              ))}
            </div>
          </div>
        </section>

        {/* 4. New on KalaSquare Section */}
        <section className="py-14 sm:py-18 bg-[#f3f3f5] border-b border-[#e6e6ea]" id="new-artists">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  New on KalaSquare
                </h2>
                <p className="text-sm text-[#6b6b76] mt-1">
                  Fresh talent and creators who just joined the platform.
                </p>
              </div>
              <Link
                href="/top-creators?sort=newest"
                className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
              >
                <span>See All</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} badgeType="new" />
              ))}
            </div>
          </div>
        </section>

        {/* 5. Find Talent By Category Section */}
        <section className="py-14 sm:py-18 bg-white border-b border-[#e6e6ea]" id="talent">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Find Talent By Category
                </h2>
                <p className="text-sm text-[#6b6b76] mt-1">
                  12 Categories · Pick the kind of performer you need.
                </p>
              </div>
              <Link
                href="/top-creators"
                className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
              >
                <span>All Categories</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* 6 cards in row (desktop), 3 in row (tablet), 2 in row (mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
              {mockCategories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* 6. Stage & Spotlights Section */}
        <section className="py-14 sm:py-18 bg-[#f3f3f5] border-b border-[#e6e6ea]" id="spotlight">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Stage &amp; Spotlights
                </h2>
                <p className="text-sm text-[#6b6b76] mt-1">
                  Featured campaigns, festival stages, and audition calls.
                </p>
              </div>
            </div>

            {/* Layout: Large featured card left (2x width) + 2 small cards right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Large Card (2x width -> 8 cols) */}
              <div className="lg:col-span-8 group relative rounded-[20px] overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-8 text-white shadow-sm hover:shadow-lg transition">
                <Image
                  src={mainSpotlight.imageUrl}
                  alt={mainSpotlight.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                <div className="relative z-10 space-y-3 max-w-xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#eb4e62] text-xs font-bold uppercase tracking-wider text-white">
                    Featured Spotlight
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-4xl leading-tight">
                    {mainSpotlight.title}
                  </h3>
                  {mainSpotlight.subtitle && (
                    <p className="text-white/80 text-sm sm:text-base">
                      {mainSpotlight.subtitle}
                    </p>
                  )}
                  <div className="pt-2">
                    <a
                      href={mainSpotlight.link || '#events'}
                      className="inline-flex items-center h-11 px-6 rounded-[10px] bg-white text-[#eb4e62] font-bold text-sm hover:bg-neutral-100 transition shadow-sm"
                    >
                      View Event &rarr;
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Small Cards (4 cols -> stacked 2 cards) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {sideSpotlights.map((spotlight) => (
                  <div
                    key={spotlight.id}
                    className="group relative rounded-[20px] overflow-hidden flex-1 min-h-[200px] flex flex-col justify-end p-5 sm:p-6 text-white shadow-sm hover:shadow-md transition"
                  >
                    <Image
                      src={spotlight.imageUrl}
                      alt={spotlight.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="relative z-10 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#eb4e62] bg-white/90 px-2 py-0.5 rounded-full inline-block">
                        Auditions &amp; Gigs
                      </span>
                      <h4 className="font-heading font-bold text-lg sm:text-xl leading-snug line-clamp-2">
                        {spotlight.title}
                      </h4>
                      {spotlight.subtitle && (
                        <p className="text-xs text-white/80 line-clamp-1">
                          {spotlight.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. Featured Events Section */}
        <section className="py-14 sm:py-18 bg-white border-b border-[#e6e6ea]" id="events">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Featured Events
                </h2>
                <p className="text-sm text-[#6b6b76] mt-1">
                  Live shows, festivals, and concerts across India.
                </p>
              </div>
              <Link
                href="#events"
                className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
              >
                <span>View All Shows</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>

        {/* 8. Rising Artists Section */}
        <section className="py-14 sm:py-18 bg-[#f3f3f5] border-b border-[#e6e6ea]" id="rising">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Rising Artists
                </h2>
                <p className="text-sm text-[#6b6b76] mt-1">
                  Emerging performers and breakthrough talents to watch.
                </p>
              </div>
              <Link
                href="/top-creators?tier=rising"
                className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
              >
                <span>See All Rising</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {risingArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} badgeType="rising" />
              ))}
            </div>
          </div>
        </section>

        {/* 9. Venues Section */}
        <section className="py-14 sm:py-18 bg-white border-b border-[#e6e6ea]" id="venues">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                  Venues
                </h2>
                <p className="text-sm text-[#6b6b76] mt-1">
                  Stages, clubs, and studios for your next big event.
                </p>
              </div>
              <Link
                href="#venues"
                className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
              >
                <span>All Venues</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </div>
        </section>

        {/* 10. FAQ Section */}
        <FAQSection faqs={mockFAQs} />
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* 12. Enquiry CTA - Sticky Bottom on Mobile Only */}
      <div className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e6e6ea] p-3 shadow-lg flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-bold text-xs text-[#1b1b1f] truncate">Need Artists for an Event?</p>
          <p className="text-[11px] text-[#6b6b76] truncate">Get instant quotes &amp; curated talent</p>
        </div>
        <a
          href="#talent"
          className="flex-shrink-0 h-10 px-5 rounded-[10px] bg-[#eb4e62] text-white text-xs font-bold flex items-center justify-center shadow-sm"
        >
          Send Enquiry
        </a>
      </div>
    </div>
  );
}
