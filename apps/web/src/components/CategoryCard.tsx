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
      className="group block"
    >
      {/* Pink-Red Gradient Card Box */}
      <div
        className="relative h-[180px] sm:h-[190px] rounded-[16px] overflow-hidden flex items-center justify-center p-4 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:-translate-y-0.5"
        style={{
          backgroundImage: 'linear-gradient(150deg, #f58a9a, #eb4e62 60%, #c23048)',
        }}
      >
        {/* Top Right: White Pill Count */}
        <span className="absolute top-3 right-3 bg-white text-[#1b1b1f] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
          {category.count} artists
        </span>

        {/* Center: White Outline Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-12 h-12 text-white stroke-current fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round group-hover:scale-105 transition-transform duration-300"
          dangerouslySetInnerHTML={{ __html: category.iconSvg }}
          aria-hidden="true"
        />
      </div>

      {/* Label Below Card (Black Bold) */}
      <strong className="block font-heading font-extrabold text-[15px] sm:text-[16px] text-[#1b1b1f] mt-2.5 group-hover:text-[#eb4e62] transition tracking-tight">
        {category.name}
      </strong>
    </Link>
  );
}
