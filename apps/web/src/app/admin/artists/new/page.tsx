import React from 'react';
import type { Metadata } from 'next';
import ArtistForm from '@/components/admin/ArtistForm';

export const metadata: Metadata = {
  title: 'Add New Artist | KalaSquare Admin',
  description: 'Create and onboard a new artist profile on KalaSquare.',
};

export default function NewArtistPage() {
  return <ArtistForm mode="create" />;
}

