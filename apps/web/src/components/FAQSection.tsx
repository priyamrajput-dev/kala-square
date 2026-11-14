'use client';

import React, { useState } from 'react';
import { FAQItem } from '@/lib/types';
import { mockFAQs } from '@/lib/mock-data';

interface FAQSectionProps {
  faqs?: FAQItem[];
}

export default function FAQSection({ faqs = mockFAQs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#eb4e62] py-16 sm:py-20 text-white" id="faq">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Heading, Subtext, Button */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[54px] tracking-tight leading-[1.05]">
              Questions,
              <br />
              answered.
            </h2>
            <p className="text-white/90 text-base max-w-sm leading-relaxed">
              What artists, brands and venues ask before joining KalaSquare.
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center justify-center h-11 px-6 rounded-[10px] bg-white hover:bg-neutral-50 text-[#eb4e62] hover:text-[#d63a50] font-heading font-bold text-sm shadow-sm transition"
              >
                Contact us
              </a>
            </div>
          </div>

          {/* Right Column: White Accordion Cards */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white text-[#1b1b1f] rounded-[16px] overflow-hidden shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-heading font-extrabold text-base sm:text-[17px] focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="text-[#eb4e62] text-xl font-bold flex-shrink-0 select-none w-5 h-5 flex items-center justify-center">
                      {isOpen ? '✕' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-[14px] text-[#6b6b76] leading-relaxed pt-0">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
