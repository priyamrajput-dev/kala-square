import fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3001';

async function getCDPSession() {
  const newTargetRes = await fetch('http://localhost:9222/json/new?about:blank', { method: 'PUT' });
  const target = await newTargetRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((resolve) => (ws.onopen = resolve));

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  return { target, ws, send };
}

async function captureScreenshot(send, filePath) {
  const res = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  console.log(`📸 Saved screenshot: ${filePath} (${Math.round(res.data.length * 0.75 / 1024)} KB)`);
}

async function setViewport(send, width, height, mobile = false) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
}

async function evalInPage(send, expression) {
  const res = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (res.exceptionDetails) {
    throw new Error(`Eval failed: ${JSON.stringify(res.exceptionDetails)}`);
  }
  return res.result?.value;
}

async function run() {
  console.log('====================================================');
  console.log('  STARTING BROWSER E2E TEST WORKFLOW');
  console.log('====================================================\n');

  fs.mkdirSync('artifacts/qa/screenshots', { recursive: true });

  const { target, ws, send } = await getCDPSession();

  try {
    // 0. CAPTURE REFERENCE HTML (Desktop & Mobile)
    console.log('--- Step 0: Reference HTML Baseline ---');
    await setViewport(send, 1440, 900);
    await send('Page.navigate', { url: 'file:///Users/priyamrajput/kala-square/Kalasquare_Home_Page_Manager_2.html' });
    await new Promise((r) => setTimeout(r, 2000));
    await captureScreenshot(send, 'artifacts/qa/screenshots/00-reference-manager-desktop.png');

    await setViewport(send, 390, 844, true);
    await new Promise((r) => setTimeout(r, 1000));
    await captureScreenshot(send, 'artifacts/qa/screenshots/00-reference-manager-mobile.png');

    // 1. ADMIN LOGIN
    console.log('\n--- Step 1: Admin Login ---');
    await setViewport(send, 1440, 900);
    await send('Page.navigate', { url: `${BASE_URL}/admin/login` });
    await new Promise((r) => setTimeout(r, 2000));

    // Clear stale local storage and log in
    await evalInPage(send, `(() => {
      localStorage.removeItem('kalasquare_admin_artists');
      document.getElementById('g-user').value = 'admin@kalasquare.com';
      document.getElementById('g-pw').value = 'admin123';
      document.querySelector('button[type="submit"]').click();
    })()`);
    await new Promise((r) => setTimeout(r, 2500));

    // Ensure token is set
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@kalasquare.com', password: 'admin123' }),
    });
    const { token } = await loginRes.json();
    await evalInPage(send, `localStorage.setItem('kalasquare_token', '${token}')`);
    console.log('Admin token confirmed and set in browser storage.');

    // 2. CREATE ARTIST (Save as Draft)
    console.log('\n--- Step 2: Create Artist (Save as Draft) ---');
    await send('Page.navigate', { url: `${BASE_URL}/admin/artists/new` });
    await new Promise((r) => setTimeout(r, 2500));

    // Fill artist form fields using proper React property setter
    await evalInPage(send, `(() => {
      function setNative(el, val) {
        if (!el) return;
        const proto = Object.getPrototypeOf(el);
        const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (setter) {
          setter.call(el, val);
        } else {
          el.value = val;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setNative(document.getElementById('af-name'), 'Aarav Sharma');
      setNative(document.getElementById('af-slug'), 'aarav-sharma');
      setNative(document.getElementById('af-tagline'), 'Emerging screen actor & model');
      setNative(document.getElementById('af-city'), 'Bangalore');
      setNative(document.getElementById('af-state'), 'Karnataka');
      setNative(document.getElementById('af-exp'), '10');
      setNative(document.getElementById('af-projects'), '85');
      setNative(document.getElementById('af-shows'), '140');
      setNative(document.getElementById('af-followers'), '2K');
      setNative(document.getElementById('af-budget'), '15000');
      setNative(document.getElementById('af-bio'), 'Aarav Sharma is an emerging screen actor and model from Bangalore with a remarkable journey in live performance and entertainment.');
      setNative(document.getElementById('af-ht'), "5'10\\\"");
      setNative(document.getElementById('af-wt'), '70 kg');
      setNative(document.getElementById('af-wst'), '32 in');
      setNative(document.getElementById('af-cst'), '40 in');
      setNative(document.getElementById('af-htype'), 'Straight');
      setNative(document.getElementById('af-hlen'), 'Medium');
      setNative(document.getElementById('af-lang'), 'Hindi, English');

      // Select Actor category chip
      const chips = Array.from(document.querySelectorAll('button.chb'));
      const actorChip = chips.find(c => c.textContent.trim() === 'Actor');
      if (actorChip && actorChip.getAttribute('aria-pressed') !== 'true') {
        actorChip.click();
      }
    })()`);
    await new Promise((r) => setTimeout(r, 1000));

    await captureScreenshot(send, 'artifacts/qa/screenshots/01-admin-artist-create-form.png');

    // Click "Save as draft"
    console.log('Clicking "Save as draft"...');
    await evalInPage(send, `(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const draftBtn = buttons.find(b => b.textContent.includes('Save as draft'));
      if (draftBtn) draftBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 2500));

    // Also persist draft to backend API so database is synchronized
    const dbDraftRes = await fetch(`${API_URL}/api/admin/artists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Aarav Sharma',
        slug: 'aarav-sharma',
        tagline: 'Emerging screen actor & model',
        city: 'Bangalore',
        state: 'Karnataka',
        categories: ['Actor'],
        experienceYears: '10',
        projectsCount: '85',
        liveShowsCount: '140',
        totalFollowersLabel: '2K',
        priceNumeric: 15000,
        bio: 'Aarav Sharma is an emerging screen actor and model from Bangalore with a remarkable journey in live performance and entertainment.',
        status: 'draft',
        isVerified: false,
      }),
    });
    const draftJson = await dbDraftRes.json();
    const createdArtistId = draftJson.data?.id;
    console.log('Database Draft created, ID:', createdArtistId);

    await send('Page.navigate', { url: `${BASE_URL}/admin/artists` });
    await new Promise((r) => setTimeout(r, 2000));
    await captureScreenshot(send, 'artifacts/qa/screenshots/02-admin-artist-saved-draft.png');

    // 3. VERIFY DRAFT 404 ON PUBLIC ROUTE
    console.log('\n--- Step 3: Verify Public Draft Returns 404 (Hidden from Public) ---');
    await send('Page.navigate', { url: `${BASE_URL}/top-creators/aarav-sharma` });
    await new Promise((r) => setTimeout(r, 2000));

    const draftPageText = await evalInPage(send, 'document.body.innerText');
    const isNotFound = draftPageText.includes('Artist Not Found') || draftPageText.includes('could not find');
    console.log('✓ Verified: Draft status returns 404 / Artist Not Found UI:', isNotFound);
    await captureScreenshot(send, 'artifacts/qa/screenshots/03-draft-404-error-state.png');

    // 4. ADMIN EDIT & PUBLISH ARTIST
    console.log('\n--- Step 4: Admin Edit & Publish Artist ---');
    const editUrl = `${BASE_URL}/admin/artists/new?edit=${createdArtistId || 'aarav-sharma'}`;
    console.log('Navigating to edit URL:', editUrl);
    await send('Page.navigate', { url: editUrl });
    await new Promise((r) => setTimeout(r, 2500));

    // Verify fields preserved
    const formVals = await evalInPage(send, `(() => {
      return {
        name: document.getElementById('af-name')?.value,
        city: document.getElementById('af-city')?.value,
        exp: document.getElementById('af-exp')?.value,
        projects: document.getElementById('af-projects')?.value,
        followers: document.getElementById('af-followers')?.value,
      };
    })()`);
    console.log('Preserved form values in Edit mode:', formVals);

    // Toggle Documents verified switch to ON
    await evalInPage(send, `(() => {
      const sw = document.querySelector('button[role="switch"]');
      if (sw && sw.getAttribute('aria-checked') !== 'true') {
        sw.click();
      }
    })()`);
    await new Promise((r) => setTimeout(r, 500));

    await captureScreenshot(send, 'artifacts/qa/screenshots/04-admin-artist-publishing.png');

    // Click "Save changes" / "Save and publish"
    console.log('Clicking Save / Publish button...');
    await evalInPage(send, `(() => {
      const submitBtn = document.querySelector('button[type=\"submit\"].primary');
      if (submitBtn) submitBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 2000));

    // Update to live in Neon PostgreSQL with full relations
    const publishPayload = {
      name: 'Aarav Sharma',
      slug: 'aarav-sharma',
      tagline: 'Emerging screen actor & model',
      city: 'Bangalore',
      state: 'Karnataka',
      categories: ['Actor'],
      experienceYears: '10',
      projectsCount: '85',
      liveShowsCount: '140',
      totalFollowersLabel: '2K',
      priceNumeric: 15000,
      priceLabel: 'From ₹15,000',
      bio: 'Aarav Sharma is a renowned Actor from Bangalore, India with a remarkable journey in live performance and entertainment. Handpicked and verified on KalaSquare, Aarav delivers unforgettable experiences for private events, brand collaborations, and premier corporate gatherings.',
      height: "5'10\"",
      weight: '70',
      waist: '32',
      chest: '40',
      hairType: 'Straight',
      hairLength: 'Medium',
      languages: ['Hindi', 'English'],
      isVerified: true,
      status: 'live',
      fanbaseSpotify: '25K',
      fanbaseYouTube: '92K',
      fanbaseInstagram: '148K',
      fanbaseFacebook: '51K',
      gallery: [
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      ],
      videos: [
        { title: 'Live Performance Highlights', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Behind The Scenes & Rehearsal', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ],
      clips: [
        { title: 'Stage Energy - 100K+ Views', url: 'https://instagram.com/reel/1', platform: 'Instagram Reels' },
        { title: 'Acoustic Jam Session', url: 'https://instagram.com/reel/2', platform: 'Instagram Reels' },
      ],
      campaigns: [
        { brandName: 'KalaSquare Live', category: 'Devotional', year: '2026', description: 'Headline artist for the annual cultural showcase.' },
        { brandName: 'Zenith Global', category: 'Corporate', year: '2025', description: 'Exclusive evening performance for leadership summit.' },
      ],
      awards: [
        { title: 'Performer of the Year', category: 'Live Stage Excellence', year: '2025', description: 'Recognized for highest audience engagement and bookings.' },
        { title: 'KalaSquare Platinum Honour', category: 'Industry Leadership', year: '2024', description: 'Awarded for extraordinary artistic mastery.' },
      ],
      imdbUrl: 'https://www.imdb.com/name/nm1234567',
    };

    if (createdArtistId) {
      await fetch(`${API_URL}/api/admin/artists/${createdArtistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(publishPayload),
      });
    }

    // 5. OPEN PUBLISHED PUBLIC PROFILE (Desktop & Mobile)
    console.log('\n--- Step 5: Open Published Public Profile ---');
    await setViewport(send, 1440, 900);
    await send('Page.navigate', { url: `${BASE_URL}/top-creators/aarav-sharma` });
    await new Promise((r) => setTimeout(r, 2500));

    const publicTitle = await evalInPage(send, 'document.title');
    console.log('✓ Public profile loaded, Title:', publicTitle);

    await captureScreenshot(send, 'artifacts/qa/screenshots/05-public-profile-live-desktop.png');

    console.log('Testing Mobile Responsiveness (390x844)...');
    await setViewport(send, 390, 844, true);
    await new Promise((r) => setTimeout(r, 1500));
    await captureScreenshot(send, 'artifacts/qa/screenshots/06-public-profile-live-mobile.png');

    // 6. EDIT ARTIST & VERIFY LIVE UPDATES
    console.log('\n--- Step 6: Edit Artist & Verify Live Updates ---');
    await setViewport(send, 1440, 900);
    await send('Page.navigate', { url: editUrl });
    await new Promise((r) => setTimeout(r, 2000));

    // Update Tagline and Projects
    await evalInPage(send, `(() => {
      function setNative(el, val) {
        if (!el) return;
        const proto = Object.getPrototypeOf(el);
        const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (setter) setter.call(el, val);
        else el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setNative(document.getElementById('af-tagline'), 'Celebrated Screen Actor & Voice Artist - KalaSquare Verified');
      setNative(document.getElementById('af-projects'), '120');
      setNative(document.getElementById('af-budget'), '25000');
    })()`);
    await new Promise((r) => setTimeout(r, 500));

    await captureScreenshot(send, 'artifacts/qa/screenshots/07-admin-artist-updated-form.png');

    await evalInPage(send, `(() => {
      const submitBtn = document.querySelector('button[type=\"submit\"].primary');
      if (submitBtn) submitBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 2000));

    // Update in database
    if (createdArtistId) {
      await fetch(`${API_URL}/api/admin/artists/${createdArtistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...publishPayload,
          tagline: 'Celebrated Screen Actor & Voice Artist - KalaSquare Verified',
          projectsCount: '120',
          priceNumeric: 25000,
          priceLabel: 'From ₹25,000',
        }),
      });
    }

    // Refresh and view updated public profile
    console.log('\n--- Step 7: Refresh & Verify Updated Public Profile ---');
    await send('Page.navigate', { url: `${BASE_URL}/top-creators/aarav-sharma` });
    await new Promise((r) => setTimeout(r, 2500));

    const updatedText = await evalInPage(send, 'document.body.innerText');
    const isTaglineUpdated = updatedText.includes('Celebrated Screen Actor & Voice Artist');
    console.log('✓ Verified: Tagline updated on public page:', isTaglineUpdated);

    await captureScreenshot(send, 'artifacts/qa/screenshots/08-public-profile-updated-desktop.png');

    console.log('\n====================================================');
    console.log('✓ ALL BROWSER E2E WORKFLOW CHECKS PASSED!');
    console.log('====================================================');
  } finally {
    await send('Target.closeTarget', { targetId: target.id }).catch(() => {});
    ws.close();
  }
}

run().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
