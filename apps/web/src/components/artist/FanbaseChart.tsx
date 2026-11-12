import React from 'react';
import { FanbasePlatform } from '@/lib/types';

interface FanbaseChartProps {
  fanbase: FanbasePlatform[];
}

export default function FanbaseChart({ fanbase }: FanbaseChartProps) {
  const activePlatforms = fanbase.filter((p) => p.numValue > 0);

  if (activePlatforms.length === 0) return null;

  const totalNum = activePlatforms.reduce((sum, p) => sum + p.numValue, 0);

  // Format big number
  const formatTotal = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Donut SVG parameters
  const R = 70;
  const C = 2 * Math.PI * R; // ~439.82
  let accumulatedPercent = 0;

  const segments = activePlatforms.map((platform) => {
    const fraction = platform.numValue / totalNum;
    const strokeDasharray = `${(fraction * C).toFixed(2)} ${C.toFixed(2)}`;
    const strokeDashoffset = `-${(accumulatedPercent * C).toFixed(2)}`;
    accumulatedPercent += fraction;

    return {
      key: platform.key,
      color: platform.color,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <section className="scroll-mt-36 bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6" id="pp-fanbase">
      <div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
          Total fanbase distribution
        </h2>
        <p className="text-sm text-[#6b6b76] mt-1">
          Verified audience reach across major streaming and social platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* Left: Pure SVG Donut Chart */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full transform -rotate-90"
              aria-label="Fanbase split by platform"
              role="img"
            >
              {/* Background Track */}
              <circle
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke="#f3f3f5"
                strokeWidth="24"
              />

              {/* Colored Segments */}
              {segments.map((seg) => (
                <circle
                  key={seg.key}
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="24"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-500"
                />
              ))}
            </svg>

            {/* Center Total Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#1b1b1f] tracking-tight">
                {formatTotal(totalNum)}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#6b6b76] uppercase tracking-wider mt-0.5">
                Total Fanbase
              </span>
            </div>
          </div>
        </div>

        {/* Right: Platform Cards Grid */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {activePlatforms.map((platform) => (
              <div
                key={platform.key}
                className="p-3.5 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea]/60 flex flex-col justify-between hover:border-[#eb4e62]/40 transition"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-xs font-semibold text-[#6b6b76] truncate">
                    {platform.name}
                  </span>
                </div>
                <div className="mt-2.5">
                  <p className="font-heading font-extrabold text-xl text-[#1b1b1f] tracking-tight">
                    {platform.count}
                  </p>
                  <p className="text-[11px] text-[#6b6b76] mt-0.5">
                    {platform.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
