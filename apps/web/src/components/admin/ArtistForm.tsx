'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Film,
  Sparkles,
} from 'lucide-react';

import {
  artistFormSchema,
  artistDraftSchema,
  ArtistFormData,
} from '@/lib/validators/artist-form';
import { calculateCompleteness } from '@/lib/completeness';
import FormSection from './FormSection';
import ImageUpload from './ImageUpload';
import GalleryUploader, { GalleryItem } from './GalleryUploader';
import DynamicList from './DynamicList';
import CompletenessBar from './CompletenessBar';
import SEOPreview from './SEOPreview';

interface ArtistFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<ArtistFormData>;
  artistId?: string;
}

const CATEGORY_OPTIONS = [
  'Actor',
  'Singer',
  'Musician',
  'Band',
  'Dancer',
  'Comedian',
  'Emcee',
  'Speaker',
  'Magician',
  'DJ',
  'Photographer',
  'Crew / Company',
];

const LANGUAGE_OPTIONS = [
  'Hindi',
  'English',
  'Punjabi',
  'Bengali',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Urdu',
  'Other',
];

const NAV_SECTIONS = [
  { id: 'sec-basic', label: 'Basic Info' },
  { id: 'sec-about', label: 'About & Stats' },
  { id: 'sec-categories', label: 'Categories & Pricing' },
  { id: 'sec-social', label: 'Social & Fanbase' },
  { id: 'sec-gallery', label: 'Gallery' },
  { id: 'sec-videos', label: 'Videos & Clips' },
  { id: 'sec-campaigns', label: 'Campaigns & Awards' },
  { id: 'sec-faqs', label: 'FAQs' },
  { id: 'sec-seo', label: 'SEO' },
  { id: 'sec-publish', label: 'Publish Settings' },
];

export default function ArtistForm({ mode, initialData, artistId }: ArtistFormProps) {
  const router = useRouter();

  // Active section for sticky navigation
  const [activeNav, setActiveNav] = useState('sec-basic');

  // Confirmation Modals
  const [showLowCompletenessModal, setShowLowCompletenessModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<ArtistFormData | null>(null);

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Has the user manually modified the slug?
  const [isSlugTouched, setIsSlugTouched] = useState(mode === 'edit');

  const defaultValues: ArtistFormData = {
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    tagline: initialData?.tagline || '',
    photoUrl: initialData?.photoUrl || '',
    coverPhotoUrl: initialData?.coverPhotoUrl || '',
    city: initialData?.city || 'Delhi',
    state: initialData?.state || 'Delhi-NCR',
    artistClass: initialData?.artistClass || 'platinum',
    isVerified: initialData?.isVerified ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    bio: initialData?.bio || '',
    languages: initialData?.languages || ['Hindi', 'English'],
    specializations: initialData?.specializations || '',
    height: initialData?.height || "5'10\"",
    weight: initialData?.weight || '68 kg',
    waist: initialData?.waist || '32 in',
    chest: initialData?.chest || '40 in',
    hairType: initialData?.hairType || 'Straight',
    hairLength: initialData?.hairLength || 'Short',
    experienceYears: initialData?.experienceYears || '18 Years',
    projectsCount: initialData?.projectsCount || '50+',
    liveShowsCount: initialData?.liveShowsCount || '150+',
    categories: initialData?.categories || ['Singer'],
    priceFrom: initialData?.priceFrom || 50000,
    priceTo: initialData?.priceTo || 150000,
    availability: initialData?.availability || 'Available',
    bookingNote: initialData?.bookingNote || '',
    instagram: initialData?.instagram || '',
    youtube: initialData?.youtube || '',
    facebook: initialData?.facebook || '',
    x: initialData?.x || '',
    spotify: initialData?.spotify || '',
    website: initialData?.website || '',
    imdbUrl: initialData?.imdbUrl || '',
    fanbaseSpotify: initialData?.fanbaseSpotify || 0,
    fanbaseYouTube: initialData?.fanbaseYouTube || 0,
    fanbaseInstagram: initialData?.fanbaseInstagram || 0,
    fanbaseFacebook: initialData?.fanbaseFacebook || 0,
    fanbaseDeezer: initialData?.fanbaseDeezer || 0,
    fanbaseSoundCloud: initialData?.fanbaseSoundCloud || 0,
    fanbaseTikTok: initialData?.fanbaseTikTok || 0,
    gallery: (initialData?.gallery as GalleryItem[]) || [
      { id: 'g1', src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80', caption: 'Concert tour' },
    ],
    videos: initialData?.videos || [
      { id: 'v1', title: 'Live Performance', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '4:15' },
    ],
    clips: initialData?.clips || [
      { id: 'c1', title: 'Rehearsal clip', url: 'https://youtube.com/shorts/sample1', platform: 'YouTube Shorts' },
    ],
    campaigns: initialData?.campaigns || [],
    awards: initialData?.awards || [],
    faqs: initialData?.faqs || [
      { question: 'What is the standard live set duration?', answer: 'Typical live sets are 90 to 120 minutes with a full band.' },
    ],
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    keywords: initialData?.keywords || '',
    ogImageUrl: initialData?.ogImageUrl || '',
    status: initialData?.status || 'draft',
    publishDate: initialData?.publishDate || '',
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const formValues = watch();

  // Auto-generate slug from name if not touched
  useEffect(() => {
    if (!isSlugTouched && formValues.name) {
      const generated = formValues.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', generated, { shouldValidate: true });
    }
  }, [formValues.name, isSlugTouched, setValue]);

  // Auto-fill SEO Meta Title and Meta Description if empty
  useEffect(() => {
    if (!formValues.metaTitle && formValues.name) {
      setValue('metaTitle', `${formValues.name} | KalaSquare`.slice(0, 60));
    }
  }, [formValues.name, formValues.metaTitle, setValue]);

  useEffect(() => {
    if (!formValues.metaDescription && formValues.bio) {
      setValue('metaDescription', formValues.bio.slice(0, 160));
    }
  }, [formValues.bio, formValues.metaDescription, setValue]);

  // Completeness Calculation
  const completeness = useMemo(() => {
    return calculateCompleteness(formValues);
  }, [formValues]);

  // Total Fanbase Calculation
  const totalFollowersCalc = useMemo(() => {
    const total =
      Number(formValues.fanbaseSpotify || 0) +
      Number(formValues.fanbaseYouTube || 0) +
      Number(formValues.fanbaseInstagram || 0) +
      Number(formValues.fanbaseFacebook || 0) +
      Number(formValues.fanbaseDeezer || 0) +
      Number(formValues.fanbaseSoundCloud || 0) +
      Number(formValues.fanbaseTikTok || 0);

    if (total >= 1e6) return `${(total / 1e6).toFixed(1)}M`;
    if (total >= 1e3) return `${(total / 1e3).toFixed(1)}K`;
    return total.toLocaleString();
  }, [
    formValues.fanbaseSpotify,
    formValues.fanbaseYouTube,
    formValues.fanbaseInstagram,
    formValues.fanbaseFacebook,
    formValues.fanbaseDeezer,
    formValues.fanbaseSoundCloud,
    formValues.fanbaseTikTok,
  ]);

  // Check if categories includes 'Actor'
  const isActorSelected = (formValues.categories || []).some((c) =>
    c.toLowerCase().includes('actor')
  );

  // Check if artistClass is 'platinum'
  const isPlatinumClass = formValues.artistClass === 'platinum';

  // Scrollspy effect for sticky left nav
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = NAV_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveNav(NAV_SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNavSection = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Save to localStorage helper
  const saveToLocalStorage = (data: Partial<ArtistFormData>, status: 'draft' | 'published') => {
    if (typeof window === 'undefined') return;
    try {
      const existingRaw = localStorage.getItem('kalasquare_admin_artists');
      const existing: Record<string, unknown>[] = existingRaw ? JSON.parse(existingRaw) : [];

      const record = {
        ...data,
        id: artistId || `art-${Date.now()}`,
        status,
        updatedAt: new Date().toISOString(),
      };

      const filtered = existing.filter((item) => item.id !== record.id);
      filtered.unshift(record);
      localStorage.setItem('kalasquare_admin_artists', JSON.stringify(filtered));
    } catch {
      // LocalStorage quota or parse error fallback
    }
  };

  // Handle Save as Draft
  const handleSaveDraft = () => {
    const values = watch();
    // Validate with relaxed draft schema
    const result = artistDraftSchema.safeParse(values);
    if (!result.success) {
      const firstError = result.error.errors[0];
      alert(`Cannot save draft: ${firstError.message}`);
      return;
    }

    saveToLocalStorage({ ...values, status: 'draft' }, 'draft');
    setToastMessage(`"${values.name}" saved as Draft successfully!`);

    setTimeout(() => {
      router.push('/admin/artists');
    }, 1200);
  };

  // Perform Final Publish Save
  const executePublish = (data: ArtistFormData) => {
    const publishData = {
      ...data,
      status: 'published' as const,
      publishDate: data.publishDate || new Date().toISOString().split('T')[0],
    };

    saveToLocalStorage(publishData, 'published');
    setToastMessage(`"${data.name}" published successfully! Live on site.`);

    setTimeout(() => {
      router.push('/admin/artists');
    }, 1200);
  };

  // On Valid Full Form Submission (Publish Button)
  const onPublishSubmit = (data: ArtistFormData) => {
    // If completeness < 70%, warn user with modal
    if (completeness.score < 70) {
      setPendingSubmitData(data);
      setShowLowCompletenessModal(true);
      return;
    }

    executePublish(data);
  };

  // On Incomplete Form Errors (Scroll to first error)
  const onPublishErrors = (errs: typeof errors) => {
    const firstKey = Object.keys(errs)[0];
    if (firstKey) {
      const fieldEl = document.querySelector(`[name="${firstKey}"]`);
      if (fieldEl) {
        fieldEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1a8a57] text-white text-sm font-bold px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in border border-white/20">
          <CheckCircle2 className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Low Completeness Warning Modal */}
      {showLowCompletenessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e6e6ea] space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-[#8a5a00]">
              <div className="w-10 h-10 rounded-full bg-[#fff4d6] flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#1b1b1f]">
                Profile is {completeness.score}% complete
              </h3>
            </div>
            <p className="text-sm text-[#6b6b76] leading-relaxed">
              Profiles with higher completeness get up to 4x more event bookings. Are you sure you want to publish now?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLowCompletenessModal(false)}
                className="h-10 px-4 rounded-xl border border-[#e6e6ea] text-xs font-bold text-[#1b1b1f] hover:bg-[#f6f6f7]"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLowCompletenessModal(false);
                  if (pendingSubmitData) executePublish(pendingSubmitData);
                }}
                className="h-10 px-5 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-white text-xs font-bold shadow-md"
              >
                Publish Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#e6e6ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/artists"
            className="p-2 rounded-xl border border-[#e6e6ea] hover:bg-[#f6f6f7] text-[#1b1b1f] transition"
            title="Back to artists"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
              {mode === 'edit'
                ? `Edit Artist — ${formValues.name || 'Profile'}`
                : 'Add New Artist'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6b6b76] mt-0.5">
              Fill artist credentials, media links, and public showcase data.
            </p>
          </div>
        </div>

        {/* Top Right Completeness and Action Buttons */}
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <CompletenessBar score={completeness.score} variant="top" />

          <button
            type="button"
            onClick={handleSaveDraft}
            className="h-10 px-4 rounded-xl bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-xs font-bold text-[#1b1b1f] transition cursor-pointer"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={handleSubmit(onPublishSubmit, onPublishErrors)}
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-white text-xs font-bold shadow-sm hover:shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sticky Navigation + Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Nav (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white rounded-2xl p-3 border border-[#e6e6ea] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b6b76] px-3 py-2 block">
            Form Sections
          </span>
          {NAV_SECTIONS.map((sec) => {
            const isActive = activeNav === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToNavSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-[#fde6ea] text-[#eb4e62] font-bold'
                    : 'text-[#6b6b76] hover:bg-[#f6f6f7] hover:text-[#1b1b1f]'
                }`}
              >
                <span>{sec.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#eb4e62]" />}
              </button>
            );
          })}
        </aside>

        {/* Right Column: 10 Form Sections */}
        <form
          onSubmit={handleSubmit(onPublishSubmit, onPublishErrors)}
          className="lg:col-span-9 space-y-8"
        >
          {/* Section 1 - Basic Info */}
          <FormSection
            id="sec-basic"
            title="1. Basic Details"
            description="Artist name, public link, primary location, and identification."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-[#1b1b1f]">
                  Full Name <span className="text-[#eb4e62]">*</span>
                </label>
                <input
                  type="text"
                  maxLength={80}
                  placeholder="e.g. Sahil Badal"
                  {...register('name')}
                  className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm outline-hidden transition ${
                    errors.name ? 'border-[#eb4e62] bg-[#fde6ea]/20' : 'border-[#e6e6ea] focus:border-[#eb4e62]'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-[#eb4e62] font-semibold">{errors.name.message}</p>
                )}
              </div>

              {/* Slug URL */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-[#1b1b1f]">
                  Public Profile URL Slug <span className="text-[#eb4e62]">*</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-[#e6e6ea] bg-[#f6f6f7] focus-within:border-[#eb4e62]">
                  <span className="px-3.5 py-2.5 text-xs text-[#6b6b76] border-r border-[#e6e6ea] bg-[#f6f6f7] select-none font-mono">
                    kalasquare.com/top-creators/
                  </span>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="sahil-badal"
                    {...register('slug', {
                      onChange: () => setIsSlugTouched(true),
                    })}
                    className="flex-1 px-3.5 py-2 bg-white text-xs font-mono outline-hidden"
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs text-[#eb4e62] font-semibold">{errors.slug.message}</p>
                )}
              </div>

              {/* Tagline */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-[#1b1b1f]">Summary / Tagline</label>
                <input
                  type="text"
                  maxLength={120}
                  placeholder="e.g. Playback Singer · Sufi Fusion Vocalist · Live Performer"
                  {...register('tagline')}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#e6e6ea] focus:border-[#eb4e62] text-sm outline-hidden"
                />
              </div>

              {/* Profile Photo */}
              <div className="sm:col-span-2">
                <Controller
                  control={control}
                  name="photoUrl"
                  render={({ field }) => (
                    <ImageUpload
                      label="Profile Photo (Square)"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      aspect="square"
                      hint="Recommended: 800 × 800 px, faces centered. JPG, PNG or WebP under 5 MB."
                      error={errors.photoUrl?.message}
                    />
                  )}
                />
              </div>

              {/* Cover Photo */}
              <div className="sm:col-span-2">
                <Controller
                  control={control}
                  name="coverPhotoUrl"
                  render={({ field }) => (
                    <ImageUpload
                      label="Cover / Banner Photo (Optional)"
                      value={field.value}
                      onChange={field.onChange}
                      aspect="banner"
                      hint="Recommended: 1200 × 400 px landscape banner."
                    />
                  )}
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1b1b1f]">
                  City <span className="text-[#eb4e62]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delhi"
                  {...register('city')}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#e6e6ea] focus:border-[#eb4e62] text-sm outline-hidden"
                />
                {errors.city && (
                  <p className="text-xs text-[#eb4e62] font-semibold">{errors.city.message}</p>
                )}
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1b1b1f]">
                  State <span className="text-[#eb4e62]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delhi-NCR"
                  {...register('state')}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#e6e6ea] focus:border-[#eb4e62] text-sm outline-hidden"
                />
                {errors.state && (
                  <p className="text-xs text-[#eb4e62] font-semibold">{errors.state.message}</p>
                )}
              </div>

              {/* Artist Class */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1b1b1f]">
                  Artist Class <span className="text-[#eb4e62]">*</span>
                </label>
                <select
                  {...register('artistClass')}
                  className="w-full h-11 px-3 rounded-xl bg-white border border-[#e6e6ea] focus:border-[#eb4e62] text-sm outline-hidden cursor-pointer"
                >
                  <option value="platinum">Platinum (Top Tier · Golden Badge · Has FAQs)</option>
                  <option value="gold">Gold (Established Performer)</option>
                  <option value="rising">Rising (Growing Talent · Black Badge)</option>
                  <option value="new">New (Recently Joined · Coral Badge)</option>
                </select>
              </div>

              {/* Verified & Featured Toggles */}
              <div className="flex flex-col justify-end gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isVerified')}
                    className="w-4 h-4 rounded text-[#eb4e62] focus:ring-[#eb4e62]"
                  />
                  <span className="text-xs font-bold text-[#1b1b1f]">Documents Verified (Blue Check Badge)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="w-4 h-4 rounded text-[#eb4e62] focus:ring-[#eb4e62]"
                  />
                  <span className="text-xs font-semibold text-[#6b6b76]">Show in Hero / Featured Spotlights</span>
                </label>
              </div>
            </div>
          </FormSection>

          {/* Section 2 - About & Physical Stats */}
          <FormSection
            id="sec-about"
            title="2. About & Physical Stats"
            description="Story, achievements, body measurements (actors/models), and performance experience."
          >
            <div className="space-y-4">
              {/* Bio */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#1b1b1f]">
                    Artist Biography <span className="text-[#eb4e62]">*</span>
                  </label>
                  <span className="text-xs font-mono text-[#6b6b76]">
                    {(formValues.bio || '').length} / 2000
                  </span>
                </div>
                <textarea
                  rows={6}
                  maxLength={2000}
                  placeholder="Write the artist's full journey, style, notable concerts, and audience impact (minimum 100 characters for publish)..."
                  {...register('bio')}
                  className={`w-full p-3.5 rounded-xl bg-white border text-sm outline-hidden transition ${
                    errors.bio ? 'border-[#eb4e62] bg-[#fde6ea]/20' : 'border-[#e6e6ea] focus:border-[#eb4e62]'
                  }`}
                />
                {errors.bio && (
                  <p className="text-xs text-[#eb4e62] font-semibold">{errors.bio.message}</p>
                )}
              </div>

              {/* Languages Multi-select Pills */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1b1b1f]">Languages Spoken / Performed</label>
                <Controller
                  control={control}
                  name="languages"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_OPTIONS.map((lang) => {
                        const isSelected = (field.value || []).includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => {
                              const next = isSelected
                                ? (field.value || []).filter((l) => l !== lang)
                                : [...(field.value || []), lang];
                              field.onChange(next);
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#eb4e62] text-white'
                                : 'bg-[#f6f6f7] text-[#6b6b76] hover:bg-[#e6e6ea]'
                            }`}
                          >
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Specializations */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1b1b1f]">Specializations (Comma separated)</label>
                <input
                  type="text"
                  maxLength={200}
                  placeholder="e.g. Sufi Fusion, Bollywood Unplugged, Corporate Gala, Stage Hosting"
                  {...register('specializations')}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#e6e6ea] focus:border-[#eb4e62] text-sm outline-hidden"
                />
              </div>

              {/* Physical Stats Grid */}
              <div className="pt-2">
                <span className="block text-xs font-bold text-[#6b6b76] uppercase tracking-wider mb-2">
                  Physical Stats (Optional — Useful for Actors and Models)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Height</label>
                    <input
                      type="text"
                      placeholder="e.g. 5' 10 in"
                      {...register('height')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Weight</label>
                    <input
                      type="text"
                      placeholder="e.g. 68 kg"
                      {...register('weight')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Waist</label>
                    <input
                      type="text"
                      placeholder="e.g. 32 in"
                      {...register('waist')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Chest</label>
                    <input
                      type="text"
                      placeholder="e.g. 40 in"
                      {...register('chest')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Hair Type</label>
                    <select
                      {...register('hairType')}
                      className="w-full h-10 px-2 rounded-lg border border-[#e6e6ea] text-xs outline-hidden"
                    >
                      <option value="">Select</option>
                      <option value="Straight">Straight</option>
                      <option value="Wavy">Wavy</option>
                      <option value="Curly">Curly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Hair Length</label>
                    <select
                      {...register('hairLength')}
                      className="w-full h-10 px-2 rounded-lg border border-[#e6e6ea] text-xs outline-hidden"
                    >
                      <option value="">Select</option>
                      <option value="Short">Short</option>
                      <option value="Medium">Medium</option>
                      <option value="Long">Long</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Stats: Experience, Projects, Shows */}
              <div className="pt-2 border-t border-[#f6f6f7]">
                <span className="block text-xs font-bold text-[#6b6b76] uppercase tracking-wider mb-2">
                  Career Milestones (Shown as 4 Quick Stats on Profile)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 18 Years"
                      {...register('experienceYears')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Projects</label>
                    <input
                      type="text"
                      placeholder="e.g. 50+"
                      {...register('projectsCount')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Live Shows</label>
                    <input
                      type="text"
                      placeholder="e.g. 150+"
                      {...register('liveShowsCount')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Section 3 - Categories & Pricing */}
          <FormSection
            id="sec-categories"
            title="3. Categories & Pricing"
            description="Select up to 3 creative categories and indicative booking fee range."
          >
            <div className="space-y-4">
              {/* Category Checkboxes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1b1b1f]">
                  Categories (Pick 1 to 3) <span className="text-[#eb4e62]">*</span>
                </label>
                <Controller
                  control={control}
                  name="categories"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {CATEGORY_OPTIONS.map((cat) => {
                        const isChecked = (field.value || []).includes(cat);
                        return (
                          <label
                            key={cat}
                            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                              isChecked
                                ? 'bg-[#fde6ea] border-[#eb4e62] text-[#eb4e62] font-bold'
                                : 'bg-[#f6f6f7] border-[#e6e6ea] text-[#1b1b1f] hover:border-neutral-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if ((field.value || []).length < 3) {
                                    field.onChange([...(field.value || []), cat]);
                                  } else {
                                    alert('You can select a maximum of 3 categories.');
                                  }
                                } else {
                                  field.onChange((field.value || []).filter((c) => c !== cat));
                                }
                              }}
                              className="w-4 h-4 rounded text-[#eb4e62] focus:ring-[#eb4e62]"
                            />
                            <span className="text-xs">{cat}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.categories && (
                  <p className="text-xs text-[#eb4e62] font-semibold">{errors.categories.message}</p>
                )}
              </div>

              {/* Pricing Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">Price From (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    placeholder="50000"
                    {...register('priceFrom')}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#e6e6ea] focus:border-[#eb4e62] text-sm outline-hidden"
                  />
                  {errors.priceFrom && (
                    <p className="text-xs text-[#eb4e62] font-semibold">{errors.priceFrom.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">Price To (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    placeholder="150000"
                    {...register('priceTo')}
                    className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm outline-hidden ${
                      errors.priceTo ? 'border-[#eb4e62] bg-[#fde6ea]/20' : 'border-[#e6e6ea] focus:border-[#eb4e62]'
                    }`}
                  />
                  {errors.priceTo && (
                    <p className="text-xs text-[#eb4e62] font-semibold">{errors.priceTo.message}</p>
                  )}
                </div>
              </div>

              {/* Availability & Booking Note */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">Current Availability</label>
                  <select
                    {...register('availability')}
                    className="w-full h-11 px-3 rounded-xl bg-white border border-[#e6e6ea] focus:border-[#eb4e62] text-sm outline-hidden"
                  >
                    <option value="Available">Available for bookings</option>
                    <option value="Busy">Limited availability</option>
                    <option value="On Tour">On Tour</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">Booking Note / Rider details</label>
                  <input
                    type="text"
                    maxLength={300}
                    placeholder="e.g. Requires 2 weeks advance notice for outstation shows"
                    {...register('bookingNote')}
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#e6e6ea] focus:border-[#eb4e62] text-sm outline-hidden"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Section 4 - Social Links & Fanbase */}
          <FormSection
            id="sec-social"
            title="4. Social Links & Fanbase"
            description="Verified platform URLs and audience distribution numbers."
          >
            <div className="space-y-6">
              {/* Social URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">Instagram URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/..."
                    {...register('instagram')}
                    className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                  />
                  {errors.instagram && <p className="text-xs text-[#eb4e62]">{errors.instagram.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">YouTube Channel URL</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/@..."
                    {...register('youtube')}
                    className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                  />
                  {errors.youtube && <p className="text-xs text-[#eb4e62]">{errors.youtube.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">Spotify Artist URL</label>
                  <input
                    type="url"
                    placeholder="https://open.spotify.com/artist/..."
                    {...register('spotify')}
                    className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                  />
                  {errors.spotify && <p className="text-xs text-[#eb4e62]">{errors.spotify.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">Facebook Page URL</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/..."
                    {...register('facebook')}
                    className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                  />
                  {errors.facebook && <p className="text-xs text-[#eb4e62]">{errors.facebook.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">X (Twitter) URL</label>
                  <input
                    type="url"
                    placeholder="https://x.com/..."
                    {...register('x')}
                    className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">Official Website URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    {...register('website')}
                    className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                  />
                </div>

                {/* IMDb URL: Show ONLY if Actor is in Categories */}
                {isActorSelected && (
                  <div className="sm:col-span-2 space-y-1 p-3.5 rounded-xl bg-[#fff4d6]/60 border border-[#fde199] animate-fade-in">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#8a5a00]">
                      <Film className="h-4 w-4" />
                      <span>IMDb Profile URL (Visible because Actor category is chosen)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.imdb.com/name/nm..."
                      {...register('imdbUrl')}
                      className="w-full h-10 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                    {errors.imdbUrl && <p className="text-xs text-[#eb4e62]">{errors.imdbUrl.message}</p>}
                  </div>
                )}
              </div>

              {/* Fanbase Numbers */}
              <div className="pt-4 border-t border-[#f6f6f7] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#1b1b1f]">
                      Fanbase Numbers (Donut Chart &amp; Cards)
                    </h4>
                    <p className="text-xs text-[#6b6b76]">
                      Leave empty to hide platform card. Numbers auto-calculate total followers.
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#f6f6f7] text-xs font-bold text-[#1b1b1f]">
                    <span>Total Calculated: </span>
                    <span className="text-[#eb4e62] font-black">{totalFollowersCalc}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Spotify Followers</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 31900000"
                      {...register('fanbaseSpotify')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">YouTube Subscribers</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 7900000"
                      {...register('fanbaseYouTube')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Instagram Followers</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 19000000"
                      {...register('fanbaseInstagram')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Facebook Followers</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 30900000"
                      {...register('fanbaseFacebook')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">Deezer Fans</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 108700"
                      {...register('fanbaseDeezer')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">SoundCloud Followers</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 77600"
                      {...register('fanbaseSoundCloud')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6b6b76] mb-1">TikTok Followers</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 7000000"
                      {...register('fanbaseTikTok')}
                      className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Section 5 - Gallery */}
          <FormSection
            id="sec-gallery"
            title="5. Photo Gallery"
            description="High-resolution performance and press photos (max 12, min 1 for publish)."
          >
            <Controller
              control={control}
              name="gallery"
              render={({ field }) => (
                <GalleryUploader
                  items={field.value || []}
                  onChange={field.onChange}
                  max={12}
                  error={errors.gallery?.message}
                />
              )}
            />
          </FormSection>

          {/* Section 6 - Videos & Clips */}
          <FormSection
            id="sec-videos"
            title="6. Videos & Clips"
            description="Up to 6 YouTube videos and up to 8 short vertical reels/shorts."
          >
            <div className="space-y-8">
              {/* Videos Sub-section */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-base text-[#1b1b1f]">
                  Latest YouTube Videos (Max 6)
                </h4>
                <Controller
                  control={control}
                  name="videos"
                  render={({ field }) => (
                    <DynamicList
                      items={field.value || []}
                      max={6}
                      addLabel="Add Video"
                      onAdd={() => {
                        const newV = {
                          id: `v-${Date.now()}`,
                          title: '',
                          url: '',
                          duration: '',
                        };
                        field.onChange([...(field.value || []), newV]);
                      }}
                      onRemove={(idx) => {
                        field.onChange((field.value || []).filter((_, i) => i !== idx));
                      }}
                      renderItem={(vid, idx) => (
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-5">
                            <input
                              type="text"
                              maxLength={100}
                              placeholder="Video title *"
                              value={vid.title}
                              onChange={(e) => {
                                const next = [...(field.value || [])];
                                next[idx] = { ...next[idx], title: e.target.value };
                                field.onChange(next);
                              }}
                              className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                            />
                          </div>
                          <div className="sm:col-span-5">
                            <input
                              type="url"
                              placeholder="YouTube link (https://www.youtube.com/watch?v=...) *"
                              value={vid.url}
                              onChange={(e) => {
                                const next = [...(field.value || [])];
                                next[idx] = { ...next[idx], url: e.target.value };
                                field.onChange(next);
                              }}
                              className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              placeholder="Duration (e.g. 4:12)"
                              value={vid.duration || ''}
                              onChange={(e) => {
                                const next = [...(field.value || [])];
                                next[idx] = { ...next[idx], duration: e.target.value };
                                field.onChange(next);
                              }}
                              className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                            />
                          </div>
                        </div>
                      )}
                      error={errors.videos?.message}
                    />
                  )}
                />
              </div>

              {/* Clips Sub-section */}
              <div className="space-y-3 pt-4 border-t border-[#f6f6f7]">
                <h4 className="font-heading font-bold text-base text-[#1b1b1f]">
                  Short Clips &amp; Reels (Max 8)
                </h4>
                <Controller
                  control={control}
                  name="clips"
                  render={({ field }) => (
                    <DynamicList
                      items={field.value || []}
                      max={8}
                      addLabel="Add Clip"
                      onAdd={() => {
                        const newC = {
                          id: `c-${Date.now()}`,
                          title: '',
                          url: '',
                          platform: 'YouTube Shorts' as const,
                        };
                        field.onChange([...(field.value || []), newC]);
                      }}
                      onRemove={(idx) => {
                        field.onChange((field.value || []).filter((_, i) => i !== idx));
                      }}
                      renderItem={(clip, idx) => (
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              maxLength={100}
                              placeholder="Clip title *"
                              value={clip.title}
                              onChange={(e) => {
                                const next = [...(field.value || [])];
                                next[idx] = { ...next[idx], title: e.target.value };
                                field.onChange(next);
                              }}
                              className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                            />
                          </div>
                          <div className="sm:col-span-5">
                            <input
                              type="url"
                              placeholder="Reel / Shorts URL *"
                              value={clip.url}
                              onChange={(e) => {
                                const next = [...(field.value || [])];
                                next[idx] = { ...next[idx], url: e.target.value };
                                field.onChange(next);
                              }}
                              className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <select
                              value={clip.platform}
                              onChange={(e) => {
                                const next = [...(field.value || [])];
                                next[idx] = {
                                  ...next[idx],
                                  platform: e.target.value as 'YouTube Shorts' | 'Instagram Reels' | 'TikTok',
                                };
                                field.onChange(next);
                              }}
                              className="w-full h-9 px-2 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden"
                            >
                              <option value="YouTube Shorts">YouTube Shorts</option>
                              <option value="Instagram Reels">Instagram Reels</option>
                              <option value="TikTok">TikTok</option>
                            </select>
                          </div>
                        </div>
                      )}
                      error={errors.clips?.message}
                    />
                  )}
                />
              </div>
            </div>
          </FormSection>

          {/* Section 7 - Campaigns & Awards */}
          <FormSection
            id="sec-campaigns"
            title="7. Campaigns & Awards"
            description="Up to 6 commercial brand campaigns and up to 8 awards/recognition."
          >
            <div className="space-y-8">
              {/* Campaigns */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-base text-[#1b1b1f]">
                  Previous Brand Campaigns (Max 6)
                </h4>
                <Controller
                  control={control}
                  name="campaigns"
                  render={({ field }) => (
                    <DynamicList
                      items={field.value || []}
                      max={6}
                      addLabel="Add Campaign"
                      onAdd={() => {
                        const newCamp = {
                          id: `camp-${Date.now()}`,
                          brandName: '',
                          category: 'Commercial',
                          year: '2025',
                          description: '',
                        };
                        field.onChange([...(field.value || []), newCamp]);
                      }}
                      onRemove={(idx) => {
                        field.onChange((field.value || []).filter((_, i) => i !== idx));
                      }}
                      renderItem={(camp, idx) => (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                            <div className="sm:col-span-6">
                              <input
                                type="text"
                                maxLength={80}
                                placeholder="Brand / Project Name *"
                                value={camp.brandName}
                                onChange={(e) => {
                                  const next = [...(field.value || [])];
                                  next[idx] = { ...next[idx], brandName: e.target.value };
                                  field.onChange(next);
                                }}
                                className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <input
                                type="text"
                                placeholder="Category (e.g. TV Commercial)"
                                value={camp.category || ''}
                                onChange={(e) => {
                                  const next = [...(field.value || [])];
                                  next[idx] = { ...next[idx], category: e.target.value };
                                  field.onChange(next);
                                }}
                                className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                placeholder="Year (1990-2026)"
                                value={camp.year}
                                onChange={(e) => {
                                  const next = [...(field.value || [])];
                                  next[idx] = { ...next[idx], year: e.target.value };
                                  field.onChange(next);
                                }}
                                className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            maxLength={300}
                            placeholder="Short description of the campaign role..."
                            value={camp.description || ''}
                            onChange={(e) => {
                              const next = [...(field.value || [])];
                              next[idx] = { ...next[idx], description: e.target.value };
                              field.onChange(next);
                            }}
                            className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                          />
                        </div>
                      )}
                      error={errors.campaigns?.message}
                    />
                  )}
                />
              </div>

              {/* Awards */}
              <div className="space-y-3 pt-4 border-t border-[#f6f6f7]">
                <h4 className="font-heading font-bold text-base text-[#1b1b1f]">
                  Awards &amp; Accolades (Max 8)
                </h4>
                <Controller
                  control={control}
                  name="awards"
                  render={({ field }) => (
                    <DynamicList
                      items={field.value || []}
                      max={8}
                      addLabel="Add Award"
                      onAdd={() => {
                        const newAward = {
                          id: `aw-${Date.now()}`,
                          title: '',
                          category: 'Excellence',
                          year: '2025',
                          description: '',
                        };
                        field.onChange([...(field.value || []), newAward]);
                      }}
                      onRemove={(idx) => {
                        field.onChange((field.value || []).filter((_, i) => i !== idx));
                      }}
                      renderItem={(award, idx) => (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                            <div className="sm:col-span-6">
                              <input
                                type="text"
                                maxLength={100}
                                placeholder="Award Title *"
                                value={award.title}
                                onChange={(e) => {
                                  const next = [...(field.value || [])];
                                  next[idx] = { ...next[idx], title: e.target.value };
                                  field.onChange(next);
                                }}
                                className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <input
                                type="text"
                                placeholder="Award Category"
                                value={award.category || ''}
                                onChange={(e) => {
                                  const next = [...(field.value || [])];
                                  next[idx] = { ...next[idx], category: e.target.value };
                                  field.onChange(next);
                                }}
                                className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                placeholder="Year"
                                value={award.year}
                                onChange={(e) => {
                                  const next = [...(field.value || [])];
                                  next[idx] = { ...next[idx], year: e.target.value };
                                  field.onChange(next);
                                }}
                                className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            maxLength={300}
                            placeholder="Description of honor or issuing organization..."
                            value={award.description || ''}
                            onChange={(e) => {
                              const next = [...(field.value || [])];
                              next[idx] = { ...next[idx], description: e.target.value };
                              field.onChange(next);
                            }}
                            className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                          />
                        </div>
                      )}
                      error={errors.awards?.message}
                    />
                  )}
                />
              </div>
            </div>
          </FormSection>

          {/* Section 8 - FAQs (Platinum Only) */}
          <FormSection
            id="sec-faqs"
            title="8. Frequently Asked Questions"
            description="Booking questions answered upfront. Platinum class artists only."
          >
            {!isPlatinumClass ? (
              <div className="p-4 rounded-xl bg-[#fff4d6] border border-[#fde199] text-xs text-[#8a5a00] flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 shrink-0" />
                <span>
                  FAQs are only shown for <strong>Platinum</strong> artists. Change Artist Class to Platinum under Basic Details to add FAQs.
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <Controller
                  control={control}
                  name="faqs"
                  render={({ field }) => (
                    <DynamicList
                      items={field.value || []}
                      max={8}
                      addLabel="Add FAQ"
                      onAdd={() => {
                        const newFaq = { question: '', answer: '' };
                        field.onChange([...(field.value || []), newFaq]);
                      }}
                      onRemove={(idx) => {
                        field.onChange((field.value || []).filter((_, i) => i !== idx));
                      }}
                      renderItem={(faq, idx) => (
                        <div className="space-y-2">
                          <input
                            type="text"
                            maxLength={200}
                            placeholder="Question (e.g. What is the standard live set duration?)"
                            value={faq.question}
                            onChange={(e) => {
                              const next = [...(field.value || [])];
                              next[idx] = { ...next[idx], question: e.target.value };
                              field.onChange(next);
                            }}
                            className="w-full h-9 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                          />
                          <textarea
                            rows={2}
                            maxLength={500}
                            placeholder="Answer for booking organizers..."
                            value={faq.answer}
                            onChange={(e) => {
                              const next = [...(field.value || [])];
                              next[idx] = { ...next[idx], answer: e.target.value };
                              field.onChange(next);
                            }}
                            className="w-full p-2.5 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                          />
                        </div>
                      )}
                      error={errors.faqs?.message}
                    />
                  )}
                />
              </div>
            )}
          </FormSection>

          {/* Section 9 - SEO */}
          <FormSection
            id="sec-seo"
            title="9. SEO & Social Meta"
            description="Control how this artist ranks on Google search and appears when shared on WhatsApp or social media."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#1b1b1f]">Meta Title</label>
                    <span className="text-[11px] font-mono text-[#6b6b76]">
                      {(formValues.metaTitle || '').length} / 60
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="Sahil Badal | KalaSquare"
                    {...register('metaTitle')}
                    className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#1b1b1f]">Meta Description</label>
                    <span className="text-[11px] font-mono text-[#6b6b76]">
                      {(formValues.metaDescription || '').length} / 160
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={160}
                    placeholder="Directly book Sahil Badal for live concerts and Sufi fusion..."
                    {...register('metaDescription')}
                    className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-[#1b1b1f]">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    maxLength={200}
                    placeholder="e.g. singer, sufi singer, live band delhi, book sahil badal"
                    {...register('keywords')}
                    className="w-full h-10 px-3 rounded-lg border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                  />
                </div>
              </div>

              {/* SEO Live Preview Component */}
              <div className="pt-2 border-t border-[#f6f6f7]">
                <SEOPreview
                  slug={formValues.slug}
                  metaTitle={formValues.metaTitle}
                  metaDescription={formValues.metaDescription}
                  artistName={formValues.name}
                />
              </div>
            </div>
          </FormSection>

          {/* Section 10 - Publish Settings */}
          <FormSection
            id="sec-publish"
            title="10. Visibility & Publishing"
            description="Control publication state. Drafts return 404 on the public site."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                    formValues.status === 'draft'
                      ? 'border-[#eb4e62] bg-[#fde6ea]/40'
                      : 'border-[#e6e6ea] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    value="draft"
                    {...register('status', {
                      onChange: (e) => {
                        if (e.target.value === 'draft' && initialData?.status === 'published') {
                          setShowUnpublishModal(true);
                        }
                      },
                    })}
                    className="w-4 h-4 text-[#eb4e62] focus:ring-[#eb4e62]"
                  />
                  <div>
                    <span className="font-heading font-bold text-sm text-[#1b1b1f] block">
                      Save as Draft
                    </span>
                    <span className="text-xs text-[#6b6b76]">
                      Hidden from public search and profile page (returns 404).
                    </span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                    formValues.status === 'published'
                      ? 'border-[#1a8a57] bg-[#e8f7ee]'
                      : 'border-[#e6e6ea] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    value="published"
                    {...register('status')}
                    className="w-4 h-4 text-[#1a8a57] focus:ring-[#1a8a57]"
                  />
                  <div>
                    <span className="font-heading font-bold text-sm text-[#1b1b1f] block">
                      Published &amp; Live
                    </span>
                    <span className="text-xs text-[#6b6b76]">
                      Visible immediately on Home Page and `/top-creators/{formValues.slug || 'slug'}`.
                    </span>
                  </div>
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f6f6f7] text-xs text-[#6b6b76]">
                <strong>Visibility Note:</strong> Draft profiles safely return a 404 status code on the public site. Only published profiles appear in category carousels and search index.
              </div>
            </div>
          </FormSection>

          {/* Unpublish Confirmation Modal */}
          {showUnpublishModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e6e6ea] space-y-4 animate-scale-up">
                <div className="flex items-center gap-3 text-[#eb4e62]">
                  <AlertCircle className="h-6 w-6" />
                  <h3 className="font-heading font-extrabold text-lg text-[#1b1b1f]">
                    Unpublish this artist?
                  </h3>
                </div>
                <p className="text-sm text-[#6b6b76] leading-relaxed">
                  Changing to Draft will immediately make this profile return a 404 page on the public site. Do you wish to continue?
                </p>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setValue('status', 'published');
                      setShowUnpublishModal(false);
                    }}
                    className="h-10 px-4 rounded-xl border border-[#e6e6ea] text-xs font-bold text-[#1b1b1f]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('status', 'draft');
                      setShowUnpublishModal(false);
                    }}
                    className="h-10 px-5 rounded-xl bg-[#eb4e62] text-white text-xs font-bold"
                  >
                    Yes, Unpublish
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e6e6ea] p-4 shadow-lg">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Completeness Bar + Tip */}
          <div className="flex-1 w-full max-w-xl">
            <CompletenessBar
              score={completeness.score}
              tip={completeness.tip}
              variant="sticky"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            {formValues.slug && (
              <Link
                href={`/top-creators/${formValues.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-4 rounded-xl bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-xs font-bold text-[#1b1b1f] transition inline-flex items-center gap-1.5"
              >
                <span>Preview</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}

            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-11 px-4 rounded-xl bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-xs font-bold text-[#1b1b1f] transition cursor-pointer"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={handleSubmit(onPublishSubmit, onPublishErrors)}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
