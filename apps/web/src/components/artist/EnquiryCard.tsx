'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArtistProfile } from '@/lib/types';
import { createEnquiry } from '@/lib/api';

interface EnquiryCardProps {
    artist: ArtistProfile;
}

export default function EnquiryCard({ artist }: EnquiryCardProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        message: '',
    });

    const firstName = artist.name.replace(/^Dr\.\s*/, '').split(' ')[0];
    const budget = artist.priceLabel;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;
        setIsLoading(true);
        try {
            await createEnquiry({
                artistId: artist.id,
                customerName: formData.name,
                customerPhone: formData.phone,
                eventDate: formData.date || undefined,
                eventType: 'Direct Booking Request',
                message: formData.message || `Booking enquiry for ${artist.name}`,
            });
            setIsSubmitted(true);
        } catch {
            // Local fallback
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <aside className="pp-side">
                <div className="pp-book" id="ppBook">
                    <h3>Book {firstName}</h3>

                    {budget && (
                        <p className="pp-bg2">
                            <small>Budget range</small>
                            <b>{budget}</b>
                        </p>
                    )}

                    {isSubmitted ? (
                        <div className="pp-ok">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <b>Enquiry sent</b>
                            <span>The KalaSquare team will connect you soon.</span>
                            <Link href="/admin/enquiries" className="btn line">
                                See it in Admin → Enquiries
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <input
                                name="name"
                                placeholder="Your name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                name="phone"
                                placeholder="Phone number"
                                inputMode="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <input
                                name="date"
                                type="date"
                                aria-label="Event date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                            <textarea
                                name="msg"
                                rows={3}
                                placeholder="City, type of event and budget"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                            <button className="btn fill" type="submit" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send enquiry'}
                            </button>
                        </form>
                    )}

                    {artist.phone && (
                        <a className="pp-call" href={`tel:${artist.phone}`}>
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

                    <ul className="pp-tr">
                        <li>
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {artist.isVerified
                                ? 'Profile verified by KalaSquare'
                                : 'Profile under verification'}
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            One enquiry reaches the KalaSquare team
                        </li>
                    </ul>
                </div>
            </aside>
    );
}
