import React from 'react';
import { Film, ExternalLink, Star } from 'lucide-react';
import { IMDbData } from '@/lib/types';

interface IMDbSectionProps {
  categories: string[];
  imdb?: IMDbData;
}

export default function IMDbSection({ categories, imdb }: IMDbSectionProps) {
  const isActor = categories.some((c) =>
    c.toLowerCase().includes('actor') || c.toLowerCase().includes('theatre')
  );

  if (!isActor || !imdb) return null;

  return (
    <section className="scroll-mt-36 bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6" id="pp-imdb">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded font-black text-xs bg-[#F5C518] text-black tracking-wider">
              IMDb
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
              Film &amp; screen
            </h2>
          </div>
          <p className="text-sm text-[#6b6b76] mt-1">
            Official screen credits, streaming originals, and recognized roles.
          </p>
        </div>

        {imdb.imdbUrl && (
          <a
            href={imdb.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f6f6f7] hover:bg-[#F5C518]/20 border border-[#e6e6ea] text-xs font-bold text-[#1b1b1f] transition self-start sm:self-auto"
          >
            <span>View on IMDb</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* IMDb Rating & Known For Summary */}
      <div className="p-4 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea]/60 flex flex-wrap items-center gap-4">
        {imdb.rating && (
          <div className="flex items-center gap-1.5 pr-4 border-r border-[#e6e6ea]">
            <Star className="h-4 w-4 fill-[#F5C518] text-[#F5C518]" />
            <span className="font-heading font-extrabold text-sm text-[#1b1b1f]">
              {imdb.rating}
            </span>
            <span className="text-xs text-[#6b6b76]">IMDb Score</span>
          </div>
        )}

        {imdb.knownFor && imdb.knownFor.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-[#1b1b1f]">Known for:</span>
            {imdb.knownFor.map((title) => (
              <span
                key={title}
                className="px-2.5 py-1 rounded-md bg-white border border-[#e6e6ea] text-[#1b1b1f] font-semibold"
              >
                {title}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Credits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {imdb.credits.map((credit) => (
          <div
            key={credit.id}
            className="p-4 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea]/60 flex items-start justify-between gap-3 hover:border-[#eb4e62]/40 transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#e6e6ea] flex items-center justify-center text-[#1b1b1f] shrink-0 mt-0.5">
                <Film className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#1b1b1f]">
                  {credit.title}
                </h4>
                <p className="text-xs text-[#6b6b76] mt-0.5">
                  {[credit.role, credit.type, credit.year].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>

            {credit.isKnownFor && (
              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#fff4d6] text-[#8a5a00] border border-[#fde199]">
                Known for
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

