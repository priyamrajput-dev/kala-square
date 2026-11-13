import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kalasquare.com'),
  title: 'KalaSquare - Find Artists, Venues & Events in India',
  description:
    'Discover top artists, singers, actors, dancers, venues and events. Book verified talent for your event.',
  openGraph: {
    title: 'KalaSquare - Find Artists, Venues & Events in India',
    description: 'Discover top artists, singers, actors, dancers, venues and events. Book verified talent for your event.',
    url: 'https://kalasquare.com',
    siteName: 'KalaSquare',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=630&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'KalaSquare Talent Network',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KalaSquare - Find Artists, Venues & Events in India',
    description: 'Discover top artists, singers, actors, dancers, venues and events. Book verified talent for your event.',
    images: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=630&fit=crop&q=80'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#f3f3f5] text-[#1b1b1f] antialiased">
        {children}
      </body>
    </html>
  );
}
