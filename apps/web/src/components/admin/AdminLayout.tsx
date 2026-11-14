'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isLoggedIn, logout } from '@/lib/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const icSvg = (path: React.ReactNode, cls = 'ic') => (
  <svg
    className={cls}
    viewBox="0 0 24 24"
    width={cls === 'chev' ? 16 : 18}
    height={cls === 'chev' ? 16 : 18}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // Accordion states matching manager.html (home & artists open by default)
  const [homeOpen, setHomeOpen] = useState(true);
  const [artistsOpen, setArtistsOpen] = useState(true);
  const [venuesOpen, setVenuesOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthChecked(true);
      return;
    }
    // Enforce authentication on all protected admin routes
    if (!isLoggedIn()) {
      router.replace('/admin/login');
    } else {
      setAuthChecked(true);
    }
  }, [pathname, router]);

  // Do NOT wrap login page with admin sidebar/header layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const [hasEditParam, setHasEditParam] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasEditParam(window.location.search.includes('edit='));
    }
  }, [pathname]);

  const isViewAllArtistsActive = pathname === '/admin/artists';
  const isAddArtistActive = pathname === '/admin/artists/new' || pathname.includes('/edit');
  const isArtistClassActive = pathname === '/admin/artists/class';
  const isEdit = pathname.includes('/edit') || hasEditParam;

  const handleSignOut = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#f3f3f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#6b6b76]">
          <svg className="animate-spin h-6 w-6 text-[#eb4e62]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-xs font-semibold tracking-wide">Checking authorization...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Demo Bar fixed on top (from manager.html line 570) */}
      <div id="demoBar" role="navigation" aria-label="Demo pages">
        <b>Kalasquare Live Demo</b>
        <nav>
          <Link href="/admin/login">Login</Link>
          <Link href="/">Home</Link>
          <Link href="/admin/artists" aria-current="page">Admin</Link>
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
            if (typeof window !== 'undefined') {
              localStorage.clear();
              window.location.reload();
            }
          }}
        >
          Reset demo
        </button>
      </div>

      {/* 2. Main Application Grid (app layout from manager.html line 624) */}
      <div className="app" id="app">
        {/* Left Sidebar */}
        <aside className="side">
          <div className="brand">
            <Link href="/" aria-label="KalaSquare">
              <img
                className="logo"
                src="/logo.png"
                alt="KalaSquare"
                width={157}
                height={34}
                style={{ display: 'block', height: '34px', width: 'auto', maxWidth: '100%' }}
              />
            </Link>
          </div>

          <div>
            <nav className="nav" id="nav" aria-label="Home page sections">
              {/* OVERVIEW SECTION */}
              <p className="navl">OVERVIEW</p>
              <button type="button" className="nv mod" title="Overview">
                <span className="nm">
                  {icSvg(
                    <>
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="5" rx="1.5" />
                      <rect x="14" y="12" width="7" height="9" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </>
                  )}
                  Dashboard
                </span>
              </button>
              <Link href="/" target="_blank" className="nv mod">
                <span className="nm">
                  {icSvg(
                    <>
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                  Home page preview
                </span>
              </Link>

              {/* MANAGE SECTION */}
              <p className="navl" style={{ marginTop: '16px' }}>MANAGE</p>

              {/* Home page Accordion */}
              <button
                type="button"
                className="nv mod par"
                aria-expanded={homeOpen}
                onClick={() => setHomeOpen(!homeOpen)}
              >
                <span className="nm">
                  {icSvg(<path d="M3 11l9-7 9 7M5 10v10h14V10" />)}
                  Home page
                </span>
                {icSvg(<path d="M6 9l6 6 6-6" />, 'chev')}
              </button>
              {homeOpen && (
                <div className="kids">
                  <div className="nv kid"><span className="nm">Hero section</span><span className="ct-n">0/4</span></div>
                  <div className="nv kid"><span className="nm">Platinum artists</span><span className="ct-n">5</span></div>
                  <div className="nv kid"><span className="nm">Find talent by category</span><span className="ct-n">12</span></div>
                  <div className="nv kid"><span className="nm">Stage &amp; Spotlights</span><span className="ct-n">3</span></div>
                  <div className="nv kid"><span className="nm">Featured events</span><span className="ct-n">4</span></div>
                  <div className="nv kid"><span className="nm">Rising artists</span><span className="ct-n">4</span></div>
                  <div className="nv kid"><span className="nm">Venues</span><span className="ct-n">6</span></div>
                  <div className="nv kid"><span className="nm">Photo size guide</span></div>
                </div>
              )}

              {/* Artists Accordion (Interactive Section) */}
              <button
                type="button"
                className="nv mod par"
                aria-expanded={artistsOpen}
                data-on="1"
                onClick={() => setArtistsOpen(!artistsOpen)}
              >
                <span className="nm">
                  {icSvg(
                    <>
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                    </>
                  )}
                  Artists
                </span>
                {icSvg(<path d="M6 9l6 6 6-6" />, 'chev')}
              </button>
              {artistsOpen && (
                <div className="kids">
                  <Link
                    href="/admin/artists"
                    className="nv kid"
                    aria-current={isViewAllArtistsActive ? 'page' : undefined}
                  >
                    <span className="nm">View all artists</span>
                    <span className="ct-n">26</span>
                  </Link>
                  <Link
                    href="/admin/artists/new"
                    className="nv kid"
                    aria-current={isAddArtistActive ? 'page' : undefined}
                  >
                    <span className="nm">{isEdit ? 'Edit artist' : 'Add artist'}</span>
                  </Link>
                  <Link
                    href="/admin/artists/class"
                    className="nv kid"
                    aria-current={isArtistClassActive ? 'page' : undefined}
                  >
                    <span className="nm">Artist class</span>
                  </Link>
                </div>
              )}

              {/* Venues Accordion */}
              <button
                type="button"
                className="nv mod par"
                aria-expanded={venuesOpen}
                onClick={() => setVenuesOpen(!venuesOpen)}
              >
                <span className="nm">
                  {icSvg(<path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" />)}
                  Venues
                </span>
                {icSvg(<path d="M6 9l6 6 6-6" />, 'chev')}
              </button>
              {venuesOpen && (
                <div className="kids">
                  <div className="nv kid"><span className="nm">View all venues</span><span className="ct-n">9</span></div>
                  <div className="nv kid"><span className="nm">Add venue</span></div>
                </div>
              )}

              {/* Additional MANAGE items */}
              <div className="nv mod">
                <span className="nm">
                  {icSvg(
                    <>
                      <path d="M4 5h16v11H9l-5 4z" />
                      <path d="M8 9h8M8 12h5" />
                    </>
                  )}
                  Enquiries
                </span>
                <span className="ct-n">1</span>
              </div>

              <div className="nv mod">
                <span className="nm">
                  {icSvg(<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z" />)}
                  Membership
                </span>
              </div>

              <div className="nv mod">
                <span className="nm">
                  {icSvg(<path d="M12 3l2.6 5.600 6.100.700-4.500 4.200 1.200 6L12 16.500 6.600 19.500l1.200-6L3.300 9.300l6.100-.700z" />)}
                  Media · KS Spotlight
                </span>
              </div>

              <div className="nv mod">
                <span className="nm">
                  {icSvg(
                    <>
                      <circle cx="6" cy="6" r="2" />
                      <circle cx="6" cy="18" r="2" />
                      <path d="M6 8v8M11 6h9M11 12h6M11 18h9" />
                    </>
                  )}
                  Timeline
                </span>
                <span className="ct-n" style={{ background: '#fde6ea', color: '#d63a50' }}>New</span>
              </div>

              <div className="nv mod">
                <span className="nm">
                  {icSvg(
                    <>
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M3 10h18M8 3v4M16 3v4" />
                    </>
                  )}
                  Events
                </span>
                <span className="soon">Soon</span>
              </div>

              {/* GROWTH SECTION */}
              <p className="navl" style={{ marginTop: '16px' }}>GROWTH</p>
              <div className="nv mod">
                <span className="nm">
                  {icSvg(
                    <>
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-4-4" />
                    </>
                  )}
                  SEO manager
                </span>
              </div>

              <button
                type="button"
                className="nv mod par"
                aria-expanded={waOpen}
                onClick={() => setWaOpen(!waOpen)}
              >
                <span className="nm">
                  {icSvg(<path d="M4 5h16v11H9l-5 4z" />)}
                  WhatsApp
                </span>
                {icSvg(<path d="M6 9l6 6 6-6" />, 'chev')}
              </button>

              <div className="nv mod">
                <span className="nm">
                  {icSvg(
                    <>
                      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                    </>
                  )}
                  Data export
                </span>
              </div>

              {/* ADMIN SECTION */}
              <p className="navl" style={{ marginTop: '16px' }}>ADMIN</p>
              <button
                type="button"
                className="nv mod par"
                aria-expanded={usersOpen}
                onClick={() => setUsersOpen(!usersOpen)}
              >
                <span className="nm">
                  {icSvg(
                    <>
                      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                      <path d="M9 12l2 2 4-4" />
                    </>
                  )}
                  Users &amp; roles
                </span>
                {icSvg(<path d="M6 9l6 6 6-6" />, 'chev')}
              </button>

              <div className="nv mod">
                <span className="nm">
                  {icSvg(<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />)}
                  Developer handoff
                </span>
              </div>
            </nav>
          </div>

          {/* Bottom user footer section (.who from manager.html line 631) */}
          <div className="who">
            <span className="ava">A</span>
            <span>
              Admin<br />
              <button type="button" onClick={handleSignOut} id="so">Sign out</button>
            </span>
          </div>
        </aside>

        {/* Main Content Area (.main from manager.html line 634) */}
        <div className="main">
          {/* Top Admin Header (.top from manager.html line 635) */}
          <header className="top">
            <div className="tl">
              <h1>Kalasquare admin</h1>
              <button
                type="button"
                className="pill sample"
                id="btnSampleData"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('fillSampleData'));
                }}
              >
                Sample data
              </button>
            </div>
            <div className="tr">
              <a
                className="btn"
                href="https://www.kalasquare.com/"
                target="_blank"
                rel="noopener"
              >
                View live site
              </a>
            </div>
          </header>

          {/* Children panel (.panel from manager.html) */}
          <main id="panel" style={{ paddingTop: '20px' }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
