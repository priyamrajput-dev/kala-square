import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e6e6ea] pt-16 pb-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#e6e6ea]">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-0.5 text-2xl font-extrabold font-heading tracking-tight">
              <span className="text-[#1b1b1f]">Kala</span>
              <span className="text-[#eb4e62]">Square</span>
            </Link>
            <p className="text-sm text-[#6b6b76] leading-relaxed">
              India&apos;s premier talent listing, artist management, and event marketplace connecting artists with verified clients.
            </p>
          </div>

          {/* Col 1: Information */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-[#1b1b1f]">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6b6b76]">
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
                <Link href="/membership" className="hover:text-[#eb4e62] transition">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="hover:text-[#eb4e62] transition">
                  Timeline
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Useful Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-[#1b1b1f]">
              Useful Links
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6b6b76]">
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
                  Refunds &amp; Cancellations
                </Link>
              </li>
              <li>
                <Link href="/spotlight" className="hover:text-[#eb4e62] transition">
                  KS Spotlight
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Follow Us On */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-[#1b1b1f]">
              Follow Us On
            </h4>
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/kalasquarein"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#f6f6f7] hover:bg-[#eb4e62] text-[#1b1b1f] hover:text-white flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@MelodySquare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#f6f6f7] hover:bg-[#eb4e62] text-[#1b1b1f] hover:text-white flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="5" width="20" height="14" rx="4" />
                  <path d="M10 9l5 3-5 3z" fill="currentColor" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/kalasquarein"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#f6f6f7] hover:bg-[#eb4e62] text-[#1b1b1f] hover:text-white flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 8h2V5h-2.4C11.4 5 10 6.4 10 8.6V10H8v3h2v7h3v-7h2.2l.4-3H13V8.8c0-.5.2-.8 1-.8z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#f6f6f7] hover:bg-[#eb4e62] text-[#1b1b1f] hover:text-white flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b6b76] gap-4">
          <p>© 2026 KalaSquare. All rights reserved.</p>
          <p>Handcrafted for Artists, Planners &amp; Entertainment Venues in India.</p>
        </div>
      </div>
    </footer>
  );
}
