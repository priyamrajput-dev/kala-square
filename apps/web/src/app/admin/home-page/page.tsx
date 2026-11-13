'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Layout,
  Star,
  Users,
  Calendar,
  Building2,
  HelpCircle,
  Layers,
  Sparkles,
  PhoneCall,
  Flame,
} from 'lucide-react';
import { mockHomeConfig, mockArtists, mockEvents, mockVenues } from '@/lib/mock-data';
import { HomeConfig, homeConfigSchema } from '@/lib/validators/home-config';
import HomeSectionEditor from '@/components/admin/HomeSectionEditor';
import ConfirmModal from '@/components/admin/ConfirmModal';

const SECTIONS_META = [
  { id: 'hero', name: '1. Hero Section', icon: Layout },
  { id: 'platinum', name: '2. Platinum Artists', icon: Star },
  { id: 'newTalent', name: '3. New on KalaSquare', icon: Flame },
  { id: 'categories', name: '4. Find Talent By Category', icon: Layers },
  { id: 'spotlights', name: '5. Stage & Spotlights', icon: Sparkles },
  { id: 'events', name: '6. Featured Events', icon: Calendar },
  { id: 'rising', name: '7. Rising Artists', icon: Users },
  { id: 'venues', name: '8. Venues', icon: Building2 },
  { id: 'faq', name: '9. FAQ', icon: HelpCircle },
  { id: 'footer', name: '10. Footer Links', icon: Layout },
  { id: 'enquiryCta', name: '11. Enquiry Sticky CTA', icon: PhoneCall },
];

export default function HomePageManagerPage() {
  const [config, setConfig] = useState<HomeConfig>(mockHomeConfig);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Load from localStorage (or fallback to mockHomeConfig)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('kalasquare_home_config');
        if (raw) {
          const parsed = JSON.parse(raw);
          const validated = homeConfigSchema.safeParse(parsed);
          if (validated.success) {
            setConfig(validated.data);
          }
        }
      } catch (e) {
        console.error('Failed to load home config from localStorage', e);
      }
    }
  }, []);

  const handleConfigChange = (newConfig: HomeConfig) => {
    setConfig(newConfig);
    setIsDirty(true);
  };

  // Reorder Sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const currentOrder = [...config.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    handleConfigChange({ ...config, sectionOrder: currentOrder });
  };

  // Toggle Section Visibility
  const handleToggleVisibility = (sectionId: string) => {
    const sectionKey = sectionId as keyof HomeConfig;
    if (typeof config[sectionKey] === 'object' && 'isVisible' in (config[sectionKey] as any)) {
      const sectionObj = config[sectionKey] as any;
      handleConfigChange({
        ...config,
        [sectionKey]: {
          ...sectionObj,
          isVisible: !sectionObj.isVisible,
        },
      });
      showToast(
        `${sectionObj.isVisible ? 'Hidden' : 'Enabled'} ${sectionId} on Home Page.`
      );
    }
  };

  // Save Draft to localStorage
  const handleSaveDraft = () => {
    const now = new Date().toLocaleString();
    const updated = {
      ...config,
      lastSaved: now,
    };
    setConfig(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalasquare_home_config', JSON.stringify(updated));
    }
    setIsDirty(false);
    showToast('Home Page saved as Draft in localStorage.');
  };

  // Publish validation & commit
  const handleExecutePublish = () => {
    const now = new Date().toLocaleString();
    const updated = {
      ...config,
      lastSaved: now,
      lastPublished: now,
    };

    // Validate visible sections
    const validation = homeConfigSchema.safeParse(updated);
    if (!validation.success) {
      alert(`Validation error: ${validation.error.errors[0]?.message}`);
      setIsPublishModalOpen(false);
      return;
    }

    setConfig(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalasquare_home_config', JSON.stringify(updated));
    }
    setIsDirty(false);
    setIsPublishModalOpen(false);
    showToast('Home Page configuration published live!');
  };

  // Open real home page preview in new tab
  const handlePreview = () => {
    // Save draft first so / reads latest
    if (typeof window !== 'undefined') {
      localStorage.setItem('kalasquare_home_config', JSON.stringify(config));
    }
    window.open('/', '_blank');
  };

  // Derive active section meta
  const activeMeta = SECTIONS_META.find((s) => s.id === activeSectionId);
  const activeSectionData = (config as any)[activeSectionId];

  return (
    <div className="space-y-6 pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b1b1f] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in border border-white/10">
          <CheckCircle2 className="h-4 w-4 text-[#eb4e62]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6e6ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
              Home Page Manager
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isDirty ? 'bg-[#fff4d6] text-[#8a6508]' : 'bg-[#e1f5ea] text-[#1a8a57]'
              }`}
            >
              {isDirty ? 'Unsaved Changes' : 'Synced'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6b6b76] mt-0.5">
            Control what shows on kalasquare.com, reorder carousel sections, and customize headlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePreview}
            className="h-10 px-4 rounded-xl border border-[#e6e6ea] bg-white hover:bg-[#f6f6f7] text-xs font-bold text-[#1b1b1f] transition flex items-center gap-1.5 shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#6b6b76]" />
            <span>Preview Home Page</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="h-10 px-4 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-white text-xs font-bold transition shadow-xs"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#1b1b1f] hover:bg-black text-white text-xs font-bold transition shadow-xs"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout (Section List on Left + Editor on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sticky Sections List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-[#e6e6ea] shadow-xs space-y-3 lg:sticky lg:top-20">
          <div className="flex items-center justify-between border-b border-[#f6f6f7] pb-3">
            <h3 className="font-heading font-bold text-sm text-[#1b1b1f]">
              Page Sections ({config.sectionOrder.length})
            </h3>
            <span className="text-[11px] text-[#6b6b76]">Reorder or hide</span>
          </div>

          <div className="space-y-1.5">
            {config.sectionOrder.map((sectionId, idx) => {
              const meta = SECTIONS_META.find((s) => s.id === sectionId);
              if (!meta) return null;
              const sectionData = (config as any)[sectionId];
              const isVisible = sectionData?.isVisible ?? true;
              const isSelected = activeSectionId === sectionId;
              const Icon = meta.icon;

              return (
                <div
                  key={sectionId}
                  onClick={() => setActiveSectionId(sectionId)}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-[#eb4e62] bg-[#fde6ea]/40 text-[#eb4e62]'
                      : 'border-[#e6e6ea] hover:bg-[#f6f6f7] text-[#1b1b1f]'
                  } ${!isVisible ? 'opacity-60 bg-neutral-50' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold truncate">{meta.name}</span>
                  </div>

                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(sectionId)}
                      className={`p-1.5 rounded-lg border transition ${
                        isVisible
                          ? 'border-[#1a8a57]/30 text-[#1a8a57] bg-[#e1f5ea]'
                          : 'border-[#e6e6ea] text-[#6b6b76]'
                      }`}
                      title={isVisible ? 'Hide Section' : 'Show Section'}
                    >
                      {isVisible ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* Up Reorder */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="p-1 rounded-md border border-[#e6e6ea] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-[#1b1b1f]"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    {/* Down Reorder */}
                    <button
                      type="button"
                      disabled={idx === config.sectionOrder.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="p-1 rounded-md border border-[#e6e6ea] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-[#1b1b1f]"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section Editor Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#e6e6ea] shadow-xs">
            <HomeSectionEditor
              activeSectionId={activeSectionId}
              config={config}
              onChange={handleConfigChange}
              availableArtists={mockArtists}
              availableEvents={mockEvents}
              availableVenues={mockVenues}
            />
          </div>

          {/* Mini Live Preview Box */}
          <div className="bg-white rounded-2xl p-5 border border-[#e6e6ea] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#f6f6f7] pb-2.5">
              <span className="text-xs font-bold text-[#6b6b76] uppercase tracking-wider">
                Live Preview Snapshot: {activeMeta?.name}
              </span>
              <span className="text-[11px] font-bold text-[#eb4e62]">Live Sync</span>
            </div>

            <div className="p-4 rounded-xl bg-[#f9f9fb] border border-[#e6e6ea] space-y-2 font-sans">
              <h4 className="font-heading font-extrabold text-base text-[#1b1b1f]">
                {activeSectionData?.title || activeSectionData?.heading || 'Section Title'}
              </h4>
              <p className="text-xs text-[#6b6b76] line-clamp-2">
                {activeSectionData?.subtitle ||
                  activeSectionData?.subtext ||
                  'Section description or lead copy preview.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e6e6ea] p-4 shadow-lg">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6b6b76]">
            Last saved: <strong className="text-[#1b1b1f]">{config.lastSaved || 'Today'}</strong>
            {config.lastPublished && (
              <span className="ml-3">
                · Published: <strong className="text-[#1a8a57]">{config.lastPublished}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="h-10 px-5 rounded-xl border border-[#e6e6ea] hover:bg-[#f6f6f7] text-xs font-bold text-[#1b1b1f] transition"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              className="h-10 px-6 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-white text-xs font-bold transition shadow-sm"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Modal */}
      <ConfirmModal
        isOpen={isPublishModalOpen}
        title="Publish Home Page Changes?"
        description="This will apply your updated section order, titles, and selected featured talent to the live public home page at kalasquare.com."
        confirmLabel="Publish to Live Site"
        cancelLabel="Keep Editing"
        variant="primary"
        onConfirm={handleExecutePublish}
        onCancel={() => setIsPublishModalOpen(false)}
      />
    </div>
  );
}

