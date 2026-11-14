import React from 'react';
import type { Metadata } from 'next';
import ArtistForm from '@/components/admin/ArtistForm';
import ArtistEditClient from '@/components/admin/ArtistEditClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Artist Profile | KalaSquare Admin',
    description: 'Create or edit an artist profile on KalaSquare.',
};

interface NewArtistPageProps {
    searchParams: Promise<{ edit?: string }>;
}

export default async function NewArtistPage({ searchParams }: NewArtistPageProps) {
    const params = await searchParams;
    if (params?.edit) {
        return <ArtistEditClient id={params.edit} />;
    }
    return <ArtistForm mode="create" />;
}
