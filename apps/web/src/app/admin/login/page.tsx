'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { login } from '@/lib/auth';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('admin@kalasquare.com');
    const [password, setPassword] = useState('Kalasquare@2026');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
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

    const handleFillDemo = () => {
        setEmail('admin@kalasquare.com');
        setPassword('Kalasquare@2026');
        setError(null);
    };

    return (
        <>
            {/* 1. Demo Bar fixed on top matching manager.html */}
            <div id="demoBar" role="navigation" aria-label="Demo pages">
                <b>Kalasquare Live Demo</b>
                <nav>
                    <Link href="/admin/login" aria-current="page">Login</Link>
                    <Link href="/">Home</Link>
                    <Link href="/admin/artists">Admin</Link>
                </nav>
                <span className="db-h">
                    Edit in Admin, then check the Home page.<br />
                    Send an enquiry on Home, then check Admin → Enquiries.
                </span>
                <button
                    type="button"
                    className="db-r"
                    id="db-reset"
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                >
                    Reset demo
                </button>
            </div>

            {/* 2. Login Gate matching manager.html lines 575-625 and screenshot 021b1672.jpg */}
            <div id="gate" role="dialog" aria-modal="true" aria-label="Admin sign in">
                <div className="g-stage">
                    <div className="g-bg" id="g-bg" aria-hidden="true">
                        <div className="g-glow" />
                        {/* 8 Floating Category Tiles */}
                        <div className="g-tile" style={{ left: '6%', top: '26%' }}>
                            <svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
                            <span>Singing</span>
                        </div>
                        <div className="g-tile" style={{ left: '20%', top: '26%' }}>
                            <svg viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="11" rx="2" /><path d="M3 10l2.5-5h4L7 10M9.5 10 12 5h4l-2.5 5M16 10l2.5-5H21v5" /></svg>
                            <span>Actor</span>
                        </div>
                        <div className="g-tile" style={{ left: '34%', top: '26%' }}>
                            <svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></svg>
                            <span>Models</span>
                        </div>
                        <div className="g-tile" style={{ left: '48%', top: '26%' }}>
                            <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>
                            <span>Influencer</span>
                        </div>
                        <div className="g-tile" style={{ left: '13%', top: '54%' }}>
                            <svg viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="2" /><path d="M5 7l7 3 7-3M12 10v4l-4 7M12 14l4 7" /></svg>
                            <span>Dancer</span>
                        </div>
                        <div className="g-tile" style={{ left: '27%', top: '54%' }}>
                            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 14a4 4 0 0 0 8 0M9 9.5h.01M15 9.5h.01" /></svg>
                            <span>Standup</span>
                        </div>
                        <div className="g-tile" style={{ left: '41%', top: '54%' }}>
                            <svg viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12" /></svg>
                            <span>Fitness</span>
                        </div>
                        <div className="g-tile" style={{ left: '55%', top: '54%' }}>
                            <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                            <span>Anchor</span>
                        </div>
                    </div>

                    <div className="g-brand">
                        <img className="g-logo" id="g-logo" src="/logo.png" alt="KalaSquare" width="184" height="40" />
                    </div>

                    <main>
                        <section className="g-card" aria-labelledby="g-t">
                            <span className="g-chip"><i></i>Admin panel</span>
                            <h1 id="g-t">Welcome back</h1>
                            <p className="g-sub">Sign in to the Kalasquare admin panel.</p>

                            <form id="g-f" onSubmit={handleSubmit} noValidate>
                                <div>
                                    <label htmlFor="g-user">Email or username</label>
                                    <input
                                        id="g-user"
                                        type="text"
                                        autoComplete="username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@kalasquare.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="g-pw">Password</label>
                                    <div className="g-field g-pw">
                                        <input
                                            id="g-pw"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            className="g-toggle"
                                            id="g-tg"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-controls="g-pw"
                                            aria-pressed={showPassword}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>
                                <div className="g-row">
                                    <label className="g-check">
                                        <input
                                            id="g-rem"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <span>Keep me signed in</span>
                                    </label>
                                    <a
                                        className="g-link"
                                        href="#forgot"
                                        id="g-fg"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert('Contact superadmin@kalasquare.com for credentials');
                                        }}
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                {error && (
                                    <p className="g-msg" id="g-msg" role="status" aria-live="polite">
                                        {error}
                                    </p>
                                )}
                                <button className="g-submit" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Signing in...' : 'Sign in to dashboard'}
                                </button>
                                <p className="g-demo">
                                    Demo login: <code>admin@kalasquare.com</code> · <code>Kalasquare@2026</code>{' '}
                                    <button type="button" id="g-fill" onClick={handleFillDemo}>
                                        Fill it
                                    </button>
                                </p>
                            </form>
                            <p className="g-secure">Authorised staff only. Sign-ins are logged.</p>
                        </section>
                    </main>

                    <footer>
                        <div className="g-venture">
                            A venture by <em>Delhi Infomedia Private Limited</em>
                        </div>
                        <p>India's artist management ecosystem for talent, brands and venues.</p>
                        <small>&copy; 2026 Kalasquare. All Rights Reserved.</small>
                    </footer>
                </div>
            </div>
        </>
    );
}
