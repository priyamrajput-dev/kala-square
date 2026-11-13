import type { Metadata } from 'next';
import HomeSections from '@/components/HomeSections';
import { fetchPublicHome } from '@/lib/api';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'KalaSquare - Find Artists, Venues & Events in India',
  description:
    'Discover top artists, singers, actors, dancers, venues and events. Book verified talent for your event.',
};

export default async function HomePage() {
  const homeData = await fetchPublicHome();
  return <HomeSections initialData={homeData} />;
}
