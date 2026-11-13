import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f3f3f5] animate-pulse">
      {/* Header Placeholder */}
      <div className="h-[72px] bg-white border-b border-[#e6e6ea]" />

      {/* Hero Skeleton */}
      <div className="bg-white border-b border-[#e6e6ea] py-10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="h-4 w-28 bg-neutral-200 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 flex justify-center md:justify-start">
              <div className="w-[320px] aspect-square rounded-[20px] bg-neutral-200" />
            </div>
            <div className="md:col-span-8 space-y-4">
              <div className="h-6 w-32 bg-neutral-200 rounded-full" />
              <div className="h-10 w-3/4 bg-neutral-200 rounded-lg" />
              <div className="h-5 w-1/2 bg-neutral-200 rounded" />
              <div className="flex gap-2 pt-2">
                <div className="h-8 w-24 bg-neutral-200 rounded-full" />
                <div className="h-8 w-24 bg-neutral-200 rounded-full" />
              </div>
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-36 bg-neutral-300 rounded-[10px]" />
                <div className="h-12 w-36 bg-neutral-200 rounded-[10px]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-24 bg-white rounded-[18px] border border-[#e6e6ea]" />
              <div className="h-24 bg-white rounded-[18px] border border-[#e6e6ea]" />
              <div className="h-24 bg-white rounded-[18px] border border-[#e6e6ea]" />
              <div className="h-24 bg-white rounded-[18px] border border-[#e6e6ea]" />
            </div>
            <div className="h-64 bg-white rounded-[20px] border border-[#e6e6ea]" />
            <div className="h-80 bg-white rounded-[20px] border border-[#e6e6ea]" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-96 bg-white rounded-[20px] border border-[#e6e6ea]" />
          </div>
        </div>
      </div>
    </div>
  );
}

