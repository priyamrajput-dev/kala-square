import React from 'react';
import { Award, Briefcase, Calendar } from 'lucide-react';
import { CampaignItem, AwardItem } from '@/lib/types';

interface CampaignsAwardsProps {
  campaigns?: CampaignItem[];
  awards?: AwardItem[];
}

export default function CampaignsAwards({ campaigns, awards }: CampaignsAwardsProps) {
  const hasCampaigns = campaigns && campaigns.length > 0;
  const hasAwards = awards && awards.length > 0;

  if (!hasCampaigns && !hasAwards) return null;

  return (
    <section className="scroll-mt-36 bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-8" id="pp-work">
      <div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
          Work &amp; recognition
        </h2>
        <p className="text-sm text-[#6b6b76] mt-1">
          Brand campaigns, commercial collaborations, and honors.
        </p>
      </div>

      {/* Campaigns Sub-section */}
      {hasCampaigns && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fde6ea] flex items-center justify-center text-[#eb4e62]">
              <Briefcase className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#1b1b1f]">
              Previous campaigns
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#f6f6f7] border border-[#e6e6ea]/60 flex flex-col justify-between space-y-3 hover:border-[#eb4e62]/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6b6b76] font-medium">
                    <span className="truncate">{camp.category}</span>
                    <span className="flex items-center gap-1 shrink-0 font-semibold text-[#1b1b1f]">
                      <Calendar className="h-3 w-3 text-[#eb4e62]" />
                      {camp.year}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#1b1b1f] mt-1.5">
                    {camp.brandName}
                  </h4>
                </div>

                {camp.description && (
                  <p className="text-xs sm:text-sm text-[#6b6b76] leading-relaxed">
                    {camp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards Sub-section */}
      {hasAwards && (
        <div className="space-y-4 pt-2 border-t border-[#e6e6ea]">
          <div className="flex items-center gap-2 pt-2">
            <div className="w-8 h-8 rounded-lg bg-[#fff4d6] flex items-center justify-center text-[#8a5a00]">
              <Award className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#1b1b1f]">
              Awards &amp; honors
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((award) => (
              <div
                key={award.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#f6f6f7] border border-[#e6e6ea]/60 flex flex-col justify-between space-y-3 hover:border-[#eb4e62]/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6b6b76] font-medium">
                    <span className="truncate">{award.category}</span>
                    <span className="flex items-center gap-1 shrink-0 font-semibold text-[#8a5a00]">
                      <Award className="h-3 w-3" />
                      {award.year}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#1b1b1f] mt-1.5">
                    {award.title}
                  </h4>
                </div>

                {award.description && (
                  <p className="text-xs sm:text-sm text-[#6b6b76] leading-relaxed">
                    {award.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
