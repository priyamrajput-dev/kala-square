'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GalleryImage } from '@/lib/types';

interface GalleryLightboxProps {
    gallery?: GalleryImage[];
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
        if (selectedIndex === null || !gallery) return;
        setSelectedIndex((selectedIndex - 1 + gallery.length) % gallery.length);
    }, [selectedIndex, gallery]);

    const handleNext = useCallback(() => {
        if (selectedIndex === null || !gallery) return;
        setSelectedIndex((selectedIndex + 1) % gallery.length);
    }, [selectedIndex, gallery]);

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
    const mClass = `m${Math.min(gallery.length, 4)}`;

    return (
        <section className="pp-s rv in" id="pp-gallery">
            <div className="pp-sh">
                <h2>Gallery &amp; media</h2>
                <p>
                    {gallery.length} photo{gallery.length > 1 ? 's' : ''}
                </p>
            </div>

            <div className={`pp-gal ${mClass}`}>
                {displayPhotos.map((g, i) => (
                    <button
                        key={g.id || i}
                        type="button"
                        className="pp-gi"
                        style={{ backgroundImage: `url(${g.src})` }}
                        onClick={() => handleOpen(i)}
                        aria-label={`Open photo ${i + 1}`}
                    >
                        {i === 3 && gallery.length > 4 && (
                            <span className="pp-gx">View More</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Lightbox Popup Modal */}
            {isOpen && (
                <div
                    className="pp-lb sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Photo viewer"
                    onClick={handleClose}
                >
                    <div className="lbb" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="x"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className="pv"
                            onClick={handlePrev}
                            aria-label="Previous photo"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={gallery[selectedIndex!].src}
                            alt={gallery[selectedIndex!].title || `Photo ${selectedIndex! + 1}`}
                        />

                        <button
                            type="button"
                            className="nx"
                            onClick={handleNext}
                            aria-label="Next photo"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>

                        <span className="ct">
                            {selectedIndex! + 1} / {gallery.length}
                        </span>
                    </div>
                </div>
            )}
        </section>
    );
}
