import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e6e6ea] pt-14 pb-12">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12">
          {/* Column 1: Information */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-[16px] text-[#1b1b1f]">
              Information
            </h4>
            <ul className="space-y-2.5 text-[14px] text-[#6b6b76]">
              <li>
                <Link href="/about" className="hover:text-[#eb4e62] transition">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#eb4e62] transition">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/membership" className="inline-flex items-center hover:text-[#eb4e62] transition">
                  <span>Membership</span>
                  <span className="bg-[#eb4e62] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1.5">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="inline-flex items-center hover:text-[#eb4e62] transition">
                  <span>Timeline</span>
                  <span className="bg-[#eb4e62] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1.5">
                    New
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Useful Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-[16px] text-[#1b1b1f]">
              Useful Links
            </h4>
            <ul className="space-y-2.5 text-[14px] text-[#6b6b76]">
              <li>
                <Link href="/terms" className="hover:text-[#eb4e62] transition">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#eb4e62] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-[#eb4e62] transition">
                  Refunds
                </Link>
              </li>
              <li>
                <Link href="/spotlight" className="hover:text-[#eb4e62] transition">
                  KS Spotlight
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow Us On */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-[16px] text-[#1b1b1f]">
              Follow Us On
            </h4>
            <div className="flex items-center gap-3 pt-1">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/kalasquarein"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-[#e6e6ea] hover:border-[#eb4e62] flex items-center justify-center text-[#1b1b1f] hover:text-[#eb4e62] transition"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 8h2V5h-2.4C11.4 5 10 6.4 10 8.6V10H8v3h2v7h3v-7h2.2l.4-3H13V8.8c0-.5.2-.8 1-.8z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-[#e6e6ea] hover:border-[#eb4e62] flex items-center justify-center text-[#1b1b1f] hover:text-[#eb4e62] transition"
                aria-label="X / Twitter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8a3.3 3.3 0 0 0-5.6 3c-2.7-.1-5.1-1.4-6.7-3.4-.9 1.5-.4 3.4 1 4.4-.5 0-1-.2-1.5-.4 0 1.6 1.1 3 2.6 3.3-.5.1-1 .2-1.5.1.4 1.3 1.7 2.3 3.1 2.3A6.6 6.6 0 0 1 4 17.3 9.3 9.3 0 0 0 9 18.8c6 0 9.4-5 9.2-9.5.6-.5 1.2-1 1.8-1.8z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/kalasquarein"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-[#e6e6ea] hover:border-[#eb4e62] flex items-center justify-center text-[#1b1b1f] hover:text-[#eb4e62] transition"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="4" y="4" width="16" height="16" rx="5" />
                  <circle cx="12" cy="12" r="3.6" />
                  <circle cx="17" cy="7" r=".6" fill="currentColor" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@MelodySquare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-[#e6e6ea] hover:border-[#eb4e62] flex items-center justify-center text-[#1b1b1f] hover:text-[#eb4e62] transition"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="6" width="18" height="12" rx="4" />
                  <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Centered Copyright */}
        <div className="pt-8 border-t border-[#e6e6ea] text-center text-[13px] text-[#6b6b76]">
          © 2026 Kalasquare. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
