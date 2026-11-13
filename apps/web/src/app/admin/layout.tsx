import type { Metadata } from 'next';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: 'KalaSquare Admin Portal',
  description: 'Manage talent, profiles, media, and homepage curation on KalaSquare.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}

