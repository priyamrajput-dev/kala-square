'use client';

import React, { useState } from 'react';
import { Star, MessageSquarePlus, Check } from 'lucide-react';
import { ReviewItem } from '@/lib/types';

interface ReviewsSectionProps {
    rating: number;
    reviewsCount: number;
    reviews: ReviewItem[];
}

export default function ReviewsSection({ rating, reviewsCount, reviews }: ReviewsSectionProps) {
    const [showToast, setShowToast] = useState(false);

    const handleWriteReview = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
    };

    return (
        <section
            className="scroll-mt-36 bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6"
            id="pp-reviews"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                        Client reviews &amp; ratings
                    </h2>
                    <p className="text-sm text-[#6b6b76] mt-1">
                        Verified feedback from past event organizers, planners, and hosts.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleWriteReview}
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] bg-[#eb4e62] hover:bg-[#d63a50] text-white font-bold text-xs shadow-sm transition self-start sm:self-auto cursor-pointer"
                >
                    <MessageSquarePlus className="h-4 w-4" />
                    <span>Write a Review</span>
                </button>
            </div>

            {showToast && (
                <div className="p-3.5 rounded-xl bg-[#fff4d6] border border-[#fde199] text-xs font-semibold text-[#8a5a00] flex items-center gap-2 animate-fade-in">
                    <Check className="h-4 w-4 text-[#8a5a00] shrink-0" />
                    <span>Public review submission workflow is coming in the next prompt!</span>
                </div>
            )}

            {/* Summary Score Card */}
            <div className="p-5 rounded-2xl bg-[#f6f6f7] border border-[#e6e6ea]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="font-heading font-black text-4xl sm:text-5xl text-[#1b1b1f]">
                        {rating.toFixed(1)}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[#eb4e62]">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                        i < Math.floor(rating)
                                            ? 'fill-current text-[#eb4e62]'
                                            : 'text-neutral-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-[#6b6b76] font-medium">
                            Based on {reviewsCount} verified event reviews
                        </p>
                    </div>
                </div>

                <p className="text-xs text-[#6b6b76] max-w-sm italic">
                    Reviews and ratings are written by visitors on the website and are not entered
                    in Admin.
                </p>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 pt-2">
                {reviews.map((rev) => (
                    <div
                        key={rev.id}
                        className="p-5 rounded-2xl bg-white border border-[#e6e6ea] space-y-3 shadow-xs"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#fde6ea] text-[#eb4e62] font-heading font-bold text-sm flex items-center justify-center">
                                    {rev.authorName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-heading font-bold text-sm text-[#1b1b1f]">
                                        {rev.authorName}
                                    </h4>
                                    <span className="text-xs text-[#6b6b76]">{rev.date}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-0.5 text-[#eb4e62]">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${
                                            i < rev.rating
                                                ? 'fill-current text-[#eb4e62]'
                                                : 'text-neutral-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-[#6b6b76] leading-relaxed">{rev.comment}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
