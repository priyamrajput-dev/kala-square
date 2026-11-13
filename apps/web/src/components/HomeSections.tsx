'use client';

import React, { useState, useEffect } from 'react';
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
  mockHomeConfig,
} from '@/lib/mock-data';
import { HomeConfig, homeConfigSchema } from '@/lib/validators/home-config';

interface HomeSectionsProps {
  initialData?: any;
}

export default function HomeSections({ initialData }: HomeSectionsProps) {
  const [config, setConfig] = useState<HomeConfig>(initialData?.config || mockHomeConfig);

  // Client-side hydration: sync if initialData changes or fallback to localStorage
  useEffect(() => {
    if (initialData?.config) {
      setConfig(initialData.config);
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('kalasquare_home_config');
        if (raw) {
          const parsed = JSON.parse(raw);
          const validated = homeConfigSchema.safeParse(parsed);
          if (validated.success) {
            setConfig(validated.data);
          }
        }
      } catch (e) {
        console.error('Failed to parse home config from localStorage', e);
      }
    }
  }, [initialData]);

  // Filter Platinum Artists based on API data or config
  const platinumArtists = (
    initialData?.platinumArtists && initialData.platinumArtists.length > 0
      ? initialData.platinumArtists
      : config.platinum.artistIds.length > 0
      ? config.platinum.artistIds
          .map((id: string) => mockArtists.find((a) => a.id === id || a.slug === id))
          .filter(Boolean)
      : mockArtists.filter((a) => a.tier === 'platinum').slice(0, 4)
  ) as typeof mockArtists;

  // Filter New Artists based on API data or config
  const newArtists = (
    initialData?.newArtists && initialData.newArtists.length > 0
      ? initialData.newArtists
      : config.newTalent.artistIds.length > 0
      ? config.newTalent.artistIds
          .map((id: string) => mockArtists.find((a) => a.id === id || a.slug === id))
          .filter(Boolean)
      : mockArtists.filter((a) => a.badgeType === 'new').slice(0, 4)
  ) as typeof mockArtists;

  // Filter Rising Artists based on API data or config
  const risingArtists = (
    initialData?.risingArtists && initialData.risingArtists.length > 0
      ? initialData.risingArtists
      : config.rising.artistIds.length > 0
      ? config.rising.artistIds
          .map((id: string) => mockArtists.find((a) => a.id === id || a.slug === id))
          .filter(Boolean)
      : mockArtists.filter((a) => a.badgeType === 'rising').slice(0, 4)
  ) as typeof mockArtists;

  // Filter Venues based on API data or config
  const selectedVenues = (
    initialData?.venues && initialData.venues.length > 0
      ? initialData.venues
      : config.venues.venueIds.length > 0
      ? config.venues.venueIds
          .map((id: string) => mockVenues.find((v) => v.id === id))
          .filter(Boolean)
      : mockVenues.slice(0, 3)
  ) as typeof mockVenues;

  // Filter Categories based on config
  const visibleCategories = mockCategories
    .filter((cat) => {
      const cfgItem = config.categories.items.find((item) => item.slug === cat.slug);
      return cfgItem ? cfgItem.isVisible : true;
    })
    .map((cat) => {
      const cfgItem = config.categories.items.find((item) => item.slug === cat.slug);
      return cfgItem ? { ...cat, count: cfgItem.count } : cat;
    });

  // Spotlights from config
  const mainSpotlight = {
    id: 's1',
    title: config.spotlights.featuredArticle.title || mockSpotlights[0].title,
    subtitle: config.spotlights.featuredArticle.description || mockSpotlights[0].subtitle,
    imageUrl: config.spotlights.featuredArticle.imageUrl || mockSpotlights[0].imageUrl,
    link: config.spotlights.featuredArticle.link || mockSpotlights[0].link,
  };

  const sideSpotlights = config.spotlights.smallArticles.map((art, idx) => ({
    id: `s-small-${idx}`,
    title: art.title,
    subtitle: art.tag,
    imageUrl: art.imageUrl || mockSpotlights[idx + 1]?.imageUrl || mockSpotlights[0].imageUrl,
    link: art.link || mockSpotlights[idx + 1]?.link || '#',
  }));

  // FAQ list from config
  const displayFaqs = config.faq.items.length > 0 ? config.faq.items : mockFAQs;

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f3f5]">
      {/* 1. Header (Sticky) */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section */}
        {config.hero.isVisible && <Hero heroConfig={config.hero} />}

        {/* 3. Platinum Artists Section */}
        {config.platinum.isVisible && (
          <section className="py-14 sm:py-18 bg-white border-b border-[#e6e6ea]" id="platinum">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                    {config.platinum.title}
                  </h2>
                  <p className="text-sm text-[#6b6b76] mt-1">
                    {config.platinum.subtitle}
                  </p>
                </div>
                <Link
                  href="/top-creators?tier=platinum"
                  className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
                >
                  <span>{config.platinum.viewAllText}</span>
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
        )}

        {/* 4. New on KalaSquare Section */}
        {config.newTalent.isVisible && (
          <section className="py-14 sm:py-18 bg-[#f3f3f5] border-b border-[#e6e6ea]" id="new-artists">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                    {config.newTalent.title}
                  </h2>
                  <p className="text-sm text-[#6b6b76] mt-1">
                    {config.newTalent.subtitle}
                  </p>
                </div>
                <Link
                  href="/top-creators?sort=newest"
                  className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
                >
                  <span>{config.newTalent.viewAllText}</span>
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
        )}

        {/* 5. Find Talent By Category Section */}
        {config.categories.isVisible && (
          <section className="py-14 sm:py-18 bg-white border-b border-[#e6e6ea]" id="talent">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                    {config.categories.title}
                  </h2>
                  <p className="text-sm text-[#6b6b76] mt-1">
                    {config.categories.subtitle}
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

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                {visibleCategories.map((category) => (
                  <CategoryCard key={category.slug} category={category} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. Stage & Spotlights Section */}
        {config.spotlights.isVisible && (
          <section className="py-14 sm:py-18 bg-[#f3f3f5] border-b border-[#e6e6ea]" id="spotlight">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                    {config.spotlights.title}
                  </h2>
                  <p className="text-sm text-[#6b6b76] mt-1">
                    {config.spotlights.subtitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-2xl overflow-hidden border border-[#e6e6ea] shadow-xs flex flex-col justify-between group">
                  <div className="relative w-full h-[260px] sm:h-[340px] overflow-hidden bg-neutral-200">
                    <Image
                      src={mainSpotlight.imageUrl}
                      alt={mainSpotlight.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#eb4e62] text-white shadow-xs">
                        Featured Event
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 space-y-3">
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1b1b1f] group-hover:text-[#eb4e62] transition">
                      {mainSpotlight.title}
                    </h3>
                    <p className="text-sm text-[#6b6b76] leading-relaxed">
                      {mainSpotlight.subtitle}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={mainSpotlight.link || '#'}
                        className="text-xs font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
                      >
                        <span>Learn More &amp; Register</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                  {sideSpotlights.map((side) => (
                    <div
                      key={side.id}
                      className="bg-white rounded-2xl overflow-hidden border border-[#e6e6ea] shadow-xs flex flex-col group flex-1"
                    >
                      <div className="relative w-full h-[150px] overflow-hidden bg-neutral-200">
                        <Image
                          src={side.imageUrl}
                          alt={side.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/70 text-white backdrop-blur-xs">
                            {side.subtitle}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <h4 className="font-heading font-bold text-sm text-[#1b1b1f] group-hover:text-[#eb4e62] transition">
                          {side.title}
                        </h4>
                        <Link
                          href={side.link || '#'}
                          className="text-xs font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1 mt-3"
                        >
                          <span>Explore Details</span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. Featured Events Section */}
        {config.events.isVisible && (
          <section className="py-14 sm:py-18 bg-white border-b border-[#e6e6ea]" id="events">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                    {config.events.title}
                  </h2>
                  <p className="text-sm text-[#6b6b76] mt-1">
                    {config.events.subtitle}
                  </p>
                </div>
                <Link
                  href="#events"
                  className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
                >
                  <span>All Events</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockEvents.slice(0, 4).map((event, idx) => {
                  const cfgBadge = config.events.items[idx]?.badge;
                  const item = cfgBadge && cfgBadge !== 'none' ? { ...event, badge: cfgBadge } : event;
                  return <EventCard key={item.id} event={item} />;
                })}
              </div>
            </div>
          </section>
        )}

        {/* 8. Rising Artists Section */}
        {config.rising.isVisible && (
          <section className="py-14 sm:py-18 bg-[#f3f3f5] border-b border-[#e6e6ea]" id="rising">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                    {config.rising.title}
                  </h2>
                  <p className="text-sm text-[#6b6b76] mt-1">
                    {config.rising.subtitle}
                  </p>
                </div>
                <Link
                  href="/top-creators?tier=rising"
                  className="text-sm font-bold text-[#eb4e62] hover:text-[#d63a50] transition inline-flex items-center gap-1"
                >
                  <span>{config.rising.viewAllText}</span>
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
        )}

        {/* 9. Venues Section */}
        {config.venues.isVisible && (
          <section className="py-14 sm:py-18 bg-white border-b border-[#e6e6ea]" id="venues">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                    {config.venues.title}
                  </h2>
                  <p className="text-sm text-[#6b6b76] mt-1">
                    {config.venues.subtitle}
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
                {selectedVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 10. FAQ Section */}
        {config.faq.isVisible && (
          <FAQSection
            faqs={displayFaqs}
            title={config.faq.title}
            buttonText={config.faq.buttonText}
          />
        )}
      </main>

      {/* 11. Footer */}
      {config.footer.isVisible && <Footer footerConfig={config.footer} />}

      {/* 12. Enquiry CTA - Sticky Bottom on Mobile Only */}
      {config.enquiryCta.isVisible && (
        <div
          className={`${
            config.enquiryCta.mobileOnly ? 'md:hidden' : ''
          } sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e6e6ea] p-3 shadow-lg flex items-center justify-between gap-4`}
        >
          <div className="min-w-0">
            <p className="font-bold text-xs text-[#1b1b1f] truncate">
              {config.enquiryCta.title}
            </p>
            <p className="text-[11px] text-[#6b6b76] truncate">
              {config.enquiryCta.subtext || 'Get instant quotes & curated talent'}
            </p>
          </div>
          <a
            href="#talent"
            className="shrink-0 h-10 px-5 rounded-[10px] bg-[#eb4e62] text-white text-xs font-bold flex items-center justify-center shadow-sm"
          >
            {config.enquiryCta.buttonText}
          </a>
        </div>
      )}
    </div>
  );
}
