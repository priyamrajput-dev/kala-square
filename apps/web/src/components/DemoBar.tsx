'use client';

import React from 'react';
import Link from 'next/link';

interface DemoBarProps {
  currentPage?: 'home' | 'login' | 'admin' | 'artist' | 'directory';
  noteText?: string;
  reviewActionHref?: string;
  reviewActionLabel?: string;
}

export default function DemoBar({
  currentPage = 'home',
  noteText,
  reviewActionHref = '/admin/artists',
  reviewActionLabel = 'Review artists in Admin',
}: DemoBarProps) {
  const isHome = currentPage === 'home';
  const isAdmin = currentPage === 'admin';
  const isLogin = currentPage === 'login';

  const defaultNote = isHome
    ? 'Live demo. This is the public Home page. It shows what you have published in Admin. 5 artists are hidden because Draft or Pending review.'
    : currentPage === 'artist'
    ? 'Live demo. Artist profile page. Send an enquiry to test Admin → Enquiries.'
    : currentPage === 'directory'
    ? 'Live demo. Top Creators directory. Browse all verified artists and creators.'
    : 'Live demo. Admin management portal.';

  const displayNote = noteText || defaultNote;

  return (
    <div className="w-full select-none z-50">
      {/* 1. Top Kalasquare Live Demo Bar */}
      <div
        id="demoBar"
        className="bg-[#14131b] text-white text-[13px] px-4 py-2 flex items-center justify-between gap-4 border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <b className="font-heading font-extrabold text-[14px] tracking-tight">
            Kalasquare Live Demo
          </b>
          <nav className="flex items-center gap-1.5">
            <Link
              href="/admin/login"
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                isLogin
                  ? 'bg-white text-[#1b1b1f] font-heading font-extrabold shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Login
            </Link>
            <Link
              href="/"
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                isHome
                  ? 'bg-white text-[#1b1b1f] font-heading font-extrabold shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link
              href="/admin/artists"
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                isAdmin
                  ? 'bg-white text-[#1b1b1f] font-heading font-extrabold shadow-xs border-2 border-[#eb4e62]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>

        <span className="hidden lg:inline text-[12px] text-white/60">
          Edit in Admin, then check the Home page. Send an enquiry on Home, then check Admin → Enquiries.
        </span>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="text-xs font-bold text-white/80 hover:text-white px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 transition cursor-pointer"
        >
          Reset demo
        </button>
      </div>

      {/* 2. Live Demo Note Bar */}
      <div className="bg-[#17171c] text-white text-xs sm:text-[13px] py-2 px-4 flex items-center justify-center gap-3 flex-wrap text-center border-b border-white/5">
        <span>
          <b>Live demo.</b> {displayNote.replace(/^Live demo\.\s*/i, '')}
        </span>
        {reviewActionHref && (
          <Link
            href={reviewActionHref}
            className="bg-[#eb4e62] hover:bg-[#d63a50] text-white font-bold text-xs px-3.5 py-1 rounded-full transition shadow-xs"
          >
            {reviewActionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

