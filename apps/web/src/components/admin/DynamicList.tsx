'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface DynamicListProps<T> {
    title?: string;
    items: T[];
    max: number;
    addLabel: string;
    onAdd: () => void;
    onRemove: (index: number) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    emptyMessage?: string;
    error?: string;
}

export default function DynamicList<T>({
    title,
    items,
    max,
    addLabel,
    onAdd,
    onRemove,
    renderItem,
    emptyMessage = 'Nothing added yet.',
    error,
}: DynamicListProps<T>) {
    const isFull = items.length >= max;

    return (
        <div className="space-y-4">
            {/* Header with Counter and Add Button */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6b6b76] uppercase tracking-wider">
                    {items.length} of {max} items
                </span>

                {isFull ? (
                    <span className="text-xs font-bold text-[#8a5a00] bg-[#fff4d6] px-2.5 py-1 rounded-full">
                        {max} / {max} limit reached
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-[#e6e6ea] hover:border-[#eb4e62] hover:text-[#eb4e62] text-xs font-bold text-[#1b1b1f] shadow-xs transition cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{addLabel}</span>
                    </button>
                )}
            </div>

            {/* Items List */}
            {items.length === 0 ? (
                <p className="text-xs text-[#6b6b76] italic py-2">{emptyMessage}</p>
            ) : (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-xl bg-[#f6f6f7] border border-[#e6e6ea] flex items-start gap-3 relative group"
                        >
                            {/* Row Number */}
                            <span className="w-6 h-6 rounded-full bg-white border border-[#e6e6ea] flex items-center justify-center text-xs font-bold text-[#6b6b76] shrink-0 mt-2">
                                {index + 1}
                            </span>

                            {/* Rendered Inputs */}
                            <div className="flex-1 min-w-0">{renderItem(item, index)}</div>

                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="p-2 rounded-lg text-[#6b6b76] hover:text-[#eb4e62] hover:bg-white transition shrink-0"
                                title="Remove item"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-xs text-[#eb4e62] font-semibold">{error}</p>}
        </div>
    );
}
