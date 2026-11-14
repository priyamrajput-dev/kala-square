'use client';

import React from 'react';
import { FanbasePlatform } from '@/lib/types';

interface FanbaseChartProps {
    fanbase?: FanbasePlatform[];
}

export default function FanbaseChart({ fanbase }: FanbaseChartProps) {
    if (!fanbase || fanbase.length === 0) return null;

    const activePlatforms = fanbase.filter((p) => p.numValue > 0);
    if (activePlatforms.length === 0) return null;

    const total = activePlatforms.reduce((sum, p) => sum + p.numValue, 0);

    const fmtBig = (n: number) => {
        if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
        return n.toLocaleString();
    };

    const R = 74;
    const C = 2 * Math.PI * R; // ~464.96
    const gap = activePlatforms.length > 1 ? 4 : 0;
    let pos = 0;

    const segments = activePlatforms.map((r) => {
        const len = Math.max(2, (r.numValue / total) * C - gap);
        const o = -pos;
        pos += (r.numValue / total) * C;
        return {
            key: r.key,
            color: r.color,
            len: len.toFixed(1),
            o: o.toFixed(1),
            C: C.toFixed(1),
        };
    });

    const renderBrandIcon = (key: string) => {
        if (key === 'fbSp') {
            return (
                <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
                    <circle cx="16" cy="16" r="15" fill="#1DB954" />
                    <path
                        d="M8 12c5-1.5 11-1 15 1.5M9 16.5c4-1 8-.7 11.5 1.3M10 20.7c3-.7 6-.4 8.5 1"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
            );
        }
        if (key === 'fbYt') {
            return (
                <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
                    <rect x="1" y="6" width="30" height="20" rx="6" fill="#FF0000" />
                    <path d="M13 11.5v9l8-4.5z" fill="#fff" />
                </svg>
            );
        }
        if (key === 'fbIg') {
            return (
                <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
                    <defs>
                        <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
                            <stop offset="0" stopColor="#FEDA75" />
                            <stop offset=".4" stopColor="#FA7E1E" />
                            <stop offset=".7" stopColor="#D62976" />
                            <stop offset="1" stopColor="#4F5BD5" />
                        </linearGradient>
                    </defs>
                    <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#ig-grad)" />
                    <rect x="8" y="8" width="16" height="16" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
                    <circle cx="16" cy="16" r="3.8" fill="none" stroke="#fff" strokeWidth="2" />
                    <circle cx="21" cy="11" r="1.2" fill="#fff" />
                </svg>
            );
        }
        if (key === 'fbFb') {
            return (
                <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
                    <rect x="1" y="1" width="30" height="30" rx="7" fill="#1877F2" />
                    <path
                        d="M21 31V19.5h3.8l.7-4.5H21v-2.8c0-1.3.6-2.2 2.3-2.2h2.3V6.2S23.8 6 22.2 6C18.8 6 16.7 8 16.7 11.6V15H13v4.5h3.7V31z"
                        fill="#fff"
                    />
                </svg>
            );
        }
        if (key === 'fbDz') {
            return (
                <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
                    <rect x="3" y="21" width="4" height="4" fill="#A238FF" />
                    <rect x="9" y="17" width="4" height="8" fill="#A238FF" />
                    <rect x="15" y="12" width="4" height="13" fill="#A238FF" />
                    <rect x="21" y="7" width="4" height="18" fill="#A238FF" />
                    <rect x="27" y="14" width="3" height="11" fill="#A238FF" />
                </svg>
            );
        }
        if (key === 'fbSc') {
            return (
                <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
                    <path d="M3 20v3M7 17v6M11 14v9M15 11v12M19 9v14" stroke="#FF5500" strokeWidth="2.6" strokeLinecap="round" />
                    <path d="M22 23h5a4 4 0 0 0 0-8c-.3 0-.6 0-.9.1A5.5 5.5 0 0 0 22 11z" fill="#FF5500" />
                </svg>
            );
        }
        if (key === 'fbTt') {
            return (
                <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
                    <circle cx="16" cy="16" r="15" fill="#161616" />
                    <path d="M17.5 8v10.5a2.7 2.7 0 1 1-2.7-2.7M17.5 8c.3 2.3 1.8 3.8 4.2 4" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                </svg>
            );
        }
        return (
            <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
                <circle cx="16" cy="16" r="15" fill="#1877F2" />
            </svg>
        );
    };

    return (
        <section className="pp-s rv in" id="pp-fanbase">
            <div className="pp-sh">
                <h2>Total fanbase distribution</h2>
                <p>Audience across platforms.</p>
            </div>

            <div className="pp-fb rv in">
                {/* Donut Chart */}
                <div className="pp-dn">
                    <svg viewBox="0 0 200 200" role="img" aria-label="Fanbase split by platform">
                        <g transform="rotate(-90 100 100)">
                            {segments.map((s) => (
                                <circle
                                    key={s.key}
                                    className="sg"
                                    cx="100"
                                    cy="100"
                                    r={R}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth="22"
                                    style={{
                                        strokeDasharray: `${s.len} ${s.C}`,
                                        strokeDashoffset: s.o,
                                    }}
                                />
                            ))}
                        </g>
                    </svg>
                    <div className="ct">
                        <b>{fmtBig(total)}</b>
                        <small>Total fanbase</small>
                    </div>
                </div>

                {/* Platform Cards */}
                <div className="pp-fc">
                    {activePlatforms.map((r) => (
                        <div key={r.key} className="pp-fk">
                            <span className="ic">{renderBrandIcon(r.key)}</span>
                            <small>{r.name}</small>
                            <b>{r.count || fmtBig(r.numValue)}</b>
                            <span>{r.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
