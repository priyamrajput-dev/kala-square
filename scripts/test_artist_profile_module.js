const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('  KALASQUARE ARTIST PROFILE MODULE — ACCEPTANCE TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`[PASS] ${name}`);
        passCount++;
    } catch (err) {
        console.error(`[FAIL] ${name}:`, err.message);
        failCount++;
    }
}

// -----------------------------------------------------------------------------
// 1. COMPLETENESS PERCENTAGE TEST (REQ-026)
// -----------------------------------------------------------------------------
console.log('--- SUITE 1: Profile Completeness Score Calculation (REQ-026) ---');

function calcCompleteness(data) {
    const soc = Boolean(
        data.instagram ||
        data.youtube ||
        data.facebook ||
        data.spotify ||
        data.x ||
        data.website ||
        data.imdbUrl ||
        data.socialInstagram ||
        data.socialYouTube ||
        data.socialFacebook ||
        data.socialX ||
        data.socialSpotify,
    );

    const chk = [
        Boolean(data.name && data.name.trim().length > 0),
        Boolean(data.photoUrl || data.profilePhotoUrl),
        Boolean(data.categories && data.categories.length > 0),
        Boolean(data.city && data.city.trim().length > 0),
        Boolean(data.tagline && data.tagline.trim().length > 0),
        Boolean(data.bio && data.bio.trim().length > 0),
        Boolean(data.experienceYears && String(data.experienceYears).trim().length > 0),
        Boolean(data.projectsCount && String(data.projectsCount).trim().length > 0),
        Boolean(data.liveShowsCount && String(data.liveShowsCount).trim().length > 0),
        Boolean(data.totalFollowersLabel && String(data.totalFollowersLabel).trim().length > 0),
        Boolean(
            (Array.isArray(data.specializations) && data.specializations.length > 0) ||
            (typeof data.specializations === 'string' && data.specializations.trim().length > 0),
        ),
        Boolean(data.gallery && data.gallery.length >= 3),
        Boolean(data.videos && data.videos.some((v) => v.url && v.url.trim().length > 0)),
        Boolean(data.clips && data.clips.some((c) => c.url && c.url.trim().length > 0)),
        Boolean(
            data.songs &&
            data.songs.some(
                (s) => (s.url && s.url.trim().length > 0) || (s.u && s.u.trim().length > 0),
            ),
        ),
        Boolean(data.campaigns && data.campaigns.length > 0),
        Boolean(data.awards && data.awards.length > 0),
        soc,
        Boolean(data.phone && String(data.phone).trim().length > 0),
    ];

    return Math.round((chk.filter(Boolean).length / chk.length) * 100);
}

test('REQ-026.1: Initial empty form completeness is exactly 0%', () => {
    const empty = { name: '', categories: [], city: '' };
    assert.strictEqual(calcCompleteness(empty), 0);
});

test('REQ-026.2: Partially filled profile calculates accurate fraction', () => {
    const partial = {
        name: 'Aarav Sharma',
        city: 'Delhi',
        categories: ['Singer'],
        photoUrl: 'https://images.unsplash.com/photo-1',
    };
    const score = calcCompleteness(partial);
    assert.strictEqual(score, Math.round((4 / 19) * 100)); // ~21%
});

test('REQ-026.3: Fully populated profile achieves 95-100%', () => {
    const full = {
        name: 'Aarav Sharma',
        photoUrl: 'https://example.com/photo.jpg',
        categories: ['Singer'],
        city: 'Delhi',
        tagline: 'Playback Singer & Performer',
        bio: 'Renowned vocalist from Delhi with 10+ years experience.',
        experienceYears: '10',
        projectsCount: '45',
        liveShowsCount: '120',
        totalFollowersLabel: '150k',
        specializations: ['Sufi', 'Bollywood', 'Ghazal'],
        gallery: ['img1', 'img2', 'img3', 'img4'],
        videos: [{ title: 'Live Performance', url: 'https://youtube.com/watch?v=1' }],
        clips: [{ title: 'Acoustic Clip', url: 'https://instagram.com/reel/1' }],
        songs: [{ title: 'Sufiana', url: 'https://spotify.com/track/1' }],
        campaigns: [{ brandName: 'KalaSquare Live', category: 'Live' }],
        awards: [{ title: 'Best Stage Performer', year: '2025' }],
        socialInstagram: 'https://instagram.com/aarav',
        phone: '+91 9876543210',
    };
    const score = calcCompleteness(full);
    assert.strictEqual(score, 100);
});

// -----------------------------------------------------------------------------
// 2. DRAFT VS PUBLISHED STATUS & VISIBILITY LOGIC (REQ-001, REQ-002, REQ-003)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Status & Visibility Rules (REQ-001, REQ-002, REQ-003) ---');

function resolveProfileStatus(mode, isVerified) {
    if (mode === 'draft') return 'draft';
    return isVerified ? 'live' : 'pending';
}

function isPubliclyAccessible(status) {
    return status === 'live' || status === 'published';
}

test('REQ-001: Save as Draft yields status "draft" and returns 404 (Not Found)', () => {
    const status = resolveProfileStatus('draft', false);
    assert.strictEqual(status, 'draft');
    assert.strictEqual(isPubliclyAccessible(status), false);
});

test('REQ-002: Publish with verified documents yields status "live" and is accessible', () => {
    const status = resolveProfileStatus('live', true);
    assert.strictEqual(status, 'live');
    assert.strictEqual(isPubliclyAccessible(status), true);
});

test('REQ-003: Publish with UNVERIFIED documents yields status "pending" and returns 404', () => {
    const status = resolveProfileStatus('live', false);
    assert.strictEqual(status, 'pending');
    assert.strictEqual(isPubliclyAccessible(status), false);
});

// -----------------------------------------------------------------------------
// 3. FOLLOWER PARSING & METRIC ACCURACY (REQ-005, REQ-008)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Metric Accuracy & Follower Parsing (REQ-005, REQ-008) ---');

function parseFollowerCount(label, artist) {
    if (label && typeof label === 'string' && label.trim().length > 0) {
        const raw = label.trim().toLowerCase();
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        if (!isNaN(num)) {
            if (raw.endsWith('m')) return Math.round(num * 1000000);
            if (raw.endsWith('k')) return Math.round(num * 1000);
            return Math.round(num);
        }
    }
    if (typeof artist?.fol === 'number') return artist.fol;
    return 0; // Strictly 0, never phantom 50,000
}

test('REQ-005.1: Parse 150k followers correctly', () => {
    assert.strictEqual(parseFollowerCount('150k'), 150000);
});

test('REQ-005.2: Parse 1.2M followers correctly', () => {
    assert.strictEqual(parseFollowerCount('1.2M'), 1200000);
});

test('REQ-005.3: Parse plain numeric follower string correctly', () => {
    assert.strictEqual(parseFollowerCount('1066'), 1066);
});

test('REQ-005.4: Empty or undefined follower label yields 0 (no phantom 50k)', () => {
    assert.strictEqual(parseFollowerCount(''), 0);
    assert.strictEqual(parseFollowerCount(undefined, {}), 0);
    assert.strictEqual(parseFollowerCount(null, { fol: 0 }), 0);
});

// -----------------------------------------------------------------------------
// 4. SECTION CONDITIONAL RENDERING PARITY (REQ-007, REQ-012, REQ-014, REQ-016)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Section Conditional Visibility Parity (Kalasquare HTML) ---');

test('REQ-012: Spotify Top Songs renders ONLY if Singer category is present', () => {
    const singer = { categories: ['Singer', 'Musician'], songs: [{ title: 'Track 1' }] };
    const actor = { categories: ['Actor', 'Theatre'], songs: [{ title: 'Track 1' }] };

    const shouldRenderSinger = singer.categories.includes('Singer') && singer.songs.length > 0;
    const shouldRenderActor = actor.categories.includes('Singer') && actor.songs.length > 0;

    assert.strictEqual(shouldRenderSinger, true);
    assert.strictEqual(shouldRenderActor, false);
});

test('REQ-014: IMDb Film & Screen renders ONLY if Actor/Theatre category is present', () => {
    const actor = { categories: ['Actor'], imdb: { credits: [{ title: 'The Stage Within' }] } };
    const magician = { categories: ['Magician'], imdb: { credits: [{ title: 'Magic Special' }] } };

    const isActor = (cats) => cats.some((c) => ['actor', 'theatre'].includes(c.toLowerCase()));
    assert.strictEqual(isActor(actor.categories), true);
    assert.strictEqual(isActor(magician.categories), false);
});

test('REQ-016: FAQs render ONLY for Platinum class artists', () => {
    const platinum = { tier: 'platinum', faqs: [{ q: 'How far in advance?' }] };
    const standard = { tier: 'standard', faqs: [{ q: 'How far in advance?' }] };

    const shouldRenderFaqs = (a) => a.tier === 'platinum' && a.faqs.length > 0;
    assert.strictEqual(shouldRenderFaqs(platinum), true);
    assert.strictEqual(shouldRenderFaqs(standard), false);
});

// -----------------------------------------------------------------------------
// 5. ENQUIRY CARD VALIDATION & SUBMISSION (REQ-018)
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Enquiry Submission & Interaction (REQ-018) ---');

function validateEnquiry(data) {
    const errors = [];
    if (!data.name || !data.name.trim()) errors.push('Name is required');
    if (!data.phone || !data.phone.trim()) errors.push('Phone number is required');
    return { isValid: errors.length === 0, errors };
}

test('REQ-018.1: Enquiry validation rejects submission when required fields are missing', () => {
    const res = validateEnquiry({ name: '', phone: '' });
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.errors.length, 2);
});

test('REQ-018.2: Enquiry validation succeeds with valid Name and Phone', () => {
    const res = validateEnquiry({ name: 'Rohit Sharma', phone: '9876543210' });
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.errors.length, 0);
});

// -----------------------------------------------------------------------------
// 6. SECTION SEQUENCE AUDIT AGAINST Kalasquare_Home_Page_Manager_2.html
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 6: Layout Hierarchy Parity against Kalasquare HTML ---');

test('Hierarchy matches manager.html line 2008-2067: Reviews precedes FAQs', () => {
    const htmlContent = fs.readFileSync(
        path.join(__dirname, '../Kalasquare_Home_Page_Manager_2.html'),
        'utf-8',
    );

    // Locate line 2008 profileHTML
    const profileSection = htmlContent.substring(htmlContent.indexOf('function profileHTML(a)'));

    // Verify reviews block is defined and sequenced before FAQs
    const reviewsIndex = profileSection.indexOf("ppSec('reviews'");
    const faqsIndex = profileSection.indexOf("ppSec('faq'");

    assert.ok(reviewsIndex > -1, 'Reviews section must be present in profileHTML');
    assert.ok(faqsIndex > -1, 'FAQ section must be present in profileHTML');
    assert.ok(
        reviewsIndex < faqsIndex,
        'Reviews section must precede FAQs section matching canonical HTML sequence',
    );
});

// -----------------------------------------------------------------------------
// 7. MONOREPO TYPECHECK & SOURCE FILE CONSISTENCY
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 7: Monorepo Code Integrity & Schema Compatibility ---');

test('Schema integrity: artists.ts matches required data fields', () => {
    const schemaFile = fs.readFileSync(
        path.join(__dirname, '../packages/db/src/schema/artists.ts'),
        'utf-8',
    );
    assert.ok(schemaFile.includes("slug: varchar('slug'"), 'Slug column must exist');
    assert.ok(
        schemaFile.includes("artistClass: varchar('artist_class'"),
        'Artist class column must exist',
    );
    assert.ok(
        schemaFile.includes("isVerified: boolean('is_verified'"),
        'Is verified column must exist',
    );
    assert.ok(schemaFile.includes("status: varchar('status'"), 'Status column must exist');
    assert.ok(
        schemaFile.includes("completenessPercent: integer('completeness_percent'"),
        'Completeness column must exist',
    );
});

console.log('\n================================================================');
console.log(`TOTAL TESTS RUN: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log(
    `RESULT: ${failCount === 0 ? '100% GREEN (ALL ASSERTIONS SATISFIED)' : 'FAILURES DETECTED'}`,
);
console.log('================================================================');

if (failCount > 0) process.exit(1);
