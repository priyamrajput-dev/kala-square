'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ArtistProfile } from '@/lib/types';

interface TabItem {
    id: string;
    label: string;
}

interface ArtistTabsProps {
    artist: ArtistProfile;
}

export default function ArtistTabs({ artist }: ArtistTabsProps) {
    const [activeTab, setActiveTab] = useState<string>('about');
    const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
    const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    const reviewsNum = (artist.reviews && artist.reviews.length > 0) ? artist.reviews.length : (artist.reviewsCount || 0);

    const tabs: TabItem[] = [
        { id: 'about', label: 'About' },
        ...(artist.fanbase && artist.fanbase.length > 0
            ? [{ id: 'fanbase', label: 'Fanbase' }]
            : []),
        ...(artist.gallery && artist.gallery.length > 0
            ? [{ id: 'gallery', label: 'Gallery' }]
            : []),
        ...(artist.videos && artist.videos.length > 0 ? [{ id: 'videos', label: 'Videos' }] : []),
        ...(artist.clips && artist.clips.length > 0 ? [{ id: 'reels', label: 'Reels' }] : []),
        ...(artist.categories.includes('Singer') && artist.topSongs && artist.topSongs.length > 0
            ? [{ id: 'music', label: 'Spotify' }]
            : []),
        ...((artist.campaigns && artist.campaigns.length > 0) ||
        (artist.awards && artist.awards.length > 0)
            ? [{ id: 'work', label: 'Work' }]
            : []),
        ...(artist.categories.includes('Actor') && artist.imdb
            ? [{ id: 'imdb', label: 'IMDb' }]
            : []),
        {
            id: 'reviews',
            label: `Reviews${reviewsNum > 0 ? ` (${reviewsNum})` : ''}`,
        },
    ];

    // Update red underline indicator position
    useEffect(() => {
        const activeBtn = tabRefs.current[activeTab];
        if (activeBtn) {
            setIndicatorStyle({
                left: activeBtn.offsetLeft,
                width: activeBtn.offsetWidth,
            });
        }
    }, [activeTab]);

    // Scrollspy effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 180;

            for (let i = tabs.length - 1; i >= 0; i--) {
                const el = document.getElementById(`pp-${tabs[i].id}`);
                if (el && el.offsetTop <= scrollPosition) {
                    setActiveTab(tabs[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tabs]);

    const scrollToSection = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(`pp-${id}`);
        if (element) {
            const yOffset = -140; // Sticky header + tab bar offset
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <nav className="pp-tabs" id="ppTabs" aria-label="Profile sections">
            <div className="wrap">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            ref={(el) => { tabRefs.current[tab.id] = el; }}
                            type="button"
                            onClick={() => scrollToSection(tab.id)}
                            className={isActive ? 'on' : ''}
                        >
                            {tab.label}
                        </button>
                    );
                })}
                <i
                    className="pp-ind"
                    style={{
                        transform: `translateX(${indicatorStyle.left}px)`,
                        width: `${indicatorStyle.width}px`,
                    }}
                />
            </div>
        </nav>
    );
}
