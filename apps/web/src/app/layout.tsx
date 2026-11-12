import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import './globals.css';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KalaSquare - Find Artists, Venues & Events in India',
  description:
    'Discover top artists, singers, actors, dancers, venues and events. Book verified talent for your event.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolageGrotesque.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-[#f3f3f5] text-[#1b1b1f] antialiased">
        {children}
      </body>
    </html>
  );
}
