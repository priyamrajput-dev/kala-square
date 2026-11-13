import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f3f5] text-[#1b1b1f]">
      <Header />
      <main className="flex-1 max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center py-20 sm:py-32">
        <span className="text-sm font-extrabold text-[#eb4e62] uppercase tracking-widest bg-[#fde6ea] px-3.5 py-1.5 rounded-full mb-4">
          404 Error
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1b1b1f] tracking-tight mb-4">
          Creator Or Page Not Found
        </h1>
        <p className="text-base sm:text-lg text-[#6b6b76] max-w-md mb-8 leading-relaxed">
          The artist profile or page you are looking for does not exist, is currently unpublished, or has been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="h-12 px-7 rounded-[10px] bg-[#eb4e62] hover:bg-[#d63a50] text-white font-bold text-sm shadow-md transition flex items-center justify-center"
          >
            Back to Home
          </Link>
          <Link
            href="/top-creators/sahil-badal"
            className="h-12 px-7 rounded-[10px] bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-[#1b1b1f] font-bold text-sm shadow-xs transition flex items-center justify-center"
          >
            Explore Featured Creator
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

