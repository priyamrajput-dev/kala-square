import React from 'react';
import type { Metadata } from 'next';
import ArtistsTable from '@/components/admin/ArtistsTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Artists Management | KalaSquare Admin',
  description: 'Manage, search, filter, and edit verified artists and creators on KalaSquare.',
};

export default function AdminArtistsPage() {
  return <ArtistsTable />;
}
