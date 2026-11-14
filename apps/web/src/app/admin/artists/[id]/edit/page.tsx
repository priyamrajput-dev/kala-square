import React from 'react';
import type { Metadata } from 'next';
import ArtistEditClient from '@/components/admin/ArtistEditClient';
import { mockArtistProfiles, getArtistProfileBySlug } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
    const { id } = await params;
    const artist =
        mockArtistProfiles.find((a) => a.id === id || a.slug === id) || getArtistProfileBySlug(id);

    return {
        title: artist
            ? `Edit ${artist.name} | KalaSquare Admin`
            : 'Artist Not Found | KalaSquare Admin',
    };
}

export default async function EditArtistPage({ params }: EditPageProps) {
    const { id } = await params;
    return <ArtistEditClient id={id} />;
}

