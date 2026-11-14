'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';

import {
  artistFormSchema,
  ArtistFormData,
} from '@/lib/validators/artist-form';
import { calculateCompleteness } from '@/lib/completeness';
import { createArtist, updateArtist } from '@/lib/api';

interface ArtistFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<ArtistFormData>;
  artistId?: string;
}

const CATEGORY_CHIPS = [
  'Actor',
  'Anchors',
  'Dancer',
  'Fitness',
  'Food Vloggers',
  'Gaming',
  'Influencer',
  'Models',
  'Poets',
  'Singer',
  'Speaker',
  'Standup Comedy',
  'Writer',
];

const CITY_OPTIONS = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Haryana',
  'Varanasi',
  'Lucknow',
  'Kolkata',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Jaipur',
  'Chandigarh',
  'Goa',
  'Other',
];

const CLASS_OPTIONS = [
  { value: 'standard', label: 'Standard · No badge' },
  { value: 'rising', label: 'Rising · Blue tick' },
  { value: 'platinum', label: 'Platinum · Golden badge' },
  { value: 'emerging', label: 'Emerging · Blue tick' },
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Not set' },
  { value: 'Under ₹25,000', label: 'Under ₹25,000' },
  { value: '₹25,000 - ₹50,000', label: '₹25,000 - ₹50,000' },
  { value: '₹50,000 - ₹1,00,000', label: '₹50,000 - ₹1,00,000' },
  { value: '₹1,00,000 - ₹2,00,000', label: '₹1,00,000 - ₹2,00,000' },
  { value: '₹2,00,000+', label: '₹2,00,000+' },
];

export default function ArtistForm({ mode, initialData, artistId }: ArtistFormProps) {
  const router = useRouter();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLowCompletenessModal, setShowLowCompletenessModal] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<ArtistFormData | null>(null);
  const [, setSlugTouched] = useState(false);

  // Profile photo state (dedicated state for instant visual preview)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>(initialData?.photoUrl || '');

  // Gallery array
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    (initialData?.gallery || []).map((g) => (typeof g === 'string' ? g : (g.src || ''))).filter(Boolean)
  );

  // Videos array (starts empty on new profile matching manager.html newForm)
  const [videosList, setVideosList] = useState<{ title: string; url: string }[]>(
    initialData?.videos?.length
      ? initialData.videos.map((v) => ({ title: v.title || '', url: v.url || '' }))
      : [{ title: '', url: '' }]
  );

  // Clips array (starts empty on new profile matching manager.html newForm)
  const [clipsList, setClipsList] = useState<{ title: string; url: string }[]>(
    initialData?.clips?.length
      ? initialData.clips.map((c) => ({ title: c.title || '', url: c.url || '' }))
      : [{ title: '', url: '' }]
  );

  // Campaigns array
  const [campaignsList, setCampaignsList] = useState<{ brandName: string; category: string; year: string }[]>(
    (initialData?.campaigns || []).map((c) => ({
      brandName: c.brandName || '',
      category: c.category || '',
      year: c.year || '',
    }))
  );

  // Awards array
  const [awardsList, setAwardsList] = useState<{ title: string; category: string; year: string }[]>(
    (initialData?.awards || []).map((a) => ({
      title: a.title || '',
      category: a.category || '',
      year: a.year || '',
    }))
  );

  // FAQs array
  const [faqsList, setFaqsList] = useState<{ question: string; answer: string }[]>(
    (initialData?.faqs || []).map((f) => ({
      question: f.question || '',
      answer: f.answer || '',
    }))
  );

  // Native Local Image Picker Refs & Upload States
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const shareImageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingShare, setIsUploadingShare] = useState(false);

  const uploadFile = async (file: File): Promise<string> => {
    // Generate an instant DataURL fallback
    const dataUrlPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = typeof window !== 'undefined' ? localStorage.getItem('kalasquare_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // 4-second timeout to prevent any hanging if network/backend is unreachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${apiUrl}/api/admin/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          return json.url.startsWith('http') ? json.url : `${apiUrl}${json.url}`;
        }
      }
    } catch {}

    // Fallback to local DataURL for instant display
    return await dataUrlPromise;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      tagline: initialData?.tagline || '',
      photoUrl: initialData?.photoUrl || '',
      coverPhotoUrl: initialData?.coverPhotoUrl || '',
      bio: initialData?.bio || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      categories: initialData?.categories || [],
      specializations: Array.isArray(initialData?.specializations)
        ? initialData?.specializations.join(', ')
        : (initialData?.specializations as any) || '',
      artistClass: initialData?.artistClass || 'standard',
      priceNumeric: initialData?.priceNumeric || 0,
      priceLabel: initialData?.priceLabel || '',
      budgetRange: initialData?.budgetRange || '',
      isVerified: initialData?.isVerified ?? false,
      isFeatured: initialData?.isFeatured ?? false,
      showInAboutUs: initialData?.showInAboutUs ?? false,
      height: initialData?.height || '',
      weight: initialData?.weight || '',
      waist: initialData?.waist || '',
      chest: initialData?.chest || '',
      hairType: initialData?.hairType || '',
      hairLength: initialData?.hairLength || '',
      languages: initialData?.languages || [],
      experienceYears: initialData?.experienceYears || '',
      projectsCount: initialData?.projectsCount || '',
      liveShowsCount: initialData?.liveShowsCount || '',
      totalFollowersLabel: initialData?.totalFollowersLabel || '',
      socialInstagram: initialData?.socialInstagram || '',
      socialYouTube: initialData?.socialYouTube || '',
      socialFacebook: initialData?.socialFacebook || '',
      socialX: initialData?.socialX || '',
      socialSpotify: initialData?.socialSpotify || '',
      fanbaseSpotify: initialData?.fanbaseSpotify || '',
      fanbaseYouTube: initialData?.fanbaseYouTube || '',
      fanbaseInstagram: initialData?.fanbaseInstagram || '',
      fanbaseFacebook: initialData?.fanbaseFacebook || '',
      fanbaseDeezer: initialData?.fanbaseDeezer || '',
      fanbaseSoundCloud: initialData?.fanbaseSoundCloud || '',
      fanbaseTikTok: initialData?.fanbaseTikTok || '',
      metaTitle: initialData?.metaTitle || '',
      metaDescription: initialData?.metaDescription || '',
      focusKeyword: initialData?.focusKeyword || '',
      photoAltText: initialData?.photoAltText || '',
      canonicalUrl: initialData?.canonicalUrl || '',
      ogImageUrl: initialData?.ogImageUrl || '',
      allowSearchEngines: initialData?.allowSearchEngines ?? true,
      status: initialData?.status || 'published',
    },
  });

  const formValues = watch();

  // Auto-slugify name
  const nameValue = watch('name');
  useEffect(() => {
    if (mode === 'create' && nameValue) {
      const generated = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generated);
    }
  }, [nameValue, mode, setValue]);

  // Synchronize form when initialData is loaded or changed
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        slug: initialData.slug || '',
        tagline: initialData.tagline || '',
        photoUrl: initialData.photoUrl || '',
        coverPhotoUrl: initialData.coverPhotoUrl || '',
        bio: initialData.bio || '',
        city: initialData.city || '',
        state: initialData.state || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        categories: initialData.categories || [],
        specializations: Array.isArray(initialData.specializations)
          ? initialData.specializations.join(', ')
          : (initialData.specializations as any) || '',
        artistClass: initialData.artistClass || 'standard',
        priceNumeric: initialData.priceNumeric || 0,
        priceLabel: initialData.priceLabel || '',
        budgetRange: initialData.budgetRange || '',
        isVerified: initialData.isVerified ?? false,
        isFeatured: initialData.isFeatured ?? false,
        showInAboutUs: initialData.showInAboutUs ?? false,
        height: initialData.height || '',
        weight: initialData.weight || '',
        waist: initialData.waist || '',
        chest: initialData.chest || '',
        hairType: initialData.hairType || '',
        hairLength: initialData.hairLength || '',
        languages: initialData.languages || [],
        experienceYears: initialData.experienceYears || '',
        projectsCount: initialData.projectsCount || '',
        liveShowsCount: initialData.liveShowsCount || '',
        totalFollowersLabel: initialData.totalFollowersLabel || '',
        socialInstagram: initialData.socialInstagram || '',
        socialYouTube: initialData.socialYouTube || '',
        socialFacebook: initialData.socialFacebook || '',
        socialX: initialData.socialX || '',
        socialSpotify: initialData.socialSpotify || '',
        fanbaseSpotify: initialData.fanbaseSpotify || '',
        fanbaseYouTube: initialData.fanbaseYouTube || '',
        fanbaseInstagram: initialData.fanbaseInstagram || '',
        fanbaseFacebook: initialData.fanbaseFacebook || '',
        fanbaseDeezer: initialData.fanbaseDeezer || '',
        fanbaseSoundCloud: initialData.fanbaseSoundCloud || '',
        fanbaseTikTok: initialData.fanbaseTikTok || '',
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
        focusKeyword: initialData.focusKeyword || '',
        photoAltText: initialData.photoAltText || '',
        canonicalUrl: initialData.canonicalUrl || '',
        ogImageUrl: initialData.ogImageUrl || '',
        allowSearchEngines: initialData.allowSearchEngines ?? true,
        status: initialData.status || 'published',
      });
      setProfilePhotoUrl(initialData.photoUrl || '');
      if (initialData.gallery && initialData.gallery.length > 0) {
        setGalleryUrls(
          initialData.gallery.map((g) => (typeof g === 'string' ? g : (g.src || ''))).filter(Boolean)
        );
      }
      if (initialData.videos && initialData.videos.length > 0) {
        setVideosList(initialData.videos.map((v) => ({ title: v.title || '', url: v.url || '' })));
      }
      if (initialData.clips && initialData.clips.length > 0) {
        setClipsList(initialData.clips.map((c) => ({ title: c.title || '', url: c.url || '' })));
      }
      if (initialData.campaigns && initialData.campaigns.length > 0) {
        setCampaignsList(
          initialData.campaigns.map((c) => ({
            brandName: c.brandName || '',
            category: c.category || '',
            year: c.year || '',
          }))
        );
      }
      if (initialData.awards && initialData.awards.length > 0) {
        setAwardsList(
          initialData.awards.map((a) => ({
            title: a.title || '',
            category: a.category || '',
            year: a.year || '',
          }))
        );
      }
      if (initialData.faqs && initialData.faqs.length > 0) {
        setFaqsList(
          initialData.faqs.map((f) => ({
            question: f.question || '',
            answer: f.answer || '',
          }))
        );
      }
    }
  }, [initialData, reset]);

  // Completeness score
  const completeness = useMemo(() => {
    return calculateCompleteness({
      ...formValues,
      photoUrl: profilePhotoUrl || formValues.photoUrl,
      gallery: galleryUrls,
      videos: videosList,
      clips: clipsList,
      campaigns: campaignsList,
      awards: awardsList,
      faqs: faqsList,
    });
  }, [formValues, profilePhotoUrl, galleryUrls, videosList, clipsList, campaignsList, awardsList, faqsList]);

  // Live SEO score calculation matching manager.html lines 1558-1564
  const seoRes = useMemo(() => {
    const kw = (formValues.focusKeyword || '').trim().toLowerCase();
    const t = (formValues.metaTitle || '').trim();
    const d = (formValues.metaDescription || '').trim();
    const og = (formValues.ogImageUrl || '').trim();
    const alt = (formValues.photoAltText || '').trim();

    const items: [number, boolean, string][] = [
      [20, t.length >= 30 && t.length <= 60, 'Title is 30 to 60 characters'],
      [20, d.length >= 70 && d.length <= 160, 'Description is 70 to 160 characters'],
      [15, !!kw, 'Focus keyword is set'],
      [15, !!kw && t.toLowerCase().includes(kw), 'Keyword appears in the title'],
      [10, !!kw && d.toLowerCase().includes(kw), 'Keyword appears in the description'],
      [10, !!og, 'Share image is added'],
      [10, !!alt, 'Photo alt text is set'],
    ];

    const score = items.reduce((acc, x) => acc + (x[1] ? x[0] : 0), 0);
    const label = score >= 80 ? 'Good' : score >= 50 ? 'Needs work' : 'Poor';
    const cls = score >= 80 ? 'ok' : score >= 50 ? 'warn' : 'bad';

    return { score, items, label, cls };
  }, [
    formValues.focusKeyword,
    formValues.metaTitle,
    formValues.metaDescription,
    formValues.ogImageUrl,
    formValues.photoAltText,
  ]);

  const handleFillFromProfile = () => {
    const name = formValues.name?.trim() || 'Artist name';
    const cat = (formValues.categories && formValues.categories[0]) || 'Artist';
    const city = formValues.city?.trim() || 'City';

    setValue('metaTitle', `${name} – ${cat} in ${city} | KalaSquare`.slice(0, 60), { shouldValidate: true });
    setValue(
      'metaDescription',
      `Book ${name}, ${cat.toLowerCase()} from ${city}, on KalaSquare. See videos, photos, awards and reviews, then send an enquiry in one click.`.slice(0, 160),
      { shouldValidate: true }
    );
    setValue('focusKeyword', `${name} ${cat}`.toLowerCase(), { shouldValidate: true });
    setValue('photoAltText', `${name}, ${cat.toLowerCase()} from ${city}`, { shouldValidate: true });
  };

  // Sample data event listener
  useEffect(() => {
    const handleSampleFill = () => {
      const sample = {
        name: 'Sahil Badal',
        slug: 'sahil-badal',
        tagline: '18+ years of experience, 30+ songs on air, 300+ bhajans',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        coverPhotoUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        bio: 'Write the artist story. The profile shows a Read more button after the first few lines.',
        city: 'Haryana',
        state: 'Haryana',
        phone: '98XXXXXXXX',
        email: 'name@example.com',
        categories: ['Singer'],
        specializations: 'Lyrics Writer, Sufi Fusion, Bhajans',
        artistClass: 'platinum' as const,
        priceNumeric: 75000,
        priceLabel: 'From ₹50,000',
        budgetRange: '₹50,000 - ₹1,00,000',
        isVerified: true,
        isFeatured: true,
        showInAboutUs: true,
        height: "5' 10",
        weight: '68 kg',
        waist: '32 in',
        chest: '40 in',
        hairType: 'Straight',
        hairLength: 'Short',
        languages: ['Hindi', 'English', 'Punjabi'],
        experienceYears: '18',
        projectsCount: '50',
        liveShowsCount: '150+',
        totalFollowersLabel: '50k',
        socialInstagram: 'https://instagram.com/',
        socialYouTube: 'https://youtube.com/@',
        socialFacebook: 'https://facebook.com/',
        socialX: 'https://x.com/',
        socialSpotify: 'https://open.spotify.com/artist/',
        fanbaseSpotify: '31.9M',
        fanbaseYouTube: '7.9M',
        fanbaseInstagram: '19.0M',
        fanbaseFacebook: '30.9M',
        fanbaseDeezer: '108.7K',
        fanbaseSoundCloud: '77.6K',
        fanbaseTikTok: '7.0M',
        metaTitle: 'Sahil Badal | Singer in Haryana | KalaSquare',
        metaDescription: 'Book Sahil Badal, playback and Sufi fusion vocalist with 18+ years experience, on KalaSquare. Verified reviews and direct enquiry.',
        focusKeyword: 'singer in haryana',
        photoAltText: 'Sahil Badal performing live on stage',
        canonicalUrl: '',
        ogImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        allowSearchEngines: true,
        status: 'published' as const,
      };

      reset(sample);
      setProfilePhotoUrl(sample.photoUrl);
      setGalleryUrls([
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      ]);
      setVideosList([
        { title: 'Lal Ghagra | Saregama', url: 'https://www.youtube.com/watch?v=lalghagra' },
      ]);
      setClipsList([
        { title: 'Behind the scenes', url: 'https://www.instagram.com/reel/bts' },
      ]);
      setCampaignsList([
        { brandName: 'Wo Mera Bhola Hain', category: 'Devotional', year: '2025' },
      ]);
      setAwardsList([
        { title: 'National Award', category: 'Ghazal', year: '2022' },
      ]);
      setFaqsList([
        { question: 'What is the booking advance?', answer: 'We require a 50% advance payment to lock the calendar date.' },
        { question: 'Can the band travel outstation?', answer: 'Yes, Sahil and the troupe travel across India and internationally.' },
      ]);
      setToastMessage('Sample artist data loaded successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    };

    window.addEventListener('fillSampleData', handleSampleFill);
    return () => window.removeEventListener('fillSampleData', handleSampleFill);
  }, [reset]);

  const persistLocally = (record: any) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('kalasquare_admin_artists');
      const list: any[] = raw ? JSON.parse(raw) : [];
      const id = artistId || record.id || `art-${Date.now()}`;
      const updatedList = list.filter((a) => a.id !== id && a.slug !== record.slug);
      updatedList.unshift({ ...record, id, updatedAt: new Date().toISOString() });
      localStorage.setItem('kalasquare_admin_artists', JSON.stringify(updatedList));

      // Also synchronize with kalasquare_artist_classes
      const classRaw = localStorage.getItem('kalasquare_artist_classes');
      const classMap = classRaw ? JSON.parse(classRaw) : {};
      classMap[id] = {
        tier: record.artistClass || 'standard',
        about: Boolean(record.showInAboutUs || record.isFeatured),
      };
      localStorage.setItem('kalasquare_artist_classes', JSON.stringify(classMap));
    } catch {}
  };

  const handleSaveDraft = async () => {
    const values = watch();
    setIsSubmitting(true);

    const cleanGallery = galleryUrls.filter(Boolean);
    const cleanVideos = videosList.filter((v) => v.title.trim() && v.url.trim());
    const cleanClips = clipsList.filter((c) => c.title.trim() && c.url.trim());
    const cleanCampaigns = campaignsList.filter((c) => c.brandName.trim());
    const cleanAwards = awardsList.filter((a) => a.title.trim());
    const cleanFaqs = faqsList.filter((f) => f.question.trim() && f.answer.trim());

    const name = values.name?.trim() || 'Untitled Artist';
    const slug = (values.slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `draft-${Date.now()}`;

    const draftData = {
      ...values,
      name,
      slug,
      photoUrl: profilePhotoUrl || values.photoUrl || '',
      categories: values.categories && values.categories.length > 0 ? values.categories : ['Singer'],
      city: values.city || 'Delhi',
      gallery: cleanGallery,
      videos: cleanVideos,
      clips: cleanClips,
      campaigns: cleanCampaigns,
      awards: cleanAwards,
      faqs: cleanFaqs,
      status: 'draft' as const,
    };

    try {
      let saved: any = null;
      if (mode === 'edit' && artistId) {
        saved = await updateArtist(artistId, draftData);
      } else {
        saved = await createArtist(draftData);
      }
      const recordWithId = {
        ...draftData,
        id: saved?.data?.id || saved?.id || artistId || `art-${Date.now()}`,
      };
      persistLocally(recordWithId);
      setToastMessage(mode === 'edit' ? `"${name}" changes saved as Draft.` : `"${name}" saved as Draft.`);
      setTimeout(() => router.push('/admin/artists'), 1000);
    } catch {
      const recordWithId = {
        ...draftData,
        id: artistId || `art-${Date.now()}`,
      };
      persistLocally(recordWithId);
      setToastMessage(mode === 'edit' ? `"${name}" changes saved as Draft (Demo Mode).` : `"${name}" saved as Draft (Demo Mode).`);
      setTimeout(() => router.push('/admin/artists'), 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishSubmit = async (data: ArtistFormData) => {
    if (completeness.score < 50) {
      setPendingSubmitData(data);
      setShowLowCompletenessModal(true);
      return;
    }
    executePublish(data);
  };

  const executePublish = async (data: ArtistFormData) => {
    setIsSubmitting(true);

    const cleanGallery = galleryUrls.filter(Boolean);
    const cleanVideos = videosList.filter((v) => v.title.trim() && v.url.trim());
    const cleanClips = clipsList.filter((c) => c.title.trim() && c.url.trim());
    const cleanCampaigns = campaignsList.filter((c) => c.brandName.trim());
    const cleanAwards = awardsList.filter((a) => a.title.trim());
    const cleanFaqs = faqsList.filter((f) => f.question.trim() && f.answer.trim());

    const name = data.name.trim();
    const slug = (data.slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `artist-${Date.now()}`;

    const isVerified = Boolean(data.isVerified);
    const status = isVerified ? ('live' as const) : ('pending' as const);

    const publishData = {
      ...data,
      name,
      slug,
      photoUrl: profilePhotoUrl || data.photoUrl || '',
      gallery: cleanGallery,
      videos: cleanVideos,
      clips: cleanClips,
      campaigns: cleanCampaigns,
      awards: cleanAwards,
      faqs: cleanFaqs,
      status,
    };

    try {
      let saved: any = null;
      if (mode === 'edit' && artistId) {
        saved = await updateArtist(artistId, publishData);
      } else {
        saved = await createArtist(publishData);
      }
      const recordWithId = {
        ...publishData,
        id: saved?.data?.id || saved?.id || artistId || `art-${Date.now()}`,
      };
      persistLocally(recordWithId);
      setToastMessage(
        status === 'pending'
          ? `"${name}" saved. Hidden from Home until documents are verified.`
          : (mode === 'edit' ? `"${name}" updated successfully!` : `"${name}" is live on the Home page!`)
      );
      setTimeout(() => router.push('/admin/artists'), 1000);
    } catch {
      const recordWithId = {
        ...publishData,
        id: artistId || `art-${Date.now()}`,
      };
      persistLocally(recordWithId);
      setToastMessage(
        status === 'pending'
          ? `"${name}" saved. Hidden from Home until documents are verified.`
          : (mode === 'edit' ? `"${name}" updated successfully!` : `"${name}" is live on the Home page!`)
      );
      setTimeout(() => router.push('/admin/artists'), 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            right: '24px',
            zIndex: 100,
            background: 'var(--ink, #1b1b1f)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            padding: '10px 16px',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0,0,0,.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--coral, #eb4e62)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Low Completeness Modal */}
      {showLowCompletenessModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', padding: '16px' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--coral-dark)' }}>
              <AlertCircle style={{ width: '22px', height: '22px' }} />
              <h3 style={{ fontSize: '18px', margin: 0 }}>Profile is {completeness.score}% complete</h3>
            </div>
            <p style={{ color: 'var(--mute)', fontSize: '13.5px', lineHeight: 1.5, margin: 0 }}>
              Profiles with higher completeness get up to 4x more event bookings. Are you sure you want to publish now?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '6px' }}>
              <button
                type="button"
                onClick={() => setShowLowCompletenessModal(false)}
                className="btn"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLowCompletenessModal(false);
                  if (pendingSubmitData) executePublish(pendingSubmitData);
                }}
                className="btn primary"
              >
                Publish Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header matching manager.html & screenshot */}
      <div className="ph">
        <h2>{mode === 'edit' ? 'Edit artist' : 'Add artist'}</h2>
        <p>Everything a hirer sees on the artist page in one form. Fields follow the live profile page. Only name, category and city are required.</p>
        <div className="chips">
          <span className="chip">{mode === 'edit' ? 'Edit profile' : 'New profile'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(handlePublishSubmit)} className="aform" noValidate>
        {/* CARD 1: Basic details */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Basic details</h3>
              <p>Name, category, city and contact.</p>
            </div>
          </div>

          <div className="two-c">
            {/* Left 200px Profile Photo Box */}
            <div>
              <div className="lbl">Profile photo</div>
              <input
                ref={profilePhotoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // 1. Instant zero-latency visual preview via DataURL
                  const reader = new FileReader();
                  reader.onload = () => {
                    const dataUrl = reader.result as string;
                    setProfilePhotoUrl(dataUrl);
                    setValue('photoUrl', dataUrl, { shouldValidate: true, shouldDirty: true });
                  };
                  reader.readAsDataURL(file);

                  // 2. Upload to backend in background
                  setIsUploadingPhoto(true);
                  uploadFile(file)
                    .then((uploadedUrl) => {
                      if (uploadedUrl) {
                        setProfilePhotoUrl(uploadedUrl);
                        setValue('photoUrl', uploadedUrl, { shouldValidate: true, shouldDirty: true });
                      }
                    })
                    .catch((err) => {
                      console.warn('Backend upload fallback to local preview:', err);
                    })
                    .finally(() => {
                      setIsUploadingPhoto(false);
                      e.target.value = '';
                    });
                }}
              />
              <button
                type="button"
                onClick={() => profilePhotoInputRef.current?.click()}
                className={`pbox${profilePhotoUrl ? ' has' : ''}`}
                style={
                  profilePhotoUrl
                    ? {
                        backgroundImage: `url(${profilePhotoUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }
                    : undefined
                }
                aria-label="Upload profile photo"
              >
                {isUploadingPhoto ? (
                  <span>Uploading...</span>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>{profilePhotoUrl ? 'Replace photo' : 'Upload photo'}</span>
                  </>
                )}
              </button>
              <small className="mu">800 × 800 px, square. Faces centred.</small>
            </div>

            {/* Right Form Fields */}
            <div className="grid-f">
              <div className="fld full" data-for="name">
                <label htmlFor="af-name">Full name <i className="rq">*</i></label>
                <input id="af-name" type="text" placeholder="Sahil Badal" {...register('name')} />
                {errors.name && <small className="em" style={{ display: 'block' }}>{errors.name.message}</small>}
              </div>

              <div className="fld full">
                <label htmlFor="af-slug">Profile link</label>
                <div className="pre">
                  <span>kalasquare.com/top-creators/</span>
                  <input
                    id="af-slug"
                    type="text"
                    placeholder="sahil-badal"
                    {...register('slug', { onChange: () => setSlugTouched(true) })}
                  />
                </div>
              </div>

              <div className="fld full" data-for="cats">
                <label>Category <i className="rq">*</i> <span className="mu">(pick one or more)</span></label>
                <Controller
                  control={control}
                  name="categories"
                  render={({ field }) => {
                    const selected = field.value || [];
                    return (
                      <div className="chs">
                        {CATEGORY_CHIPS.map((cat) => {
                          const isSelected = selected.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              className="chb"
                              aria-pressed={isSelected}
                              onClick={() => {
                                const next = isSelected
                                  ? selected.filter((c) => c !== cat)
                                  : [...selected, cat];
                                field.onChange(next);
                              }}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    );
                  }}
                />
              </div>

              <div className="fld" data-for="city">
                <label htmlFor="af-city">City <i className="rq">*</i></label>
                <select id="af-city" {...register('city')}>
                  <option value="">Select city</option>
                  {CITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="fld">
                <label htmlFor="af-state">State</label>
                <input id="af-state" type="text" placeholder="Haryana" {...register('state')} />
              </div>

              <div className="fld">
                <label htmlFor="af-phone">Phone</label>
                <input id="af-phone" type="tel" placeholder="98XXXXXXXX" {...register('phone')} />
              </div>

              <div className="fld">
                <label htmlFor="af-email">Email</label>
                <input id="af-email" type="email" placeholder="name@example.com" {...register('email')} />
              </div>

              <div className="fld full">
                <label htmlFor="af-tagline">Summary line</label>
                <input
                  id="af-tagline"
                  type="text"
                  placeholder="18+ years of experience, 30+ songs on air, 300+ bhajans"
                  {...register('tagline')}
                />
              </div>

              <div className="fld full">
                <label htmlFor="af-spec">Specializations</label>
                <div className="tagbox">
                  <input
                    id="af-spec"
                    type="text"
                    placeholder="Type and press Enter, e.g. Lyrics Writer"
                    {...register('specializations')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Class and visibility */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Class and visibility</h3>
              <p>Decides the badge and where the artist is listed.</p>
            </div>
          </div>

          <div className="grid-f">
            <div className="fld">
              <label htmlFor="af-tier">Artist class</label>
              <select id="af-tier" {...register('artistClass')}>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="fld">
              <label htmlFor="af-budget">Budget range</label>
              <select id="af-budget" {...register('budgetRange')}>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>

            <div className="full">
              <div className="swrow">
                <button
                  type="button"
                  className="sw"
                  role="switch"
                  aria-checked={formValues.isVerified}
                  onClick={() => setValue('isVerified', !formValues.isVerified, { shouldValidate: true })}
                >
                  <i />
                  <span>Documents verified</span>
                </button>
                <small className="mu">Gives the blue tick. Needed for the Rising row and for Platinum.</small>
              </div>

              <div className="swrow">
                <button
                  type="button"
                  className="sw"
                  role="switch"
                  aria-checked={formValues.showInAboutUs}
                  onClick={() => setValue('showInAboutUs', !formValues.showInAboutUs, { shouldValidate: true })}
                >
                  <i />
                  <span>Show in About us &middot; Exclusive section</span>
                </button>
                <small className="mu">Adds this artist to the exclusive group on the About us page.</small>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: About */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>About</h3>
            </div>
          </div>
          <div className="fld">
            <label htmlFor="af-bio">Bio</label>
            <textarea
              id="af-bio"
              rows={6}
              placeholder="Write the artist story. The profile shows a Read more button after the first few lines."
              {...register('bio')}
            />
          </div>
        </div>

        {/* CARD 4: Quick stats */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Quick stats</h3>
              <p>Shown as &ldquo;A snapshot of my journey and achievements&rdquo;.</p>
            </div>
          </div>
          <div className="grid-f g4">
            <div className="fld">
              <label htmlFor="af-exp">Experience (years)</label>
              <input id="af-exp" type="text" placeholder="18" {...register('experienceYears')} />
            </div>
            <div className="fld">
              <label htmlFor="af-projects">Projects</label>
              <input id="af-projects" type="text" placeholder="50" {...register('projectsCount')} />
            </div>
            <div className="fld">
              <label htmlFor="af-shows">Live shows</label>
              <input id="af-shows" type="text" placeholder="150+" {...register('liveShowsCount')} />
            </div>
            <div className="fld">
              <label htmlFor="af-followers">Total followers</label>
              <input id="af-followers" type="text" placeholder="50k" {...register('totalFollowersLabel')} />
            </div>
          </div>
        </div>

        {/* CARD 5: Physical stats */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Physical stats</h3>
              <p>Optional. Useful for actors and models.</p>
            </div>
          </div>
          <div className="grid-f g3">
            <div className="fld">
              <label htmlFor="af-ht">Height</label>
              <input id="af-ht" type="text" placeholder="5' 10" {...register('height')} />
            </div>
            <div className="fld">
              <label htmlFor="af-wt">Weight</label>
              <input id="af-wt" type="text" placeholder="68 kg" {...register('weight')} />
            </div>
            <div className="fld">
              <label htmlFor="af-wst">Waist</label>
              <input id="af-wst" type="text" placeholder="32 in" {...register('waist')} />
            </div>
            <div className="fld">
              <label htmlFor="af-cst">Chest</label>
              <input id="af-cst" type="text" placeholder="40 in" {...register('chest')} />
            </div>
            <div className="fld">
              <label htmlFor="af-htype">Hair type</label>
              <input id="af-htype" type="text" placeholder="Straight" {...register('hairType')} />
            </div>
            <div className="fld">
              <label htmlFor="af-hlen">Hair length</label>
              <input id="af-hlen" type="text" placeholder="Short" {...register('hairLength')} />
            </div>
            <div className="fld full">
              <label htmlFor="af-lang">Languages</label>
              <input
                id="af-lang"
                type="text"
                placeholder="Hindi, English, Punjabi"
                value={Array.isArray(formValues.languages) ? formValues.languages.join(', ') : formValues.languages || ''}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                  setValue('languages', arr);
                }}
              />
            </div>
          </div>
        </div>

        {/* CARD 6: Photo gallery */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Photo gallery</h3>
              <p>Shown under Gallery &amp; Media. Add at least 3 photos. 1200 &times; 800 px.</p>
            </div>
            <span className="cnt">{galleryUrls.length} of 12</span>
          </div>

          <input
            ref={galleryInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;
              setIsUploadingGallery(true);
              try {
                const remaining = 12 - galleryUrls.length;
                const toUpload = files.slice(0, remaining);
                const uploaded = await Promise.all(toUpload.map(uploadFile));
                setGalleryUrls((prev) => [...prev, ...uploaded]);
              } finally {
                setIsUploadingGallery(false);
                e.target.value = '';
              }
            }}
          />

          <div className="gal">
            {galleryUrls.map((url, i) => (
              <div key={i} className="gi" style={{ backgroundImage: `url(${url})` }}>
                <button
                  type="button"
                  className="ib del"
                  onClick={() => setGalleryUrls(galleryUrls.filter((_, idx) => idx !== i))}
                  aria-label={`Remove photo ${i + 1}`}
                >
                  <X style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            ))}
            {galleryUrls.length < 12 && (
              <button
                type="button"
                className="gi add"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isUploadingGallery}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                <span>{isUploadingGallery ? 'Uploading...' : 'Add photos'}</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 7: Videos */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Videos</h3>
              <p>YouTube links shown under “Latest Videos” on the profile.</p>
            </div>
            <span className="cnt">{videosList.length} of 6</span>
          </div>

          <div>
            {videosList.map((vid, idx) => (
              <div key={idx} className="rrow">
                <span className="n">{idx + 1}</span>
                <div className="rf">
                  <div className="fld">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Lal Ghagra | Saregama"
                      value={vid.title}
                      onChange={(e) => {
                        const next = [...videosList];
                        next[idx].title = e.target.value;
                        setVideosList(next);
                      }}
                    />
                  </div>
                  <div className="fld">
                    <label>YouTube link</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v="
                      value={vid.url}
                      onChange={(e) => {
                        const next = [...videosList];
                        next[idx].url = e.target.value;
                        setVideosList(next);
                      }}
                    />
                  </div>
                </div>
                <span className="acts">
                  <button
                    type="button"
                    className="ib del"
                    onClick={() => setVideosList(videosList.filter((_, i) => i !== idx))}
                    aria-label="Remove video"
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                </span>
              </div>
            ))}
          </div>

          {videosList.length < 6 && (
            <button
              type="button"
              className="btn sm"
              style={{ marginTop: '12px' }}
              onClick={() => setVideosList([...videosList, { title: '', url: '' }])}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span>Add video</span>
            </button>
          )}
        </div>

        {/* CARD 8: Short clips */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Short clips</h3>
              <p>Vertical clips: YouTube Shorts or Instagram Reels links.</p>
            </div>
            <span className="cnt">{clipsList.length} of 8</span>
          </div>

          <div>
            {clipsList.map((clip, idx) => (
              <div key={idx} className="rrow">
                <span className="n">{idx + 1}</span>
                <div className="rf">
                  <div className="fld">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Behind the scenes"
                      value={clip.title}
                      onChange={(e) => {
                        const next = [...clipsList];
                        next[idx].title = e.target.value;
                        setClipsList(next);
                      }}
                    />
                  </div>
                  <div className="fld">
                    <label>Shorts or Reels link</label>
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/reel/"
                      value={clip.url}
                      onChange={(e) => {
                        const next = [...clipsList];
                        next[idx].url = e.target.value;
                        setClipsList(next);
                      }}
                    />
                  </div>
                </div>
                <span className="acts">
                  <button
                    type="button"
                    className="ib del"
                    onClick={() => setClipsList(clipsList.filter((_, i) => i !== idx))}
                    aria-label="Remove clip"
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                </span>
              </div>
            ))}
          </div>

          {clipsList.length < 8 && (
            <button
              type="button"
              className="btn sm"
              style={{ marginTop: '12px' }}
              onClick={() => setClipsList([...clipsList, { title: '', url: '' }])}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span>Add clip</span>
            </button>
          )}
        </div>

        {/* CARD 9: Previous campaigns */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Previous campaigns</h3>
              <p>Brand collaborations and projects.</p>
            </div>
            <span className="cnt">{campaignsList.length} of 6</span>
          </div>

          <div>
            {campaignsList.length === 0 ? (
              <p className="mu">Nothing added yet.</p>
            ) : (
              campaignsList.map((c, idx) => (
                <div key={idx} className="rrow">
                  <span className="n">{idx + 1}</span>
                  <div className="rf">
                    <div className="fld">
                      <label>Title</label>
                      <input
                        type="text"
                        placeholder="Wo Mera Bhola Hain"
                        value={c.brandName}
                        onChange={(e) => {
                          const next = [...campaignsList];
                          next[idx].brandName = e.target.value;
                          setCampaignsList(next);
                        }}
                      />
                    </div>
                    <div className="fld">
                      <label>Category</label>
                      <input
                        type="text"
                        placeholder="Devotional"
                        value={c.category}
                        onChange={(e) => {
                          const next = [...campaignsList];
                          next[idx].category = e.target.value;
                          setCampaignsList(next);
                        }}
                      />
                    </div>
                    <div className="fld">
                      <label>Year</label>
                      <input
                        type="text"
                        placeholder="2026"
                        value={c.year}
                        onChange={(e) => {
                          const next = [...campaignsList];
                          next[idx].year = e.target.value;
                          setCampaignsList(next);
                        }}
                      />
                    </div>
                  </div>
                  <span className="acts">
                    <button
                      type="button"
                      className="ib del"
                      onClick={() => setCampaignsList(campaignsList.filter((_, i) => i !== idx))}
                      aria-label="Remove campaign"
                    >
                      <X style={{ width: '14px', height: '14px' }} />
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>

          {campaignsList.length < 6 && (
            <button
              type="button"
              className="btn sm"
              style={{ marginTop: '12px' }}
              onClick={() => setCampaignsList([...campaignsList, { brandName: '', category: '', year: '2026' }])}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span>Add campaign</span>
            </button>
          )}
        </div>

        {/* CARD 10: Awards and recognition */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Awards and recognition</h3>
              <p>Achievements and accolades.</p>
            </div>
            <span className="cnt">{awardsList.length} of 8</span>
          </div>

          <div>
            {awardsList.length === 0 ? (
              <p className="mu">Nothing added yet.</p>
            ) : (
              awardsList.map((a, idx) => (
                <div key={idx} className="rrow">
                  <span className="n">{idx + 1}</span>
                  <div className="rf">
                    <div className="fld">
                      <label>Award title</label>
                      <input
                        type="text"
                        placeholder="National Award"
                        value={a.title}
                        onChange={(e) => {
                          const next = [...awardsList];
                          next[idx].title = e.target.value;
                          setAwardsList(next);
                        }}
                      />
                    </div>
                    <div className="fld">
                      <label>Category</label>
                      <input
                        type="text"
                        placeholder="Ghazal"
                        value={a.category}
                        onChange={(e) => {
                          const next = [...awardsList];
                          next[idx].category = e.target.value;
                          setAwardsList(next);
                        }}
                      />
                    </div>
                    <div className="fld">
                      <label>Year</label>
                      <input
                        type="text"
                        placeholder="2022"
                        value={a.year}
                        onChange={(e) => {
                          const next = [...awardsList];
                          next[idx].year = e.target.value;
                          setAwardsList(next);
                        }}
                      />
                    </div>
                  </div>
                  <span className="acts">
                    <button
                      type="button"
                      className="ib del"
                      onClick={() => setAwardsList(awardsList.filter((_, i) => i !== idx))}
                      aria-label="Remove award"
                    >
                      <X style={{ width: '14px', height: '14px' }} />
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>

          {awardsList.length < 8 && (
            <button
              type="button"
              className="btn sm"
              style={{ marginTop: '12px' }}
              onClick={() => setAwardsList([...awardsList, { title: '', category: '', year: '2025' }])}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span>Add award</span>
            </button>
          )}
        </div>

        {/* CARD 11: FAQs */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>FAQs</h3>
              <p>Shown on the public artist page only for Platinum artists. Add questions clients ask most.</p>
            </div>
            <span className="cnt">{faqsList.length} of 8</span>
          </div>

          <div>
            {faqsList.length === 0 ? (
              <p className="mu">Nothing added yet.</p>
            ) : (
              faqsList.map((f, idx) => (
                <div key={idx} className="rrow">
                  <span className="n">{idx + 1}</span>
                  <div className="rf">
                    <div className="fld">
                      <label>Question</label>
                      <input
                        type="text"
                        placeholder="What do you need to book this artist?"
                        value={f.question}
                        onChange={(e) => {
                          const next = [...faqsList];
                          next[idx].question = e.target.value;
                          setFaqsList(next);
                        }}
                      />
                    </div>
                    <div className="fld">
                      <label>Answer</label>
                      <input
                        type="text"
                        placeholder="Short, clear answer"
                        value={f.answer}
                        onChange={(e) => {
                          const next = [...faqsList];
                          next[idx].answer = e.target.value;
                          setFaqsList(next);
                        }}
                      />
                    </div>
                  </div>
                  <span className="acts">
                    <button
                      type="button"
                      className="ib del"
                      onClick={() => setFaqsList(faqsList.filter((_, i) => i !== idx))}
                      aria-label="Remove FAQ"
                    >
                      <X style={{ width: '14px', height: '14px' }} />
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>

          {faqsList.length < 8 && (
            <button
              type="button"
              className="btn sm"
              style={{ marginTop: '12px' }}
              onClick={() => setFaqsList([...faqsList, { question: '', answer: '' }])}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span>Add question</span>
            </button>
          )}
        </div>

        {/* CARD 12: Social and links */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Social and links</h3>
              <p>Shown as icons on the profile.</p>
            </div>
          </div>
          <div className="grid-f">
            <div className="fld">
              <label htmlFor="af-ig">Instagram</label>
              <input id="af-ig" type="url" placeholder="https://instagram.com/" {...register('socialInstagram')} />
            </div>
            <div className="fld">
              <label htmlFor="af-yt">YouTube</label>
              <input id="af-yt" type="url" placeholder="https://youtube.com/@" {...register('socialYouTube')} />
            </div>
            <div className="fld">
              <label htmlFor="af-fb">Facebook</label>
              <input id="af-fb" type="url" placeholder="https://facebook.com/" {...register('socialFacebook')} />
            </div>
            <div className="fld">
              <label htmlFor="af-x">X</label>
              <input id="af-x" type="url" placeholder="https://x.com/" {...register('socialX')} />
            </div>
            <div className="fld full">
              <label htmlFor="af-spotify">Spotify</label>
              <input id="af-spotify" type="url" placeholder="https://open.spotify.com/artist/" {...register('socialSpotify')} />
            </div>
          </div>
        </div>

        {/* CARD 13: Fanbase by platform */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>Fanbase by platform</h3>
              <p>Shown as the donut chart and platform cards. Leave a platform empty to hide it. Examples: 31.9M, 108.7K.</p>
            </div>
          </div>
          <div className="grid-f g4">
            <div className="fld">
              <label htmlFor="af-fb-sp">Spotify followers</label>
              <input id="af-fb-sp" type="text" placeholder="31.9M" {...register('fanbaseSpotify')} />
            </div>
            <div className="fld">
              <label htmlFor="af-fb-yt">YouTube subscribers</label>
              <input id="af-fb-yt" type="text" placeholder="7.9M" {...register('fanbaseYouTube')} />
            </div>
            <div className="fld">
              <label htmlFor="af-fb-ig">Instagram followers</label>
              <input id="af-fb-ig" type="text" placeholder="19.0M" {...register('fanbaseInstagram')} />
            </div>
            <div className="fld">
              <label htmlFor="af-fb-fb">Facebook followers</label>
              <input id="af-fb-fb" type="text" placeholder="30.9M" {...register('fanbaseFacebook')} />
            </div>
            <div className="fld">
              <label htmlFor="af-fb-dz">Deezer fans</label>
              <input id="af-fb-dz" type="text" placeholder="108.7K" {...register('fanbaseDeezer')} />
            </div>
            <div className="fld">
              <label htmlFor="af-fb-sc">SoundCloud followers</label>
              <input id="af-fb-sc" type="text" placeholder="77.6K" {...register('fanbaseSoundCloud')} />
            </div>
            <div className="fld">
              <label htmlFor="af-fb-tt">TikTok followers</label>
              <input id="af-fb-tt" type="text" placeholder="7.0M" {...register('fanbaseTikTok')} />
            </div>
          </div>
        </div>

        {/* CARD 14: SEO */}
        <div className="card">
          <div className="lh">
            <div>
              <h3>SEO</h3>
              <p>How this profile looks on Google and when the link is shared on WhatsApp.</p>
            </div>
          </div>

          <div className="seo">
            <div className="seo-f">
              <div className="fld">
                <label htmlFor="sf-title">
                  Meta title{' '}
                  <span
                    className={`cc ${
                      (formValues.metaTitle || '').length > 60 ||
                      ((formValues.metaTitle || '').length > 0 &&
                        (formValues.metaTitle || '').length < 30)
                        ? 'warn'
                        : ''
                    }`}
                  >
                    {(formValues.metaTitle || '').length}/60
                  </span>
                </label>
                <input
                  id="sf-title"
                  type="text"
                  maxLength={60}
                  placeholder={`${formValues.name || 'Artist name'} | KalaSquare`}
                  {...register('metaTitle')}
                />
              </div>

              <div className="fld">
                <label htmlFor="sf-desc">
                  Meta description{' '}
                  <span
                    className={`cc ${
                      (formValues.metaDescription || '').length > 160 ||
                      ((formValues.metaDescription || '').length > 0 &&
                        (formValues.metaDescription || '').length < 70)
                        ? 'warn'
                        : ''
                    }`}
                  >
                    {(formValues.metaDescription || '').length}/160
                  </span>
                </label>
                <textarea
                  id="sf-desc"
                  rows={3}
                  maxLength={160}
                  placeholder="One or two sentences that make someone click."
                  {...register('metaDescription')}
                />
              </div>

              <div className="fld">
                <label htmlFor="sf-kw">Focus keyword</label>
                <input
                  id="sf-kw"
                  type="text"
                  placeholder="e.g. singer in haryana"
                  {...register('focusKeyword')}
                />
              </div>

              <div className="fld">
                <label htmlFor="sf-alt">Profile photo alt text</label>
                <input
                  id="sf-alt"
                  type="text"
                  placeholder="Describe the photo for search and screen readers"
                  {...register('photoAltText')}
                />
              </div>

              <div className="fld">
                <label htmlFor="sf-can">
                  Canonical URL <span className="mu">(optional)</span>
                </label>
                <input
                  id="sf-can"
                  type="url"
                  placeholder="Leave empty to use the page address"
                  {...register('canonicalUrl')}
                />
              </div>

              <div className="fld">
                <label>
                  Share image <span className="mu">(1200 × 630 px)</span>
                </label>
                <input
                  ref={shareImageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // 1. Instant local preview via DataURL
                    const reader = new FileReader();
                    reader.onload = () => {
                      const dataUrl = reader.result as string;
                      setValue('ogImageUrl', dataUrl, { shouldValidate: true, shouldDirty: true });
                    };
                    reader.readAsDataURL(file);

                    // 2. Upload to server
                    setIsUploadingShare(true);
                    uploadFile(file)
                      .then((url) => {
                        if (url) {
                          setValue('ogImageUrl', url, { shouldValidate: true, shouldDirty: true });
                        }
                      })
                      .finally(() => {
                        setIsUploadingShare(false);
                        e.target.value = '';
                      });
                  }}
                />
                <div className="acts" style={{ margin: 0, justifyContent: 'flex-start' }}>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => shareImageInputRef.current?.click()}
                    disabled={isUploadingShare}
                  >
                    <Upload style={{ width: '13px', height: '13px' }} />
                    <span>
                      {isUploadingShare
                        ? 'Uploading...'
                        : formValues.ogImageUrl
                        ? 'Replace image'
                        : 'Upload image'}
                    </span>
                  </button>
                  {formValues.ogImageUrl && (
                    <button
                      type="button"
                      className="btn sm"
                      onClick={() => setValue('ogImageUrl', '', { shouldValidate: true })}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="swrow">
                <button
                  type="button"
                  className="sw"
                  role="switch"
                  aria-checked={formValues.allowSearchEngines}
                  onClick={() =>
                    setValue('allowSearchEngines', !formValues.allowSearchEngines, {
                      shouldValidate: true,
                    })
                  }
                >
                  <i />
                  <span>Show in search engines</span>
                </button>
                <small className="mu">Schema type: Person (added automatically)</small>
              </div>

              <button
                type="button"
                className="btn sm"
                onClick={handleFillFromProfile}
                style={{ alignSelf: 'flex-start' }}
              >
                <Sparkles style={{ width: '13px', height: '13px', color: 'var(--coral)' }} />
                <span>Fill from profile</span>
              </button>
            </div>

            <div className="seo-p" id="seoDyn">
              {/* Google Preview */}
              <div className="gp" aria-label="Google result preview">
                <div className="gp-u">
                  kalasquare.com &rsaquo; top-creators &rsaquo;{' '}
                  {formValues.slug || 'artist-name'}
                </div>
                <div className={`gp-t ${formValues.metaTitle ? '' : 'ph'}`}>
                  {formValues.metaTitle || `${formValues.name || 'Artist name'} | KalaSquare`}
                </div>
                <div className={`gp-d ${formValues.metaDescription ? '' : 'ph'}`}>
                  {formValues.metaDescription || 'Google will pick a short text from the page.'}
                </div>
              </div>

              {/* Social Preview */}
              <div className="ogp">
                <div
                  className="ogi"
                  style={
                    formValues.ogImageUrl
                      ? { backgroundImage: `url(${formValues.ogImageUrl})` }
                      : undefined
                  }
                >
                  {!formValues.ogImageUrl && <span>No share image</span>}
                </div>
                <div className="ogt">
                  <small>KALASQUARE.COM</small>
                  <b>
                    {formValues.metaTitle || `${formValues.name || 'Artist name'} | KalaSquare`}
                  </b>
                </div>
              </div>

              {/* SEO Score Checklist */}
              <div className="scr">
                <div className="scr-h">
                  <b>SEO score</b>
                  <span className={`tg ${seoRes.cls}`}>
                    {seoRes.label} &middot; {seoRes.score}
                  </span>
                </div>
                <div className="mt wide">
                  <i style={{ width: `${seoRes.score}%` }} />
                </div>
                <ul className="chk">
                  {seoRes.items.map((it, i) => (
                    <li key={i} className={it[1] ? 'y' : 'n'}>
                      {it[1] ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12l5 5 9-10" />
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <circle cx="12" cy="12" r="8" />
                        </svg>
                      )}
                      <span>{it[2]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Note from manager.html */}
        <p className="note">
          Reviews and ratings are written by visitors on the website and are not entered here.
        </p>

        {/* STICKY BOTTOM BAR (.fbar from manager.html line 1337) */}
        <div className="fbar">
          <div className="cmp">
            <span>
              Profile completeness <b>{completeness.score}%</b>
            </span>
            <span className="mt">
              <i style={{ width: `${completeness.score}%` }} />
            </span>
          </div>

          <span className="acts" style={{ marginLeft: 0 }}>
            <button
              type="button"
              onClick={() => router.push('/admin/artists')}
              className="btn"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="btn"
            >
              Save as draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn primary"
            >
              {mode === 'edit' ? 'Save changes' : 'Save and publish'}
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}
