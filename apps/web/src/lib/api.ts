import { getToken } from './auth';
import {
    mockArtists,
    mockArtistProfiles,
    mockEnquiries,
    mockCategories,
    mockEvents,
    mockVenues,
    mockFAQs,
    mockSpotlights,
    mockHomeConfig,
    getArtistProfileBySlug,
} from './mock-data';
import { HomeConfig } from './validators/home-config';
import { ArtistProfile } from './types';

export function getApiBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== 'http://localhost:3001') {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return 'https://api-production-310c622d.up.railway.app';
    }
    if (process.env.NODE_ENV === 'production') {
        return 'https://api-production-310c622d.up.railway.app';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

const API_BASE =
    (typeof window === 'undefined' && process.env.INTERNAL_API_URL)
        ? process.env.INTERNAL_API_URL
        : getApiBaseUrl();

// Helper for authenticated admin headers
function getAdminHeaders(): HeadersInit {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// Handle 401 unauthorized
function handleUnauthorized(res: Response) {
    if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('kalasquare_token');
        localStorage.removeItem('kalasquare_user');
        window.location.href = '/admin/login';
    }
}

// ==========================================
// PUBLIC APIS
// ==========================================

export async function fetchPublicArtists(query: {
    category?: string;
    artistClass?: string;
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
} = {}) {
    try {
        const params = new URLSearchParams();
        if (query.category) params.set('category', query.category);
        if (query.artistClass) params.set('artistClass', query.artistClass);
        if (query.city) params.set('city', query.city);
        if (query.search) params.set('search', query.search);
        if (query.page) params.set('page', String(query.page));
        if (query.limit) params.set('limit', String(query.limit));

        const res = await fetch(`${API_BASE}/api/public/artists?${params.toString()}`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(2000),
        });

        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Fallback to mock data if API is offline
    }

    // Fallback
    const page = query.page || 1;
    const limit = query.limit || 12;
    let filtered = mockArtists;
    if (query.category && query.category !== 'all') {
        filtered = filtered.filter((a) =>
            (a.categories || [a.cat]).some((c) => c.toLowerCase().includes(query.category!.toLowerCase()))
        );
    }
    const total = filtered.length;
    const start = (page - 1) * limit;
    return {
        data: filtered.slice(start, start + limit),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
}

export async function fetchPublicArtistBySlug(slug: string): Promise<ArtistProfile | null> {
    try {
        const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();
        const res = await fetch(`${API_BASE}/api/public/artists/${encodeURIComponent(decodedSlug)}`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Fallback to mock data if API is offline
    }

    const found = getArtistProfileBySlug(slug);
    return found || null;
}

export async function fetchPublicHome() {
    try {
        const res = await fetch(`${API_BASE}/api/public/home`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(2000),
        });

        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Fallback to mock data if API is offline
    }

    return {
        config: mockHomeConfig,
        hero: mockHomeConfig.hero,
        platinumArtists: mockArtists.filter((a) => a.tier === 'platinum').slice(0, 4),
        newArtists: mockArtists.slice(4, 8),
        categories: mockCategories,
        spotlights: mockSpotlights,
        events: mockEvents,
        risingArtists: mockArtists.filter((a) => a.tier === 'rising').slice(0, 4),
        venues: mockVenues,
        faqs: mockFAQs,
        footer: mockHomeConfig.footer,
    };
}

// ==========================================
// ADMIN ARTISTS APIS
// ==========================================

export async function fetchAdminArtists(query: {
    search?: string;
    category?: string;
    artistClass?: string;
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
} = {}) {
    try {
        const params = new URLSearchParams();
        if (query.search) params.set('search', query.search);
        if (query.category) params.set('category', query.category);
        if (query.artistClass) params.set('artistClass', query.artistClass);
        if (query.status) params.set('status', query.status);
        if (query.sort) params.set('sort', query.sort);
        if (query.page) params.set('page', String(query.page));
        if (query.limit) params.set('limit', String(query.limit));

        const res = await fetch(`${API_BASE}/api/admin/artists?${params.toString()}`, {
            headers: getAdminHeaders(),
        });

        handleUnauthorized(res);

        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Fallback
    }

    // Local fallback for offline mode
    const fallbackList = mockArtistProfiles.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        city: p.city,
        state: p.state,
        artistClass: p.artistClass,
        isVerified: p.isVerified,
        isExclusive: false,
        categories: p.categories,
        profilePhotoUrl: p.photoUrl,
        status: 'published',
        completeness: 95,
        updatedAt: new Date().toISOString(),
        priceLabel: p.priceLabel,
    }));

    return {
        data: fallbackList,
        pagination: { page: 1, limit: 10, total: fallbackList.length, totalPages: 1 },
    };
}

export async function fetchAdminArtistById(id: string) {
    try {
        const res = await fetch(`${API_BASE}/api/admin/artists/${id}`, {
            headers: getAdminHeaders(),
        });
        handleUnauthorized(res);
        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Fallback
    }

    const found = mockArtistProfiles.find((p) => p.id === id || p.slug === id);
    return found || null;
}

export async function createArtist(data: any) {
    const res = await fetch(`${API_BASE}/api/admin/artists`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create artist');
    }
    return await res.json();
}

export async function updateArtist(id: string, data: any) {
    const res = await fetch(`${API_BASE}/api/admin/artists/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(data),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update artist');
    }
    return await res.json();
}

export async function deleteArtist(id: string) {
    const res = await fetch(`${API_BASE}/api/admin/artists/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete artist');
    }
    return await res.json();
}

export async function duplicateArtist(id: string) {
    const res = await fetch(`${API_BASE}/api/admin/artists/${id}/duplicate`, {
        method: 'POST',
        headers: getAdminHeaders(),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to duplicate artist');
    }
    return await res.json();
}

export async function publishArtist(id: string) {
    const res = await fetch(`${API_BASE}/api/admin/artists/${id}/publish`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to publish artist');
    }
    return await res.json();
}

export async function unpublishArtist(id: string) {
    const res = await fetch(`${API_BASE}/api/admin/artists/${id}/unpublish`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to unpublish artist');
    }
    return await res.json();
}

// ==========================================
// ADMIN HOME PAGE APIS
// ==========================================

export async function fetchAdminHome(): Promise<{ draft: HomeConfig; published: HomeConfig }> {
    try {
        const res = await fetch(`${API_BASE}/api/admin/home-page`, {
            headers: getAdminHeaders(),
        });
        handleUnauthorized(res);
        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Fallback
    }
    return { draft: mockHomeConfig, published: mockHomeConfig };
}

export async function saveHome(config: HomeConfig) {
    const res = await fetch(`${API_BASE}/api/admin/home-page`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(config),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save home page configuration');
    }
    return await res.json();
}

export async function publishHome(config: HomeConfig) {
    const res = await fetch(`${API_BASE}/api/admin/home-page/publish`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(config),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to publish home page configuration');
    }
    return await res.json();
}

// ==========================================
// ENQUIRIES APIS
// ==========================================

export async function createEnquiry(data: {
    artistId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    eventDate?: string;
    eventType?: string;
    budget?: string;
    message: string;
}) {
    const res = await fetch(`${API_BASE}/api/public/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to send enquiry');
    }
    return await res.json();
}

export async function fetchEnquiries(query: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
} = {}) {
    try {
        const params = new URLSearchParams();
        if (query.status) params.set('status', query.status);
        if (query.search) params.set('search', query.search);
        if (query.page) params.set('page', String(query.page));
        if (query.limit) params.set('limit', String(query.limit));

        const res = await fetch(`${API_BASE}/api/admin/enquiries?${params.toString()}`, {
            headers: getAdminHeaders(),
        });
        handleUnauthorized(res);
        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Fallback
    }

    return {
        data: mockEnquiries,
        pagination: { page: 1, limit: 10, total: mockEnquiries.length, totalPages: 1 },
    };
}

export async function updateEnquiryStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/api/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status }),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update enquiry status');
    }
    return await res.json();
}

export async function addEnquiryNote(id: string, note: string) {
    const res = await fetch(`${API_BASE}/api/admin/enquiries/${id}/notes`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ note }),
    });
    handleUnauthorized(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to add note');
    }
    return await res.json();
}

// ==========================================
// UPLOADS API
// ==========================================

export async function uploadFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/api/admin/uploads`, {
        method: 'POST',
        headers,
        body: formData,
    });

    handleUnauthorized(res);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'File upload failed');
    }

    const data = await res.json();
    return {
        url: data.url.startsWith('http') ? data.url : `${API_BASE}${data.url}`,
    };
}
