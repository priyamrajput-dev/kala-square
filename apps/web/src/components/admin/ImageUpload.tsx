'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    label: string;
    required?: boolean;
    value?: string;
    onChange: (url: string) => void;
    aspect?: 'square' | 'banner';
    hint?: string;
    error?: string;
}

export default function ImageUpload({
    label,
    required,
    value,
    onChange,
    aspect = 'square',
    hint,
    error,
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [urlInputOpen, setUrlInputOpen] = useState(false);
    const [customUrl, setCustomUrl] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit. Please choose a smaller photo.');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    onChange(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApplyUrl = () => {
        if (customUrl.trim()) {
            onChange(customUrl.trim());
            setUrlInputOpen(false);
            setCustomUrl('');
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const aspectClass =
        aspect === 'square' ? 'aspect-square w-36 sm:w-44' : 'aspect-[3/1] w-full max-w-lg';

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-[#1b1b1f]">
                    {label} {required && <span className="text-[#eb4e62]">*</span>}
                </label>
                {value && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-xs text-[#eb4e62] hover:underline font-semibold"
                    >
                        Remove
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-start gap-4">
                {/* Preview or Empty Box */}
                <div
                    className={`relative ${aspectClass} rounded-2xl overflow-hidden border-2 border-dashed ${
                        error ? 'border-[#eb4e62]' : 'border-[#e6e6ea]'
                    } bg-[#f6f6f7] flex flex-col items-center justify-center p-3 text-center`}
                >
                    {value ? (
                        <>
                            <Image
                                src={value}
                                alt="Uploaded preview"
                                fill
                                className="object-cover"
                                sizes="200px"
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition"
                                title="Remove photo"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <div className="space-y-1 text-[#6b6b76]">
                            <ImageIcon className="h-8 w-8 mx-auto text-[#6b6b76]/60" />
                            <span className="text-xs font-semibold block">No photo</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-xs font-bold text-[#1b1b1f] shadow-xs transition cursor-pointer"
                        >
                            <Upload className="h-3.5 w-3.5" />
                            <span>{value ? 'Change Photo' : 'Upload File'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setUrlInputOpen(!urlInputOpen)}
                            className="h-10 px-3 rounded-xl bg-[#f6f6f7] hover:bg-neutral-200/80 text-xs font-semibold text-[#6b6b76] transition cursor-pointer"
                        >
                            Paste URL
                        </button>
                    </div>

                    {urlInputOpen && (
                        <div className="flex items-center gap-2 pt-1 animate-fade-in">
                            <input
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                className="h-9 px-3 rounded-lg border border-[#e6e6ea] text-xs w-60 outline-hidden focus:border-[#eb4e62]"
                            />
                            <button
                                type="button"
                                onClick={handleApplyUrl}
                                className="h-9 px-3 rounded-lg bg-[#eb4e62] text-white text-xs font-bold"
                            >
                                Apply
                            </button>
                        </div>
                    )}

                    {hint && <p className="text-xs text-[#6b6b76] max-w-xs">{hint}</p>}
                </div>
            </div>

            {error && <p className="text-xs text-[#eb4e62] font-semibold">{error}</p>}
        </div>
    );
}
