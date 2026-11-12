# Project Overview - Kalasquare

## Overview

Kalasquare is a talent listing platform. Visitors discover artists, venues, and events on the Home Page. Admin manages the Home Page and Artist profiles. When an artist is published, it appears on the Home Page immediately. When a visitor clicks it, the full Artist Profile opens.

## Goals

1. Visitor can see Home Page with Hero, Platinum Artists, Categories, Spotlights, Events, Rising Artists, Venues.
2. Visitor can open an Artist Profile from the Home Page and see all details - videos, gallery, fanbase, awards, FAQs, reviews.
3. Visitor can send an enquiry for an artist.
4. Admin can add, edit, delete, verify, and publish artists.
5. Admin can control Home Page sections - order, selection, images.
6. Admin save must update the live site immediately.

## Core User Flow

1. Visitor opens Home Page.
2. Visitor browses by category - Actor, Singer, Dancer, etc. - or Platinum / Rising sections.
3. Visitor clicks an artist card.
4. Artist Profile opens - `/top-creators/sahil-badal`
5. Visitor sees videos, gallery, fanbase, awards, FAQs, reviews.
6. Visitor sends enquiry.
7. Admin logs in, opens Artists -> Add Artist, fills all details, clicks Save and Publish.
8. Artist appears on Home Page immediately.

## Features

### Public Home Page

- Header: Logo, Search, City dropdown, Sign In, Hamburger. Nav: Top Creators, Hire Artists, Events & Shows, Venues.
- Hero: Left text + 2 buttons, Right 4 gradient tiles + 3 overlapping cards.
- Platinum Artists, New on KalaSquare, Find Talent By Category (12 categories), Stage & Spotlights, Featured Events, Rising Artists, Venues, FAQ, Footer.
- 12 Categories: Actor, Singer, Musician, Band, Dancer, Comedian, Emcee, Speaker, Magician, DJ, Photographer, Crew / Company.

### Artist Profile Page - `/top-creators/[slug]`

- Hero: Photo + Rating + Badge (Platinum golden / Verified blue) + Name + Tagline + City + Categories + Specializations + CTA.
- Tabs: About, Fanbase, Gallery, Videos, Reels, Spotify, Work, IMDb, Reviews.
- Sections: About + Physical Stats, Quick Stats, Fanbase Donut Chart, Gallery (4 + Lightbox), Latest Videos, Reels, Top Songs (Singer only), Campaigns + Awards, IMDb (Actor only), FAQs (Platinum only), Reviews, Similar Artists.

### Admin - Add / Edit Artist

- Basic Details, Class and Visibility, About, Quick Stats, Physical Stats, Photo Gallery (max 12), Videos (max 6), Short Clips (max 8), Previous Campaigns (max 6), Awards (max 8), FAQs (max 8), Social and Links, Fanbase by Platform, SEO.
- Bottom sticky bar: Profile Completeness % + Cancel + Save as Draft + Save and Publish.

### Admin - Home Page Manager

- Sections: Hero, Platinum, Category, Spotlight, Events, Rising, Venues.
- Search + Select, Move Up / Down, Publish / Discard.

### Enquiries

- Visitor sends enquiry from Home Page or Artist Profile. Admin sees it in Admin -> Enquiries.

## Scope

### In Scope

- Public Home Page, Artist Profile Page, Category Listing.
- Admin Home Page Manager, Admin Artists CRUD, Admin Enquiries.
- Venues, Events, SEO, Uploads, Auth (Admin login).
- Publish / Draft / Pending logic, Mobile responsive.

### Out Of Scope

- Billing / Payment gateway.
- Artist self-signup - Phase 1 only Admin adds artists.
- Mobile-native app.
- Real WhatsApp automation - Only UI placeholder in Phase 1.

## Success Criteria - Acceptance Test

1. Admin creates artist -> Save as Draft -> Public URL returns 404.
2. Admin sets Verified ON + Publish -> Live profile opens at `/top-creators/test-artist`.
3. Admin edits tagline + photo -> Save -> Live page refresh shows new data.
4. Admin unpublishes -> Public URL returns 404 again.
5. All 4 steps pass on mobile as well.
