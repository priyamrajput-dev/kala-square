import React from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/top-creators?category=${category.slug}`}
      className="group relative aspect-[800/760] rounded-[18px] p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, #f8a4b0 0%, #d63a50 100%)',
      }}
    >
      {/* Top Right: White Pill Count */}
      <div className="flex justify-end">
        <span className="text-[11px] font-bold text-[#eb4e62] bg-white px-2.5 py-1 rounded-full shadow-sm">
          {category.count} artists
        </span>
      </div>

      {/* Center: White Outline Icon */}
      <div className="flex items-center justify-center my-auto">
        <svg
          viewBox="0 0 24 24"
          className="w-12 h-12 text-white stroke-current fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round group-hover:scale-110 transition-transform duration-300"
          dangerouslySetInnerHTML={{ __html: category.iconSvg }}
          aria-hidden="true"
        />
      </div>

      {/* Bottom: Name Bold White + Explore indicator on hover */}
      <div className="flex items-center justify-between text-white">
        <strong className="font-heading font-extrabold text-base sm:text-lg tracking-tight">
          {category.name}
        </strong>
        <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Explore &rarr;
        </span>
      </div>
    </Link>
  );
}
