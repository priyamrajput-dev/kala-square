'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Phone, ShieldCheck, Clock } from 'lucide-react';
import { ArtistProfile } from '@/lib/types';

interface EnquiryCardProps {
    artist: ArtistProfile;
}

export default function EnquiryCard({ artist }: EnquiryCardProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        message: '',
    });

    const firstName = artist.name.replace(/^Dr\.\s*/, '').split(' ')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;
        setIsSubmitted(true);
    };

    return (
        <>
            {/* Desktop Sticky Sidebar Card */}
            <aside className="scroll-mt-36 sticky top-28 space-y-4" id="pp-enquiry">
                <div className="bg-white rounded-[20px] p-6 border border-[#e6e6ea] shadow-md space-y-5">
                    {/* Header */}
                    <div>
                        <h3 className="font-heading font-extrabold text-2xl text-[#1b1b1f]">
                            Book {firstName}
                        </h3>
                        {artist.priceLabel && (
                            <div className="mt-1 flex items-baseline gap-1.5">
                                <span className="text-xs text-[#6b6b76] uppercase tracking-wider font-semibold">
                                    Budget range
                                </span>
                                <span className="font-heading font-extrabold text-lg text-[#eb4e62]">
                                    {artist.priceLabel}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Form or Success State */}
                    {isSubmitted ? (
                        <div className="p-5 rounded-2xl bg-[#e8f7ee] border border-[#a3e4bb] text-center space-y-3 animate-fade-in">
                            <div className="w-12 h-12 rounded-full bg-[#1a8a57] text-white flex items-center justify-center mx-auto shadow-sm">
                                <Check className="h-6 w-6 stroke-[3]" />
                            </div>
                            <h4 className="font-heading font-extrabold text-lg text-[#1a8a57]">
                                Enquiry sent!
                            </h4>
                            <p className="text-xs text-[#1a8a57]/90 leading-relaxed">
                                The KalaSquare team and creator manager will contact you soon.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center justify-center text-xs font-bold text-[#1a8a57] hover:underline"
                                >
                                    See it in Admin &rarr;
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            <div>
                                <input
                                    type="text"
                                    required
                                    placeholder="Your full name *"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full h-11 px-3.5 rounded-xl bg-[#f6f6f7] border border-transparent focus:border-[#eb4e62] focus:bg-white text-sm outline-hidden transition"
                                />
                            </div>

                            <div>
                                <input
                                    type="tel"
                                    required
                                    inputMode="tel"
                                    placeholder="Phone number (10 digits) *"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="w-full h-11 px-3.5 rounded-xl bg-[#f6f6f7] border border-transparent focus:border-[#eb4e62] focus:bg-white text-sm outline-hidden transition"
                                />
                            </div>

                            <div>
                                <input
                                    type="date"
                                    aria-label="Event date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: e.target.value })
                                    }
                                    className="w-full h-11 px-3.5 rounded-xl bg-[#f6f6f7] border border-transparent focus:border-[#eb4e62] focus:bg-white text-sm text-[#6b6b76] outline-hidden transition"
                                />
                            </div>

                            <div>
                                <textarea
                                    rows={3}
                                    placeholder="City, type of event, budget range..."
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({ ...formData, message: e.target.value })
                                    }
                                    className="w-full p-3.5 rounded-xl bg-[#f6f6f7] border border-transparent focus:border-[#eb4e62] focus:bg-white text-sm outline-hidden transition resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full h-12 rounded-[10px] bg-[#eb4e62] hover:bg-[#d63a50] text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
                            >
                                Send Enquiry
                            </button>
                        </form>
                    )}

                    {/* Talk to Creator Phone Link */}
                    {artist.phone && (
                        <a
                            href={`tel:${artist.phone}`}
                            className="w-full h-11 rounded-[10px] bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-[#1b1b1f] font-bold text-xs flex items-center justify-center gap-2 transition"
                        >
                            <Phone className="h-4 w-4 text-[#eb4e62]" />
                            <span>Talk to creator</span>
                        </a>
                    )}

                    {/* Trust Guarantees */}
                    <div className="pt-2 border-t border-[#f6f6f7] space-y-2 text-xs text-[#6b6b76]">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#1a8a57] shrink-0" />
                            <span>
                                {artist.isVerified
                                    ? 'Profile verified by KalaSquare'
                                    : 'Profile under verification'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#eb4e62] shrink-0" />
                            <span>Direct response within 2-4 business hours</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sticky Enquiry Bottom Bar (Visible on mobile only, hidden on lg+) */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#e6e6ea] px-4 py-3 shadow-lg flex items-center justify-between gap-3">
                <div>
                    <span className="text-[10px] uppercase font-bold text-[#6b6b76] block">
                        {artist.name}
                    </span>
                    <span className="font-heading font-extrabold text-sm text-[#eb4e62]">
                        {artist.priceLabel || 'From ₹50,000'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {artist.phone && (
                        <a
                            href={`tel:${artist.phone}`}
                            className="h-10 px-3.5 rounded-[10px] border border-[#e6e6ea] bg-white text-[#1b1b1f] text-xs font-bold flex items-center justify-center"
                        >
                            Call
                        </a>
                    )}
                    <a
                        href="#pp-enquiry"
                        className="h-10 px-5 rounded-[10px] bg-[#eb4e62] hover:bg-[#d63a50] text-white text-xs font-bold shadow-md flex items-center justify-center"
                    >
                        Send Enquiry
                    </a>
                </div>
            </div>
        </>
    );
}
