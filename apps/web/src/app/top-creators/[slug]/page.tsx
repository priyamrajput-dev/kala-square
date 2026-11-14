import type { Metadata } from 'next';
import DemoBar from '@/components/DemoBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import KalaMitraWidget from '@/components/KalaMitraWidget';
import { ArtistProfileView } from '@/components/artist';
import { fetchPublicArtistBySlug } from '@/lib/api';
import { mockArtists } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await fetchPublicArtistBySlug(slug);

  if (!artist) {
    return {
      title: 'Artist Profile | KalaSquare',
      description: 'View verified artist profile on KalaSquare.',
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
          url:
            artist.photoUrl ||
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
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

  const socialLinks = Object.values(artist?.social || {}).filter(Boolean) as string[];

  const jsonLd = artist
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: artist.name,
        jobTitle: artist.categories.join(', '),
        image: artist.photoUrl || undefined,
        description: artist.bio,
        address: {
          '@type': 'PostalAddress',
          addressLocality: artist.city,
          addressRegion: artist.state,
          addressCountry: 'IN',
        },
        sameAs: socialLinks,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1b1b1f]">
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Top Kalasquare Live Demo Bar */}
      <DemoBar currentPage="artist" />

      {/* Global Header */}
      <Header />

      {/* Artist Profile View (client component with localStorage fallback) */}
      <ArtistProfileView initialArtist={artist} slug={slug} />

      {/* Floating Kala Mitra AI Guide */}
      <KalaMitraWidget />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

