import React from 'react';

interface FormSectionProps {
    id: string;
    title: string;
    description?: string;
    badge?: React.ReactNode;
    children: React.ReactNode;
}

export default function FormSection({ id, title, description, badge, children }: FormSectionProps) {
    return (
        <div
            id={id}
            className="scroll-mt-28 bg-white rounded-2xl p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#f6f6f7]">
                <div>
                    <h3 className="font-heading font-extrabold text-xl text-[#1b1b1f] tracking-tight">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-xs sm:text-sm text-[#6b6b76] mt-0.5">{description}</p>
                    )}
                </div>
                {badge && <div>{badge}</div>}
            </div>

            <div className="space-y-5">{children}</div>
        </div>
    );
}
