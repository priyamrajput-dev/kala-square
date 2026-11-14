'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import ArtistForm from './ArtistForm';
import { ArtistFormData } from '@/lib/validators/artist-form';
import { mockArtistProfiles, getArtistProfileBySlug } from '@/lib/mock-data';
import { fetchAdminArtistById } from '@/lib/api';
import { DEFAULT_26_ARTISTS } from './ArtistsTable';

interface ArtistEditClientProps {
  id: string;
}

export default function ArtistEditClient({ id }: ArtistEditClientProps) {
  const [artistData, setArtistData] = useState<Partial<ArtistFormData> | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadArtist = async () => {
      // 1. Check localStorage first
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('kalasquare_admin_artists');
          if (raw) {
            const list: any[] = JSON.parse(raw);
            const normalizedId = String(id).toLowerCase().trim();
            const defaultMatchSlug = DEFAULT_26_ARTISTS.find(
              (d) => d.id.toLowerCase() === normalizedId
            )?.slug.toLowerCase();

            const found = list.find((a) => {
              const aId = a.id ? String(a.id).toLowerCase().trim() : '';
              const aSlug = a.slug ? String(a.slug).toLowerCase().trim() : '';
              return (
                aId === normalizedId ||
                aSlug === normalizedId ||
                (defaultMatchSlug && aSlug === defaultMatchSlug)
              );
            });

            if (found && isMounted) {
              const mapped: Partial<ArtistFormData> = {
                ...found,
                name: found.name || '',
                slug: found.slug || '',
                city: found.city || '',
                state: found.state || '',
                tagline: found.tagline || '',
                bio: found.bio || '',
                photoUrl: found.photoUrl || found.profilePhotoUrl || '',
                coverPhotoUrl: found.coverPhotoUrl || '',
                phone: found.phone || '',
                email: found.email || '',
                categories:
                  Array.isArray(found.categories) && found.categories.length > 0
                    ? found.categories
                    : [found.category || found.cat || 'Singer'].filter(Boolean),
                specializations: Array.isArray(found.specializations)
                  ? found.specializations.join(', ')
                  : found.specializations || '',
                artistClass: found.artistClass || found.tier || 'standard',
                priceNumeric: found.priceNumeric || 0,
                priceLabel: found.priceLabel || '',
                budgetRange: found.budgetRange || found.priceLabel || '',
                isVerified: Boolean(found.isVerified !== undefined ? found.isVerified : found.docs),
                isFeatured: Boolean(found.isFeatured),
                showInAboutUs: Boolean(found.showInAboutUs),
                height: found.height || '',
                weight: found.weight || '',
                waist: found.waist || '',
                chest: found.chest || '',
                hairType: found.hairType || '',
                hairLength: found.hairLength || '',
                languages: Array.isArray(found.languages)
                  ? found.languages
                  : typeof found.languages === 'string' && found.languages.trim()
                  ? found.languages.split(',').map((s: string) => s.trim())
                  : [],
                experienceYears: found.experienceYears ? String(found.experienceYears) : '',
                projectsCount: found.projectsCount ? String(found.projectsCount) : '',
                liveShowsCount: found.liveShowsCount ? String(found.liveShowsCount) : '',
                totalFollowersLabel:
                  found.totalFollowersLabel || (found.fol ? String(found.fol) : ''),
                socialInstagram:
                  found.socialInstagram || found.instagramUrl || found.instagram || found.ig || '',
                socialYouTube:
                  found.socialYouTube || found.youtubeUrl || found.youtube || found.yt || '',
                socialFacebook:
                  found.socialFacebook || found.facebookUrl || found.facebook || found.fb || '',
                socialX: found.socialX || found.xUrl || found.x || '',
                socialSpotify:
                  found.socialSpotify || found.spotifyUrl || found.spotify || '',
                imdbUrl: found.imdbUrl || found.imdb || '',
                fanbaseSpotify: found.fanbaseSpotify || '',
                fanbaseYouTube: found.fanbaseYouTube || '',
                fanbaseInstagram: found.fanbaseInstagram || '',
                fanbaseFacebook: found.fanbaseFacebook || '',
                fanbaseDeezer: found.fanbaseDeezer || '',
                fanbaseSoundCloud: found.fanbaseSoundCloud || '',
                fanbaseTikTok: found.fanbaseTikTok || '',
                gallery: (found.gallery || [])
                  .map((g: any) => (typeof g === 'string' ? g : g.src || ''))
                  .filter(Boolean),
                videos: (found.videos || []).map((v: any) => ({
                  title: v.title || '',
                  url: v.url || '',
                })),
                clips: (found.clips || []).map((c: any) => ({
                  title: c.title || '',
                  url: c.url || '',
                })),
                campaigns: (found.campaigns || []).map((c: any) => ({
                  brandName: c.brandName || c.title || '',
                  category: c.category || '',
                  year: c.year || '',
                  description: c.description || '',
                })),
                awards: (found.awards || []).map((a: any) => ({
                  title: a.title || '',
                  category: a.category || '',
                  year: a.year || '',
                  description: a.description || '',
                })),
                faqs: (found.faqs || []).map((f: any) => ({
                  question: f.question || '',
                  answer: f.answer || '',
                })),
                metaTitle: found.metaTitle || '',
                metaDescription: found.metaDescription || '',
                focusKeyword: found.focusKeyword || found.keywords || '',
                photoAltText: found.photoAltText || '',
                canonicalUrl: found.canonicalUrl || '',
                ogImageUrl: found.ogImageUrl || '',
                allowSearchEngines:
                  found.allowSearchEngines !== undefined
                    ? Boolean(found.allowSearchEngines)
                    : true,
                status:
                  found.status === 'live' ? 'published' : found.status || 'published',
              };
              setArtistData(mapped);
              setLoaded(true);
              return;
            }
          }
        } catch {}
      }

      // 2. Check API
      try {
        const apiArtist = await fetchAdminArtistById(id);
        if (apiArtist && isMounted) {
          setArtistData(apiArtist);
          setLoaded(true);
          return;
        }
      } catch {}

      // 3. Check mock artist profiles
      const profile =
        mockArtistProfiles.find((a) => a.id === id || a.slug === id) ||
        getArtistProfileBySlug(id);

      if (profile && isMounted) {
        const mapped: Partial<ArtistFormData> = {
          name: profile.name,
          slug: profile.slug,
          tagline: profile.tagline || '',
          photoUrl: profile.photoUrl,
          city: profile.city,
          state: profile.state || 'Delhi-NCR',
          phone: profile.phone || '',
          email: profile.email || '',
          artistClass: profile.artistClass,
          isVerified: profile.isVerified,
          isFeatured: true,
          bio: profile.bio,
          languages: profile.physicalStats?.languages || ['Hindi', 'English'],
          specializations: profile.specializations?.join(', ') || '',
          height: profile.physicalStats?.height || '',
          weight: profile.physicalStats?.weight || '',
          waist: profile.physicalStats?.waist || '',
          chest: profile.physicalStats?.chest || '',
          hairType: (profile.physicalStats?.hairType as any) || '',
          hairLength: (profile.physicalStats?.hairLength as any) || '',
          experienceYears: profile.quickStats?.experienceYears || '',
          projectsCount: profile.quickStats?.projectsCount || '',
          liveShowsCount: profile.quickStats?.liveShowsCount || '',
          totalFollowersLabel: profile.quickStats?.totalFollowersLabel || '',
          categories: profile.categories,
          priceNumeric: 50000,
          priceLabel: profile.priceLabel || 'From ₹50,000',
          budgetRange: '₹50,000 - ₹1,00,000',
          socialInstagram: profile.social?.instagram || '',
          socialYouTube: profile.social?.youtube || '',
          socialFacebook: profile.social?.facebook || '',
          socialX: profile.social?.x || '',
          socialSpotify: profile.social?.spotify || '',
          imdbUrl: profile.imdb?.imdbUrl || '',
          fanbaseSpotify: profile.fanbase?.find((f) => f.key === 'fbSp')?.numValue || '',
          fanbaseYouTube: profile.fanbase?.find((f) => f.key === 'fbYt')?.numValue || '',
          fanbaseInstagram: profile.fanbase?.find((f) => f.key === 'fbIg')?.numValue || '',
          fanbaseFacebook: profile.fanbase?.find((f) => f.key === 'fbFb')?.numValue || '',
          fanbaseDeezer: profile.fanbase?.find((f) => f.key === 'fbDz')?.numValue || '',
          fanbaseSoundCloud: profile.fanbase?.find((f) => f.key === 'fbSc')?.numValue || '',
          fanbaseTikTok: profile.fanbase?.find((f) => f.key === 'fbTt')?.numValue || '',
          gallery: (profile.gallery || []).map((g) => (typeof g === 'string' ? g : g.src)),
          videos: (profile.videos || []).map((v) => ({ title: v.title, url: v.url })),
          clips: (profile.clips || []).map((c) => ({ title: c.title, url: c.url })),
          campaigns: (profile.campaigns || []).map((cp) => ({
            brandName: cp.brandName,
            category: cp.category || '',
            year: cp.year || '',
            description: cp.description || '',
          })),
          awards: (profile.awards || []).map((aw) => ({
            title: aw.title,
            category: aw.category || '',
            year: aw.year || '',
            description: aw.description || '',
          })),
          faqs: (profile.faqs || []).map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
          metaTitle: `${profile.name} | KalaSquare`,
          metaDescription: profile.bio?.slice(0, 160) || '',
          focusKeyword: `${profile.name} ${profile.categories[0] || 'artist'}`.toLowerCase(),
          photoAltText: profile.name,
          status: 'published',
        };
        setArtistData(mapped);
        setLoaded(true);
        return;
      }

      // 4. Check DEFAULT_26_ARTISTS
      const defArtist = DEFAULT_26_ARTISTS.find(
        (a) => a.id.toLowerCase() === id.toLowerCase() || a.slug.toLowerCase() === id.toLowerCase()
      );
      if (defArtist && isMounted) {
        const mapped: Partial<ArtistFormData> = {
          name: defArtist.name,
          slug: defArtist.slug,
          city: defArtist.city,
          state: 'India',
          tagline: `${defArtist.cat} · Stage Performer · Entertainer`,
          bio: `${defArtist.name} is a renowned ${defArtist.cat} from ${defArtist.city}, India with a remarkable journey in live performance and entertainment. Handpicked and verified on KalaSquare, ${defArtist.name} delivers unforgettable experiences for private events, brand collaborations, and premier corporate gatherings.`,
          phone: '+91 98765 43210',
          email: `${defArtist.slug}@kalasquare.com`,
          categories: [defArtist.cat],
          specializations: `${defArtist.cat}, Live Shows, Corporate Events`,
          artistClass: defArtist.tier as any,
          isVerified: defArtist.docs,
          totalFollowersLabel: defArtist.fol
            ? defArtist.fol >= 1000
              ? `${Math.round(defArtist.fol / 1000)}k`
              : String(defArtist.fol)
            : '0',
          languages: ['Hindi', 'English'],
          height: "5' 10",
          weight: '68 kg',
          waist: '32 in',
          chest: '40 in',
          hairType: 'Straight',
          hairLength: 'Medium',
          experienceYears: '8',
          projectsCount: '45',
          liveShowsCount: '120+',
          budgetRange: '₹50,000 - ₹1,00,000',
          priceLabel: 'From ₹50,000',
          socialInstagram: `https://instagram.com/${defArtist.slug}`,
          socialYouTube: `https://youtube.com/@${defArtist.slug}`,
          socialFacebook: `https://facebook.com/${defArtist.slug}`,
          fanbaseInstagram: defArtist.fol ? Math.round(defArtist.fol * 0.6) : 30000,
          fanbaseYouTube: defArtist.fol ? Math.round(defArtist.fol * 0.4) : 20000,
          gallery: [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200',
          ],
          videos: [
            { title: 'Live Performance Highlights', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { title: 'Behind the Scenes', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          ],
          clips: [
            { title: 'Stage Energy - 100K+ Views', url: 'https://instagram.com/' },
            { title: 'Acoustic Jam Session', url: 'https://instagram.com/' },
          ],
          metaTitle: `${defArtist.name} - ${defArtist.cat} in ${defArtist.city} | KalaSquare`,
          metaDescription: `Book ${defArtist.name}, ${defArtist.cat} from ${defArtist.city} on KalaSquare. See videos, photos, and reviews, then send an enquiry in one click.`,
          focusKeyword: `${defArtist.name} ${defArtist.cat}`.toLowerCase(),
          photoAltText: defArtist.name,
          status: defArtist.status === 'live' ? 'published' : (defArtist.status as any),
        };
        setArtistData(mapped);
        setLoaded(true);
        return;
      }

      if (isMounted) {
        setLoaded(true);
      }
    };

    loadArtist();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!loaded) {
    return (
      <div className="p-8 text-center text-[#6b6b76] text-sm font-semibold">
        Loading artist details...
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-[#e6e6ea] text-center space-y-4 max-w-lg mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-[#fde6ea] text-[#eb4e62] flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-[#1b1b1f]">
          Artist Profile Not Found
        </h2>
        <p className="text-sm text-[#6b6b76]">
          The artist profile with identifier &ldquo;{id}&rdquo; does not exist or has been removed.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/artists"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#eb4e62] text-white font-bold text-xs shadow-sm hover:bg-[#d63a50] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Artists</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ArtistForm mode="edit" artistId={(artistData as any)?.id || id} initialData={artistData} />;
}
