import type { Metadata } from 'next';
import HomeSections from '@/components/HomeSections';

export const metadata: Metadata = {
  title: 'KalaSquare - Find Artists, Venues & Events in India',
  description:
    'Discover top artists, singers, actors, dancers, venues and events. Book verified talent for your event.',
};

export default function HomePage() {
  return <HomeSections />;
}
