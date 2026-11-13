import React from 'react';
import { QuickStats } from '@/lib/types';

interface ArtistQuickStatsProps {
    stats: QuickStats;
}

export default function ArtistQuickStats({ stats }: ArtistQuickStatsProps) {
    const items = [
        { value: stats.experienceYears, label: 'Years of Experience' },
        { value: stats.projectsCount, label: 'Projects Completed' },
        { value: stats.liveShowsCount, label: 'Live Shows Hosted' },
        { value: stats.totalFollowersLabel, label: 'Total Fanbase' },
    ].filter((item) => Boolean(item.value));

    if (items.length === 0) return null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-[18px] p-5 border border-[#e6e6ea] shadow-xs flex flex-col justify-between hover:border-[#eb4e62] transition duration-200"
                >
                    <p className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                        {item.value}
                    </p>
                    <p className="text-xs sm:text-sm text-[#6b6b76] font-medium mt-1">
                        {item.label}
                    </p>
                </div>
            ))}
        </div>
    );
}
