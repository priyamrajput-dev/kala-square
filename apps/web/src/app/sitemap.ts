import { MetadataRoute } from 'next';
import { mockArtists } from '@/lib/mock-data';
import { getApiBaseUrl } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalasquare.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/top-creators`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  let publishedSlugs: string[] = mockArtists.map((a) => a.slug);
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(`${apiUrl}/api/public/artists?limit=100`, {
      signal: AbortSignal.timeout(1000),
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        publishedSlugs = json.data.map((a: any) => a.slug);
      }
    }
  } catch {
    // Fallback to static mock artists
  }

  const artistRoutes: MetadataRoute.Sitemap = publishedSlugs.map((slug) => ({
    url: `${baseUrl}/top-creators/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...artistRoutes];
}
