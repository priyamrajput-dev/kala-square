'use client';

import React from 'react';
import { CampaignItem, AwardItem } from '@/lib/types';

interface CampaignsAwardsProps {
    campaigns?: CampaignItem[];
    awards?: AwardItem[];
}

export default function CampaignsAwards({ campaigns, awards }: CampaignsAwardsProps) {
    const hasCampaigns = campaigns && campaigns.length > 0;
    const hasAwards = awards && awards.length > 0;

    if (!hasCampaigns && !hasAwards) return null;

    return (
        <section className="pp-s rv in" id="pp-work">
            <div className="pp-sh">
                <h2>Work &amp; recognition</h2>
                <p>Campaigns, collaborations and awards.</p>
            </div>

            {/* Previous campaigns */}
            {hasCampaigns && (
                <>
                    <h3 className="pp-h3">Previous campaigns</h3>
                    <div className="pp-cg">
                        {campaigns.map((x) => (
                            <div key={x.id} className="pp-c">
                                <div className="pp-ci">
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                                        <polyline points="17 2 12 7 7 2" />
                                    </svg>
                                </div>
                                <b>{x.brandName}</b>
                                <small>{[x.category, x.year].filter(Boolean).join(' · ')}</small>
                                {x.description && <p>{x.description}</p>}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Awards */}
            {hasAwards && (
                <>
                    <h3 className="pp-h3" style={{ marginTop: hasCampaigns ? 28 : 0 }}>
                        Awards
                    </h3>
                    <div className="pp-cg">
                        {awards.map((x) => (
                            <div key={x.id} className="pp-c">
                                <div className="pp-ci">
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="8" r="7" />
                                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                                    </svg>
                                </div>
                                <b>{x.title}</b>
                                <small>{[x.category, x.year].filter(Boolean).join(' · ')}</small>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
