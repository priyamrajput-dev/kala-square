'use client';

import React, { useState } from 'react';
import { FAQItem } from '@/lib/types';

interface FAQAccordionProps {
    artistClass?: string;
    artistName: string;
    faqs?: FAQItem[];
}

export default function FAQAccordion({ artistClass, artistName, faqs }: FAQAccordionProps) {
    const [openSet, setOpenSet] = useState<Set<number>>(new Set([0]));

    if (artistClass !== 'platinum' || !faqs || faqs.length === 0) return null;

    const firstName = artistName.replace(/^Dr\.\s*/, '').split(' ')[0];

    const toggle = (idx: number) => {
        setOpenSet((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) {
                next.delete(idx);
            } else {
                next.add(idx);
            }
            return next;
        });
    };

    return (
        <section className="pp-s rv in" id="pp-faq">
            <div className="pp-sh">
                <h2>Frequently asked questions</h2>
                <p>Quick answers before you book {firstName}.</p>
            </div>

            <div className="pp-fq">
                {faqs.map((x, i) => (
                    <details
                        key={i}
                        open={openSet.has(i)}
                        onClick={(e) => {
                            e.preventDefault();
                            toggle(i);
                        }}
                    >
                        <summary>{x.question}</summary>
                        <p>{x.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}
