'use client';

import React from 'react';
import { QuickStats } from '@/lib/types';

interface ArtistQuickStatsProps {
    stats?: QuickStats;
}

export default function ArtistQuickStats({ stats }: ArtistQuickStatsProps) {
    if (!stats) return null;

    const items = [
        { value: stats.experienceYears, label: 'Years of experience' },
        { value: stats.projectsCount, label: 'Projects' },
        { value: stats.liveShowsCount, label: 'Live shows' },
        { value: stats.totalFollowersLabel, label: 'Total followers' },
    ].filter((item) => Boolean(item.value));

    if (items.length === 0) return null;

    return (
        <div className="wrap pp-stw">
            <div className="pp-sts rv in">
                {items.map((item, idx) => (
                    <div key={idx} className="pp-st">
                        <b>{item.value}</b>
                        <small>{item.label}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}
