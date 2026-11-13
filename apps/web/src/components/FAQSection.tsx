'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '@/lib/types';

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  buttonText?: string;
}

export default function FAQSection({
  faqs,
  title = 'Frequently Asked Questions',
  buttonText = 'View All FAQs',
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#eb4e62] py-16 md:py-24 text-white" id="faq">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Heading, Subtext, Button */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              Clear &amp; Transparent
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1]">
              {title}
            </h2>
            <p className="text-white/90 text-base max-w-md leading-relaxed">
              Everything artists, organizers, corporate planners, and venues ask before booking on KalaSquare.
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center justify-center h-12 px-7 rounded-[10px] bg-white hover:bg-neutral-100 text-[#eb4e62] font-bold text-sm shadow-md transition"
              >
                {buttonText}
              </a>
            </div>
          </div>

          {/* Right Column: White Accordion Cards */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white text-[#1b1b1f] rounded-[16px] overflow-hidden shadow-sm transition"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#eb4e62] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#6b6b76] leading-relaxed border-t border-[#f6f6f7] pt-3">
                      {faq.answer}
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
