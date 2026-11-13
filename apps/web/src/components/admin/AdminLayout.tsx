'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    LayoutDashboard,
    Home,
    MessageSquare,
    Building2,
    Settings,
    ExternalLink,
    Menu,
    X,
    CheckCircle2,
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const navItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, ready: false },
        { label: 'Artists', href: '/admin/artists', icon: Users, ready: true },
        { label: 'Home Page Manager', href: '/admin/home', icon: Home, ready: false },
        { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare, ready: false },
        { label: 'Venues', href: '/admin/venues', icon: Building2, ready: false },
        { label: 'Settings', href: '/admin/settings', icon: Settings, ready: false },
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#f3f3f5] text-[#1b1b1f]">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 bg-[#1b1b1f] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in border border-white/10">
                    <CheckCircle2 className="h-4 w-4 text-[#eb4e62]" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Mobile Top Navigation Bar */}
            <div className="md:hidden bg-white border-b border-[#e6e6ea] px-4 h-16 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin"
                        className="font-heading font-extrabold text-xl tracking-tight"
                    >
                        <span>Kala</span>
                        <span className="text-[#eb4e62]">Square</span>
                        <span className="ml-1.5 text-xs uppercase px-2 py-0.5 rounded bg-[#f6f6f7] text-[#6b6b76] font-semibold">
                            Admin
                        </span>
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg text-[#1b1b1f] hover:bg-[#f6f6f7]"
                    aria-label="Toggle navigation menu"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Left Sidebar (Desktop) / Mobile Drawer */}
            <aside
                className={`${
                    mobileMenuOpen ? 'block' : 'hidden'
                } md:block w-full md:w-64 bg-white border-r border-[#e6e6ea] shrink-0 md:sticky md:top-0 md:h-screen flex flex-col justify-between z-30`}
            >
                <div>
                    {/* Logo Brand Header */}
                    <div className="p-6 border-b border-[#e6e6ea] hidden md:flex items-center justify-between">
                        <Link
                            href="/admin"
                            className="font-heading font-extrabold text-2xl tracking-tight"
                        >
                            <span>Kala</span>
                            <span className="text-[#eb4e62]">Square</span>
                            <span className="ml-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#fde6ea] text-[#eb4e62]">
                                Admin
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-3 sm:p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                item.ready &&
                                (pathname === item.href || pathname.startsWith(`${item.href}/`));

                            if (!item.ready) {
                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() =>
                                            showToast(`${item.label} is coming in the next prompt`)
                                        }
                                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#6b6b76] hover:bg-[#f6f6f7] hover:text-[#1b1b1f] transition cursor-pointer text-left"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                                        isActive
                                            ? 'bg-[#fde6ea] text-[#eb4e62]'
                                            : 'text-[#6b6b76] hover:bg-[#f6f6f7] hover:text-[#1b1b1f]'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer Link to Public Website */}
                <div className="p-4 border-t border-[#e6e6ea]">
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-[#f6f6f7] hover:bg-neutral-200/80 text-xs font-bold text-[#1b1b1f] transition"
                    >
                        <span>View Live Website</span>
                        <ExternalLink className="h-3.5 w-3.5 text-[#6b6b76]" />
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1240px] w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
