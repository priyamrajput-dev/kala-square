# UI Context - Kalasquare

## Theme

Light only. No dark mode in Phase 1. Background #f3f3f5, Card #ffffff.

## Colors - Kalasquare Tokens - Do Not Use Ghost AI Dark Tokens

| Role | Hex |
| :--- | :--- |
| **Coral** | #eb4e62 |
| **Coral Dark** | #d63a50 |
| **Peach** | #fde6ea |
| **Background** | #f3f3f5 |
| **Card** | #ffffff |
| **Ink** | #1b1b1f |
| **Mute** | #6b6b76 |
| **Line** | #e6e6ea |
| **Field** | #f6f6f7 |
| **Success** | #1a8a57 |
| **Warning** | #8f5a00 |

Category / Hero / Event / Venue cards gradient: `#f8a4b0` to `#d63a50` pink-red gradient, white icon in center.

## Typography

| Role | Font |
| :--- | :--- |
| **Headings** | Bricolage Grotesque 800, letter-spacing -0.02em |
| **Body** | DM Sans 14px / 1.5 |
| **Logo** | Kala in black + Square in red |

## Border Radius

| Context | Class |
| :--- | :--- |
| **Small elements** | rounded 10px |
| **Cards** | rounded 16-20px |
| **Admin form card** | rounded 12px |
| **Modal** | rounded 16px |

## Layout Patterns

- **Public Header**: Logo left, Search center, City dropdown + Sign In red button + Hamburger right. Below nav: Top Creators, Hire Artists, Events & Shows, Venues.
- **Public Hero**: Left text + 2 buttons, Right 4 gradient tiles + 3 overlapping cards.
- **Admin**: Left sidebar 248px sticky, Main max-width 1320px, gap 32px. Top bar: Kalasquare admin + Sample data pill + View live site.
- **Admin Form**: White card, Label bold 14px, Input Field bg #f6f6f7, radius 10px, Required shows red *.
- **Bottom sticky bar**: Profile Completeness % + Cancel + Save as Draft + Save and Publish (red).

## Component Rules

- **Artist Card**: Photo top rounded, Name bold 18px + Category and City grey 14px. Selected border coral.
- **Category Card**: 800x760 ratio, gradient, top-right white pill count, center white outline icon, bottom Name bold.
- **Event Card**: Poster gradient, top-left badge Trending / New / Filling fast / KS Original, Title white bold.
- **Venue Card**: Gradient top + house icon, bottom white part with code badge overlapping.
- **FAQ**: Full pink background #eb4e62, left heading white, right white accordion cards.
- **Footer**: White, 3 columns Information / Useful Links / Follow Us On, Copyright 2026 KalaSquare.

## Icons

- Lucide React, stroke icons only. Inline h-4 w-4, buttons h-5 w-5.
- Category icons: SVG paths from `CATS` array in HTML file.

## Screenshots = Source Of Truth

`screenshots/` folder has 14 screenshots. Do NOT create a design that differs from them by even 1 pixel. HTML file `Kalasquare_Home_Page_Manager_2.html` is also source of truth.
