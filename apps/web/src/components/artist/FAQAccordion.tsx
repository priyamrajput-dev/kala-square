'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '@/lib/types';

interface FAQAccordionProps {
    artistClass: 'platinum' | 'rising' | 'emerging' | 'standard';
    artistName: string;
    faqs?: FAQItem[];
}

export default function FAQAccordion({ artistClass, artistName, faqs }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

    const isPlatinum = artistClass === 'platinum';
    if (!isPlatinum || !faqs || faqs.length === 0) return null;

    const firstName = artistName.replace(/^Dr\.\s*/, '').split(' ')[0];

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section
            className="scroll-mt-36 bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6"
            id="pp-faq"
        >
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#fde6ea] flex items-center justify-center text-[#eb4e62]">
                    <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                        Frequently asked questions
                    </h2>
                    <p className="text-sm text-[#6b6b76] mt-0.5">
                        Quick answers before booking {firstName} for your event.
                    </p>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                {faqs.map((faq, idx) => {
                    const isOpen = openIndex === idx;

                    return (
                        <div
                            key={idx}
                            className="rounded-xl border border-[#e6e6ea] overflow-hidden transition duration-200"
                        >
                            <button
                                type="button"
                                onClick={() => toggle(idx)}
                                className="w-full px-5 py-4 flex items-center justify-between text-left font-heading font-bold text-base text-[#1b1b1f] hover:text-[#eb4e62] bg-[#f6f6f7]/60 hover:bg-[#f6f6f7] transition cursor-pointer"
                                aria-expanded={isOpen}
                            >
                                <span>{faq.question}</span>
                                <ChevronDown
                                    className={`h-4 w-4 text-[#6b6b76] shrink-0 ml-3 transition-transform duration-200 ${
                                        isOpen ? 'rotate-180 text-[#eb4e62]' : ''
                                    }`}
                                />
                            </button>

                            {isOpen && (
                                <div className="px-5 py-4 text-sm text-[#6b6b76] leading-relaxed bg-white border-t border-[#e6e6ea]/60 animate-fade-in">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
