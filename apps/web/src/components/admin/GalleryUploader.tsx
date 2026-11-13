'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, X, ArrowUp, ArrowDown, Upload, Link2 } from 'lucide-react';

export interface GalleryItem {
    id: string;
    src: string;
    caption?: string;
}

interface GalleryUploaderProps {
    items: GalleryItem[];
    onChange: (items: GalleryItem[]) => void;
    max?: number;
    error?: string;
}

export default function GalleryUploader({
    items,
    onChange,
    max = 12,
    error,
}: GalleryUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [urlInputOpen, setUrlInputOpen] = useState(false);
    const [newUrl, setNewUrl] = useState('');
    const [newCaption, setNewCaption] = useState('');

    const isFull = items.length >= max;

    const handleAddUrl = () => {
        if (!newUrl.trim() || isFull) return;
        const newItem: GalleryItem = {
            id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            src: newUrl.trim(),
            caption: newCaption.trim(),
        };
        onChange([...items, newItem]);
        setNewUrl('');
        setNewCaption('');
        setUrlInputOpen(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = max - items.length;
        const filesToRead = Array.from(files).slice(0, remainingSlots);

        const newItems: GalleryItem[] = [];
        let completed = 0;

        filesToRead.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    newItems.push({
                        id: `gal-${Date.now()}-${index}`,
                        src: reader.result,
                        caption: '',
                    });
                }
                completed++;
                if (completed === filesToRead.length) {
                    onChange([...items, ...newItems]);
                }
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemove = (index: number) => {
        const updated = items.filter((_, i) => i !== index);
        onChange(updated);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const updated = [...items];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        onChange(updated);
    };

    const handleCaptionChange = (index: number, caption: string) => {
        const updated = items.map((item, i) => (i === index ? { ...item, caption } : item));
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6b6b76] uppercase tracking-wider">
                    {items.length} of {max} photos added
                </span>

                {isFull ? (
                    <span className="text-xs font-bold text-[#8a5a00] bg-[#fff4d6] px-2.5 py-1 rounded-full">
                        12 / 12 reached
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-xs font-bold text-[#1b1b1f] shadow-xs transition cursor-pointer"
                        >
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload Photos</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setUrlInputOpen(!urlInputOpen)}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#f6f6f7] hover:bg-neutral-200/80 text-xs font-semibold text-[#6b6b76] transition cursor-pointer"
                        >
                            <Link2 className="h-3.5 w-3.5" />
                            <span>Add URL</span>
                        </button>
                    </div>
                )}
            </div>

            {/* URL Input Form Box */}
            {urlInputOpen && !isFull && (
                <div className="p-4 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            type="url"
                            placeholder="Photo URL (https://images.unsplash.com/...)"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="h-10 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                        />
                        <input
                            type="text"
                            placeholder="Optional caption (e.g. Live at Delhi Arena)"
                            value={newCaption}
                            onChange={(e) => setNewCaption(e.target.value)}
                            className="h-10 px-3 rounded-lg bg-white border border-[#e6e6ea] text-xs outline-hidden focus:border-[#eb4e62]"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setUrlInputOpen(false)}
                            className="h-8 px-3 rounded-lg text-xs font-semibold text-[#6b6b76]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAddUrl}
                            className="h-8 px-4 rounded-lg bg-[#eb4e62] text-white text-xs font-bold"
                        >
                            Add to Gallery
                        </button>
                    </div>
                </div>
            )}

            {/* Gallery Items Grid */}
            {items.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-[#e6e6ea] text-center text-[#6b6b76] space-y-2 bg-[#f6f6f7]">
                    <p className="text-sm font-semibold">No photos in gallery yet</p>
                    <p className="text-xs max-w-sm mx-auto">
                        Add at least 1 photo for publish (3 or more recommended for a complete
                        profile).
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item, index) => {
                        const isFirst = index === 0;
                        const isLast = index === items.length - 1;

                        return (
                            <div
                                key={item.id}
                                className="group relative rounded-xl overflow-hidden border border-[#e6e6ea] bg-white shadow-xs flex flex-col"
                            >
                                {/* Photo Thumbnail */}
                                <div className="relative aspect-[3/2] w-full bg-[#f6f6f7] overflow-hidden">
                                    <Image
                                        src={item.src}
                                        alt={item.caption || `Gallery photo ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="250px"
                                    />

                                    {/* Cover Badge on First Photo */}
                                    {isFirst && (
                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#eb4e62] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                                            Cover
                                        </span>
                                    )}

                                    {/* Remove Button Top Right */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-[#eb4e62] text-white flex items-center justify-center transition"
                                        title="Remove photo"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>

                                    {/* Move Up / Down Buttons */}
                                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs rounded-lg p-0.5">
                                        <button
                                            type="button"
                                            disabled={isFirst}
                                            onClick={() => handleMove(index, 'up')}
                                            className="p-1 text-white hover:text-[#eb4e62] disabled:opacity-30 disabled:hover:text-white"
                                            title="Move earlier"
                                        >
                                            <ArrowUp className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isLast}
                                            onClick={() => handleMove(index, 'down')}
                                            className="p-1 text-white hover:text-[#eb4e62] disabled:opacity-30 disabled:hover:text-white"
                                            title="Move later"
                                        >
                                            <ArrowDown className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Caption Input */}
                                <div className="p-2 border-t border-[#f6f6f7]">
                                    <input
                                        type="text"
                                        maxLength={80}
                                        placeholder="Caption (max 80)"
                                        value={item.caption || ''}
                                        onChange={(e) => handleCaptionChange(index, e.target.value)}
                                        className="w-full text-xs px-2 py-1 rounded bg-[#f6f6f7] border border-transparent focus:border-[#eb4e62] focus:bg-white outline-hidden"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {error && <p className="text-xs text-[#eb4e62] font-semibold">{error}</p>}
        </div>
    );
}
