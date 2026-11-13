import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, ExternalLink, Award, Check } from 'lucide-react';
import { mockArtistProfiles } from '@/lib/mock-data';

export default function AdminArtistsPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6e6ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
            Artists Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6b6b76] mt-0.5">
            Full table filtering, bulk operations, and search coming in Prompt 6.
          </p>
        </div>

        <Link
          href="/admin/artists/new"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Artist</span>
        </Link>
      </div>

      {/* Quick Mock Profiles List for Editing */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6e6ea] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f6f6f7] pb-3">
          <h2 className="font-heading font-bold text-base text-[#1b1b1f]">
            Quick Edit Profiles (Mock Database)
          </h2>
          <span className="text-xs text-[#6b6b76] font-semibold">
            {mockArtistProfiles.length} Profiles Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockArtistProfiles.map((artist) => (
            <div
              key={artist.id}
              className="p-4 rounded-xl border border-[#e6e6ea] bg-[#f6f6f7]/60 hover:border-[#eb4e62]/40 transition space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shrink-0 border border-[#e6e6ea]">
                  <Image
                    src={artist.photoUrl}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-bold text-sm text-[#1b1b1f] truncate">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-[#6b6b76] truncate">
                    {artist.categories.join(', ')} · {artist.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e6e6ea]/60 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-[#8a5a00] bg-[#fff4d6] px-2 py-0.5 rounded-full text-[11px]">
                  <Award className="h-3 w-3" />
                  <span className="capitalize">{artist.artistClass}</span>
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/top-creators/${artist.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-[#6b6b76] hover:text-[#eb4e62] hover:bg-white transition"
                    title="View public profile"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/admin/artists/${artist.slug}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#e6e6ea] hover:border-[#eb4e62] text-[#eb4e62] font-bold transition shadow-xs"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
