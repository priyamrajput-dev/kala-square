'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { GalleryImage } from '@/lib/types';

interface GalleryLightboxProps {
  gallery: GalleryImage[];
}

export default function GalleryLightbox({ gallery }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isOpen = selectedIndex !== null;

  const handleOpen = (idx: number) => {
    setSelectedIndex(idx);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + gallery.length) % gallery.length);
  }, [selectedIndex, gallery.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % gallery.length);
  }, [selectedIndex, gallery.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext]);

  if (!gallery || gallery.length === 0) return null;

  const displayPhotos = gallery.slice(0, 4);
  const remainingCount = gallery.length - 4;

  return (
    <section className="scroll-mt-36 bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6" id="pp-gallery">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
            Gallery &amp; media
          </h2>
          <p className="text-sm text-[#6b6b76] mt-1">
            Stage performances, behind the scenes, and high-resolution press photos.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6f6f7] text-xs font-bold text-[#6b6b76]">
          <Images className="h-3.5 w-3.5" />
          <span>{gallery.length} Photos</span>
        </span>
      </div>

      {/* 4 Photos Grid (aspect 3/2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {displayPhotos.map((photo, idx) => {
          const isFourthWithMore = idx === 3 && remainingCount > 0;

          return (
            <button
              key={photo.id || idx}
              type="button"
              onClick={() => handleOpen(idx)}
              className="group relative aspect-[3/2] w-full rounded-2xl overflow-hidden bg-[#f6f6f7] border border-[#e6e6ea] shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#eb4e62] cursor-pointer"
              aria-label={`Open photo ${idx + 1}`}
            >
              <Image
                src={photo.src}
                alt={photo.title || `Gallery photo ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, 25vw"
              />

              {/* +X View More Overlay for 4th photo */}
              {isFourthWithMore && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 text-center group-hover:bg-black/70 transition">
                  <span className="font-heading font-extrabold text-xl sm:text-2xl">
                    +{remainingCount}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                    View More
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {isOpen && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close photo viewer"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Counter */}
          <span className="absolute top-5 left-6 text-sm font-semibold text-white/80 z-10">
            {selectedIndex + 1} / {gallery.length}
          </span>

          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer z-10"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Full Image Container */}
          <div className="relative w-full max-w-5xl h-[70vh] sm:h-[80vh] flex items-center justify-center">
            <Image
              src={gallery[selectedIndex].src}
              alt={gallery[selectedIndex].title || `Photo ${selectedIndex + 1}`}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer z-10"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Caption text if available */}
          {gallery[selectedIndex].title && (
            <div className="absolute bottom-5 inset-x-0 text-center text-sm font-medium text-white/80 pointer-events-none">
              {gallery[selectedIndex].title}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
