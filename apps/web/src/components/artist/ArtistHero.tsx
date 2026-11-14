'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArtistProfile } from '@/lib/types';

interface ArtistHeroProps {
    artist: ArtistProfile;
}

export default function ArtistHero({ artist }: ArtistHeroProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleShare = async () => {
        const cleanUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/top-creators/${artist.slug}`
            : `https://kalasquare.com/top-creators/${artist.slug}`;

        let success = false;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: `${artist.name} | KalaSquare`,
                    text: `Check out ${artist.name}'s profile on KalaSquare`,
                    url: cleanUrl,
                });
                success = true;
            } catch {
                // Share sheet cancelled or unsupported, fallback to copy
            }
        }

        if (!success && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(cleanUrl);
                success = true;
            } catch {
                success = false;
            }
        }
        if (!success && typeof document !== 'undefined') {
            try {
                const ta = document.createElement('textarea');
                ta.value = cleanUrl;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                success = true;
            } catch {
                success = false;
            }
        }

        showToast('Profile link copied.');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleToggleSave = () => {
        const next = !isSaved;
        setIsSaved(next);
        showToast(next ? 'Saved to your list.' : 'Removed from your list.');
    };

    // Social links
    const soc = [
        ['Instagram', artist.social?.instagram],
        ['YouTube', artist.social?.youtube],
        ['Facebook', artist.social?.facebook],
        ['Spotify', artist.social?.spotify],
        ['X', artist.social?.x],
        ['IMDb', artist.social?.imdb],
    ].filter((x) => Boolean(x[1])) as [string, string][];

    // Tagline lines split by bullet or newline
    const lines = (artist.tagline || '')
        .split(/\s*[·\n]\s*/)
        .map((l) => l.trim())
        .filter(Boolean);

    const handleScrollToBook = (e: React.MouseEvent) => {
        e.preventDefault();
        const bookEl = document.getElementById('ppBook');
        if (bookEl) {
            const headerOffset =
                (document.getElementById('demoBar')?.offsetHeight || 0) +
                ((document.querySelector('header') as HTMLElement | null)?.offsetHeight || 0) +
                ((document.querySelector('.pp-tb') as HTMLElement | null)?.offsetHeight || 0) + 16;
            const y = bookEl.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
            const input = bookEl.querySelector('input');
            if (input) {
                setTimeout(() => input.focus({ preventScroll: true }), 450);
            }
        }
    };

    // Initial character
    const avaChar = artist.name.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();

    // Review counts & rating (0 when no reviews, matching manager.html line 2023)
    const hasReviews = (artist.reviews && artist.reviews.length > 0) || (artist.reviewsCount ? artist.reviewsCount > 0 : false);
    const ratingVal = artist.rating > 0 ? artist.rating.toFixed(1) : '0.0';
    const reviewsNum = artist.reviewsCount || 0;

    const isPlatinum = artist.artistClass === 'platinum';
    const isVerified = artist.isVerified;

    return (
        <header className="pp-hero">
            {/* Blurred background photo */}
            {artist.photoUrl && (
                <div
                    className="pp-bg"
                    style={{ backgroundImage: `url(${artist.photoUrl})` }}
                />
            )}
            <div className="pp-shape s1" />
            <div className="pp-shape s2" />

            <div className="wrap pp-hw">
                {/* Top bar: Back to Home + Edit in Admin */}
                <div className="pp-bar">
                    <Link href="/" className="pp-back">
                        <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to home
                    </Link>

                    <Link
                        href={`/admin/artists/new?edit=${artist.id}`}
                        className="dm-edit-b"
                    >
                        Edit in Admin
                    </Link>
                </div>

                {/* Hero Grid */}
                <div className="pp-hg">
                    {/* Left: Avatar / Photo */}
                    <div
                        className={`pp-ph ${artist.photoUrl ? 'has' : ''}`}
                        style={artist.photoUrl ? { backgroundImage: `url(${artist.photoUrl})` } : undefined}
                    >
                        {!artist.photoUrl && <span>{avaChar}</span>}
                        <div className="pp-rate">
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="#f5a300"
                                stroke="#f5a300"
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z" />
                            </svg>
                            <b>{hasReviews ? ratingVal : 'New'}</b>
                            {hasReviews && <small>{reviewsNum} review{reviewsNum > 1 ? 's' : ''}</small>}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="pp-hi">
                        {/* Badges */}
                        <div className="pp-bds">
                            {isPlatinum ? (
                                <span
                                    className="pp-bd g"
                                    tabIndex={0}
                                    data-tip="Platinum: one of the top artists on KalaSquare. Documents verified."
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="14"
                                        height="14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="12" cy="8" r="6" />
                                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                                    </svg>
                                    Platinum artist
                                </span>
                            ) : isVerified ? (
                                <span
                                    className="pp-bd b"
                                    tabIndex={0}
                                    data-tip="Verified: KalaSquare has checked this artist's documents."
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="14"
                                        height="14"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Verified by KalaSquare
                                </span>
                            ) : null}
                        </div>

                        {/* Name */}
                        <h1>{artist.name}</h1>

                        {/* Tagline lines */}
                        {lines.length > 0 && (
                            <div className="pp-ln">
                                {lines.map((l, i) => (
                                    <p key={i} style={{ ['--i' as any]: i }}>
                                        {l}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Location & Categories */}
                        <p className="pp-loc">
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            {artist.city}
                            {artist.state ? `, ${artist.state}` : ''}
                            <i />
                            {artist.categories.join(' · ')}
                        </p>

                        {/* Specializations pills */}
                        {artist.specializations && artist.specializations.length > 0 && (
                            <div className="pp-sp">
                                {artist.specializations.map((spec) => (
                                    <span key={spec}>{spec}</span>
                                ))}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="pp-cta">
                            <a className="btn fill" href="#ppBook" onClick={handleScrollToBook}>
                                Send enquiry
                            </a>

                            {artist.phone && (
                                <a className="btn line" href={`tel:${artist.phone}`}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    Talk to creator
                                </a>
                            )}

                            <button
                                type="button"
                                className="pp-ib"
                                onClick={handleShare}
                                aria-label="Share profile"
                                title={copied ? 'Profile link copied.' : 'Share profile'}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                className={`pp-ib ${isSaved ? 'on' : ''}`}
                                onClick={handleToggleSave}
                                aria-label="Save artist"
                                aria-pressed={isSaved}
                                title={isSaved ? 'Saved to your list.' : 'Save artist'}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="18"
                                    height="18"
                                    fill={isSaved ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                        </div>

                        {/* Social Links */}
                        {soc.length > 0 && (
                            <div className="pp-so">
                                <small>Connect on</small>
                                {soc.map(([name, url]) => (
                                    <a
                                        key={name}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Toast notification (matching Kalasquare HTML line 382 & line 2134) */}
            {toastMessage && (
                <div
                    className="toast show"
                    role="status"
                    aria-live="polite"
                    style={{
                        position: 'fixed',
                        left: '50%',
                        bottom: 'max(20px, env(safe-area-inset-bottom, 0px))',
                        transform: 'translate(-50%, 0)',
                        zIndex: 9999,
                        background: 'var(--ink, #1b1b1f)',
                        color: 'var(--bg, #ffffff)',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '14px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        pointerEvents: 'none',
                    }}
                >
                    {toastMessage}
                </div>
            )}
        </header>
    );
}
