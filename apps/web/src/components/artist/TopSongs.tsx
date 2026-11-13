import React from 'react';
import { Music, Play, ExternalLink } from 'lucide-react';
import { SongItem } from '@/lib/types';

interface TopSongsProps {
    categories: string[];
    songs?: SongItem[];
}

export default function TopSongs({ categories, songs }: TopSongsProps) {
    const isSinger = categories.some(
        (c) => c.toLowerCase().includes('singer') || c.toLowerCase().includes('vocal'),
    );

    if (!isSinger || !songs || songs.length === 0) return null;

    return (
        <section
            className="scroll-mt-36 bg-white rounded-[20px] p-6 sm:p-8 border border-[#e6e6ea] shadow-xs space-y-6"
            id="pp-music"
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1DB954]/15 text-[#1DB954]">
                            Spotify
                        </span>
                        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1b1b1f] tracking-tight">
                            Top songs
                        </h2>
                    </div>
                    <p className="text-sm text-[#6b6b76] mt-1">
                        Popular tracks, studio releases, and live singles on Spotify.
                    </p>
                </div>
            </div>

            <div className="space-y-2.5">
                {songs.slice(0, 5).map((song, idx) => (
                    <a
                        key={song.id || idx}
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#f6f6f7] hover:bg-[#fde6ea]/40 border border-transparent hover:border-[#eb4e62]/30 transition duration-200"
                    >
                        {/* Left: Index + Music icon + Title */}
                        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                            <span className="font-heading font-bold text-sm text-[#6b6b76] w-5 text-center group-hover:text-[#eb4e62]">
                                {idx + 1}
                            </span>

                            <div className="w-10 h-10 rounded-xl bg-white border border-[#e6e6ea] flex items-center justify-center text-[#1DB954] group-hover:bg-[#1DB954] group-hover:text-white transition">
                                <Music className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="font-heading font-bold text-sm text-[#1b1b1f] group-hover:text-[#eb4e62] transition truncate">
                                    {song.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-[#6b6b76] mt-0.5">
                                    {song.plays && <span>{song.plays}</span>}
                                    {song.plays && song.duration && <span>·</span>}
                                    {song.duration && <span>{song.duration}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Right: Listen Button */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#1DB954] group-hover:text-[#eb4e62] transition shrink-0 pl-3">
                            <span className="hidden sm:inline">Play on Spotify</span>
                            <ExternalLink className="h-4 w-4" />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
