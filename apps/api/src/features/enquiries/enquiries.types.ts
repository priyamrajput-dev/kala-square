export interface EnquiryNoteItem {
    id: string;
    text: string;
    createdAt: string;
    author?: string;
}

export interface EnquiryTimelineItem {
    id: string;
    title: string;
    time: string;
    description: string;
}

export interface EnquiryListItem {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    city: string | null;
    eventDate: string | null;
    eventType: string | null;
    budget: string | null;
    message: string;
    status: 'new' | 'contacted' | 'booked' | 'closed';
    notes: EnquiryNoteItem[];
    createdAt: string;
    artist?: {
        id: string;
        name: string;
        slug: string;
        photoUrl?: string | null;
    } | null;
}
