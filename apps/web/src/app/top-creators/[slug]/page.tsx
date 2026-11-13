import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ArtistHero,
  ArtistTabs,
  ArtistAbout,
  ArtistQuickStats,
  FanbaseChart,
  GalleryLightbox,
  VideoGrid,
  ClipGrid,
  TopSongs,
  CampaignsAwards,
  IMDbSection,
  FAQAccordion,
  ReviewsSection,
  SimilarArtists,
  EnquiryCard,
} from '@/components/artist';
import { fetchPublicArtistBySlug } from '@/lib/api';
import { mockArtists } from '@/lib/mock-data';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'sahil-badal' },
    { slug: 'test-artist' },
    { slug: 'aarav-sharma' },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await fetchPublicArtistBySlug(slug);

  if (!artist) {
    return {
      title: 'Artist Not Found | KalaSquare',
      description: 'The requested artist profile does not exist on KalaSquare.',
    };
  }

  const title = `${artist.name} | KalaSquare`;
  const description = artist.bio?.slice(0, 160) || '';
  const canonicalUrl = `https://kalasquare.com/top-creators/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: artist.photoUrl,
          width: 800,
          height: 800,
          alt: artist.name,
        },
      ],
      type: 'profile',
    },
  };
}

export default async function ArtistProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const artist = await fetchPublicArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  const socialLinks = Object.values(artist.social || {}).filter(Boolean) as string[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.name,
    jobTitle: artist.categories.join(', '),
    image: artist.photoUrl,
    description: artist.bio,
    address: {
      '@type': 'PostalAddress',
      addressLocality: artist.city,
      addressRegion: artist.state,
      addressCountry: 'IN',
    },
    sameAs: socialLinks,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f3f5] text-[#1b1b1f]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Global Header */}
      <Header />

      {/* 1. Hero Section */}
      <ArtistHero artist={artist} />

      {/* 2. Sticky Profile Tabs */}
      <ArtistTabs artist={artist} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): All profile sections */}
          <div className="lg:col-span-8 space-y-8 min-w-0">
            {/* 4. Quick Stats (Snapshot of journey) */}
            <ArtistQuickStats stats={artist.quickStats || (artist as any).stats} />

            {/* 3. About + Physical Stats */}
            <ArtistAbout artist={artist} />

            {/* 5. Fanbase Distribution (Donut Chart + Cards) */}
            <FanbaseChart fanbase={artist.fanbase} />

            {/* 6. Photo Gallery + Lightbox Modal */}
            <GalleryLightbox gallery={artist.gallery} />

            {/* 7. Latest Videos (YouTube) */}
            <VideoGrid videos={artist.videos} />

            {/* 8. Short Clips / Reels */}
            <ClipGrid clips={artist.clips} />

            {/* 9. Top Songs (Singer only) */}
            <TopSongs categories={artist.categories} songs={artist.topSongs} />

            {/* 10. Previous Campaigns + Awards */}
            <CampaignsAwards campaigns={artist.campaigns} awards={artist.awards} />

            {/* 11. IMDb (Actor only) */}
            <IMDbSection categories={artist.categories} imdb={artist.imdb} />

            {/* 12. FAQs (Platinum only) */}
            <FAQAccordion
              artistClass={artist.artistClass}
              artistName={artist.name}
              faqs={artist.faqs}
            />

            {/* 13. Reviews & Ratings */}
            <ReviewsSection
              rating={artist.rating}
              reviewsCount={artist.reviewsCount || (artist as any).reviewCount || 20}
              reviews={artist.reviews}
            />
          </div>

          {/* Right Column (4 cols): Sticky Enquiry Sidebar */}
          <div className="lg:col-span-4 w-full">
            <EnquiryCard artist={artist} />
          </div>
        </div>

        {/* 14. Similar Artists Section */}
        <div className="mt-12">
          <SimilarArtists currentArtist={artist} allArtists={mockArtists} />
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
