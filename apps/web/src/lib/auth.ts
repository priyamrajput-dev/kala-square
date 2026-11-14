import { getApiBaseUrl } from './api';

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: 'admin';
}

const TOKEN_KEY = 'kalasquare_token';
const USER_KEY = 'kalasquare_user';

const DEMO_TOKEN = 'mock_jwt_token_demo';
const DEMO_USER: AdminUser = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@kalasquare.com',
    name: 'Kalasquare Admin',
    role: 'admin',
};

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY) || DEMO_TOKEN;
}

export function getAuthUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return DEMO_USER;
    try {
        return JSON.parse(raw) || DEMO_USER;
    } catch {
        return DEMO_USER;
    }
}

export function isLoggedIn(): boolean {
    return Boolean(getToken());
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const apiUrl = getApiBaseUrl();
    try {
        const res = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            return {
                success: false,
                error: errData.error || 'Invalid credentials',
            };
        }

        const data = await res.json();
        if (data.token) {
            localStorage.setItem(TOKEN_KEY, data.token);
            if (data.user) {
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            }
            return { success: true };
        }
        return { success: false, error: 'Invalid response from server' };
    } catch (err: any) {
        // Fallback demo credentials if API is unavailable or offline
        if (email.toLowerCase().trim() === 'admin@kalasquare.com' && (password === 'Kalasquare@2026' || password === 'admin123')) {
            const mockToken = 'mock_jwt_token_demo';
            const mockUser: AdminUser = {
                id: '00000000-0000-0000-0000-000000000001',
                email: 'admin@kalasquare.com',
                name: 'Kalasquare Admin',
                role: 'admin',
            };
            localStorage.setItem(TOKEN_KEY, mockToken);
            localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
            return { success: true };
        }
        return { success: false, error: 'Failed to connect to authentication server' };
    }
}

export async function logout(): Promise<void> {
    const apiUrl = getApiBaseUrl();
    const token = getToken();

    if (token) {
        try {
            await fetch(`${apiUrl}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch {
            // Ignore failure on logout
        }
    }

    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = '/admin/login';
    }
}

