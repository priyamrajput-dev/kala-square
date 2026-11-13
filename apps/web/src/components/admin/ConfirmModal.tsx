'use client';

import React from 'react';
import { X, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: <AlertCircle className="h-6 w-6 text-[#eb4e62]" />,
                    iconBg: 'bg-[#fde6ea]',
                    btnClass: 'bg-[#eb4e62] hover:bg-[#d63a50] text-white',
                };
            case 'warning':
                return {
                    icon: <AlertTriangle className="h-6 w-6 text-[#8a6508]" />,
                    iconBg: 'bg-[#fbefc7]',
                    btnClass: 'bg-[#8a6508] hover:bg-[#725304] text-white',
                };
            case 'primary':
            default:
                return {
                    icon: <CheckCircle2 className="h-6 w-6 text-[#1a8a57]" />,
                    iconBg: 'bg-[#e1f5ea]',
                    btnClass: 'bg-[#1b1b1f] hover:bg-black text-white',
                };
        }
    };

    const { icon, iconBg, btnClass } = getVariantStyles();

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e6e6ea] relative animate-scale-up space-y-4">
                {/* Close X button */}
                <button
                    type="button"
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6b6b76] hover:text-[#1b1b1f] hover:bg-[#f6f6f7] transition"
                    aria-label="Close modal"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-start gap-3.5 pr-6">
                    <div
                        className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
                    >
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-heading font-extrabold text-lg text-[#1b1b1f] tracking-tight">
                            {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#6b6b76] mt-1 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#f6f6f7]">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-10 px-4 rounded-xl border border-[#e6e6ea] hover:bg-[#f6f6f7] text-xs font-bold text-[#1b1b1f] transition"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`h-10 px-5 rounded-xl text-xs font-bold shadow-sm transition ${btnClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
