import React from 'react';
import Link from 'next/link';
import { Users, Plus, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-[#e6e6ea] shadow-xs">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-[#6b6b76] mt-1">
          Welcome to KalaSquare admin management portal. Full analytics and charts coming in Prompt 6.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#e6e6ea] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#fde6ea] text-[#eb4e62] flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-[#1b1b1f]">
              Artist Management
            </h2>
            <p className="text-xs sm:text-sm text-[#6b6b76] mt-1">
              Add new artist profiles, update credentials, manage photos, video reels, and SEO.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/admin/artists/new"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#eb4e62] hover:bg-[#d63a50] text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Artist</span>
            </Link>
            <Link
              href="/admin/artists"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-xs font-bold text-[#1b1b1f] transition"
            >
              <span>View Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
