import React from 'react';
import type { Metadata } from 'next';
import EnquiriesTable from '@/components/admin/EnquiriesTable';

export const metadata: Metadata = {
    title: 'Enquiries | KalaSquare Admin',
    description: 'View and manage event booking requests and customer enquiries.',
};

export default function AdminEnquiriesPage() {
    return <EnquiriesTable />;
}
