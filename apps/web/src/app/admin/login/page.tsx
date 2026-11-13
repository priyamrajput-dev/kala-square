'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/auth';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('admin@kalasquare.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const result = await login(email, password);
        setIsLoading(false);

        if (result.success) {
            router.push('/admin/artists');
        } else {
            setError(result.error || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f3f5] flex flex-col justify-center items-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-black/5 p-8">
                {/* Brand Logo / Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg">
                            K
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-black">
                            Kala<span className="text-[#eb4e62]">Square</span>
                        </span>
                    </Link>
                    <h1 className="text-xl font-bold text-black">Admin Portal Sign In</h1>
                    <p className="text-sm text-black/60 mt-1">
                        Enter your administrator credentials to access the management dashboard.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/70 mb-2">
                            Admin Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#eb4e62] focus:border-transparent transition"
                            placeholder="admin@kalasquare.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-black/70 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#eb4e62] focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 rounded-xl bg-[#eb4e62] hover:bg-[#d93d51] text-white font-semibold text-sm shadow-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-black/5 text-center">
                    <p className="text-xs text-black/40">
                        Default demo access: <span className="font-mono text-black/70">admin@kalasquare.com</span> / <span className="font-mono text-black/70">admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
