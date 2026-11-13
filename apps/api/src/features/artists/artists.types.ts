export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ArtistSummary {
    id: string;
    slug: string;
    name: string;
    tagline?: string | null;
    city: string;
    state?: string | null;
    artistClass: string;
    isVerified: boolean;
    isExclusive: boolean;
    categories: string[];
    profilePhotoUrl?: string | null;
    budgetRange?: string | null;
    priceLabel?: string | null;
    rating?: number;
    reviewCount?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}
