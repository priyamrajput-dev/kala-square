import React from 'react';

interface SEOPreviewProps {
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  artistName?: string;
}

export default function SEOPreview({
  slug,
  metaTitle,
  metaDescription,
  artistName,
}: SEOPreviewProps) {
  const displayTitle =
    metaTitle?.trim() || `${artistName || 'Artist Name'} | KalaSquare`;
  const displayDescription =
    metaDescription?.trim() ||
    `Book ${artistName || 'this artist'} on KalaSquare. View verified videos, songs, reviews, fanbase, and booking rates.`;
  const canonicalUrl = `https://kalasquare.com/top-creators/${slug || 'artist-slug'}`;

  return (
    <div className="space-y-4">
      {/* Canonical URL preview box */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#6b6b76] uppercase tracking-wider">
          Canonical Public URL (Live Preview)
        </label>
        <div className="h-10 px-3.5 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] text-xs font-mono text-[#1b1b1f] flex items-center select-all overflow-x-auto">
          {canonicalUrl}
        </div>
      </div>

      {/* Google Search Card Preview */}
      <div className="space-y-1.5">
        <span className="block text-xs font-bold text-[#6b6b76] uppercase tracking-wider">
          Search Engine Result Preview
        </span>
        <div className="p-4 rounded-xl border border-[#e6e6ea] bg-white shadow-xs space-y-1 max-w-xl font-sans">
          <div className="flex items-center gap-1.5 text-xs text-[#202124]">
            <span className="font-semibold text-xs">KalaSquare</span>
            <span className="text-neutral-400">›</span>
            <span className="text-neutral-500 truncate">
              top-creators › {slug || 'artist-slug'}
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer truncate">
            {displayTitle}
          </h4>

          <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
            {displayDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

