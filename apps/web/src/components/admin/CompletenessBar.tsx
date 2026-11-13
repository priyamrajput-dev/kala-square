import React from 'react';

interface CompletenessBarProps {
    score: number;
    tip?: string;
    variant?: 'top' | 'sticky';
}

export default function CompletenessBar({ score, tip, variant = 'top' }: CompletenessBarProps) {
    if (variant === 'top') {
        return (
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b6b76] block">
                        Completeness
                    </span>
                    <span className="font-heading font-black text-lg text-[#eb4e62]">{score}%</span>
                </div>
                <div className="w-20 sm:w-28 h-2.5 rounded-full bg-neutral-200 overflow-hidden">
                    <div
                        className="h-full bg-[#eb4e62] rounded-full transition-all duration-300"
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-3">
                <span className="font-heading font-extrabold text-base text-[#1b1b1f]">
                    {score}% Complete
                </span>
                <div className="w-32 sm:w-44 h-2.5 rounded-full bg-neutral-200 overflow-hidden">
                    <div
                        className="h-full bg-[#eb4e62] rounded-full transition-all duration-300"
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>

            {tip && (
                <span className="text-xs text-[#6b6b76] font-medium truncate max-w-md">{tip}</span>
            )}
        </div>
    );
}
